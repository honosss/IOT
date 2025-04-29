const { updateDoChannel, saveDoData } = require('../models/DoModel');


async function handleDoMessage(req, res) {
    try {
        const data = req.body;
        const records = convertDoData(data);

        for (const record of records) {
            await updateDoChannel(record);
            await saveDoData(record);
        }
        //res.status(200).json({ message: "DI data processed successfully" });
        res.status(200);
    } catch (err) {
        res.status(500).json({ error: "Error processing DO data" });
    }
}

function convertDoData(data) {
    try {
    let result = [];
    if (data.length > 52) {
        let data1 = data.slice(4, data.indexOf('#'));
        let stringSplit = data1.split(',');
        let deviceid = stringSplit[0];

        let Do0 = stringSplit[2];
        let Do1 = stringSplit[3] ;
        let Do0ar = Do0.split('');
        let Do1ar = Do1.split('');
        let timestamp = new Date();

        result.push({
                    TimeStamp: timestamp,
                    DeviceId: deviceid,
                    Do_00: Do0ar,
                    Do_10: Do1ar,
                });
    }
    return result;
    } catch (err) {
        console.error("❌ Error processing DO data:", err);
        return null;
    }
}

module.exports = { handleDoMessage  };