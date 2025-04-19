const { updateStartup, saveStartup } = require('../models/startupModel');

async function handleStartupMessage(req, res) {
    try {
        const data = req.body;
        const parsedRecord = convertStartupData(data);

        if (!parsedRecord) {
            return res.status(400).json({ error: "Invalid startup data format" });
        }

        await updateStartup(parsedRecord);
        await saveStartup(parsedRecord);

        res.status(200).json({ message: "Startup data processed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error processing startup data" });
    }
}

function convertStartupData(data) {
    try {
        let result = [];
        let dataStr = data.slice(4, data.indexOf('#'));
        let stringSplit = dataStr.split(',');

        let DeviceId = stringSplit[0];
        let EXT_MODULE = stringSplit[1];
        let SW_VERSION = stringSplit[2];
        let HW_VERSION = stringSplit[3];

        return {
            DeviceId,
            TimeStamp: new Date(),
            EXT_MODULE,
            SW_VERSION,
            HW_VERSION
        };
        return result;
    } catch (error) {
        console.error("Error parsing startup data:", error);
        return null;
    }
}

module.exports = { handleStartupMessage };
