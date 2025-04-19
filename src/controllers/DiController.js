const { updateDiChannel, saveDiData } = require('../models/DiModel');


async function handleDiMessage(req, res) {
    try {
        const data = req.body;
        const records = convertDiData(data);
        for (const record of records) {
            await updateDiChannel(record);
            await saveDiData(record);
        }
        //res.status(200).json({ message: "DI data processed successfully" });
        res.status(200);
    } catch (err) {
        res.status(500).json({ error: "Error processing DI data" });
    }
}

function convertDiData(data) {
    try {
    let result = [];
    if (data.length > 52) {
        let data1 = data.slice(4, data.indexOf('#'));
        let stringSplit = data1.split(',');
        let deviceid = stringSplit[0];

        let Di0 = stringSplit[1];
        let Di1 = stringSplit[2] + stringSplit[3];
        let Di0ar = Di0.split('');
        let Di1ar = Di1.split('');
        let timestamp = new Date();
        // result.push({
        //             ChannelId: `${deviceid}_Input`,
        //             DeviceId: deviceid,
        //             TimeStamp: timestamp,
        //             Di_00: Di0ar,
        //             Di_10: Di1ar,
        //             is_do: 1
        //         });
        if (deviceid !== 'MA120') {
            result.push({
                ChannelId: `${deviceid}_Input`,
                DeviceId: deviceid,
                TimeStamp: timestamp,
                Di_00: Di0ar,
                Di_10: Di1ar,
                is_do: 1
            });
        }
    }
    return result;
    } catch (err) {
        console.error("❌ Error processing DI data:", err);
        return null;
    }
}

module.exports = { handleDiMessage  };