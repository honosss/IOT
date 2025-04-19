const { saveData, updateChannel} = require('../models/AiModel');
async function handleAidata(req, res) {
    try {
        const data = req.body;
        const records = convertData(data);

        for (const record of records) {
            await updateChannel(record);
            await saveData(record);
           // console.log("🚀 Dữ liệu đã lưu:", record);

        }
       //res.status(200).json({ message: "Data processed successfully" });
       res.status(200);

    } catch (err) {
        console.error("🚨 Lỗi trong handleAiMessage:", err.message);
        res.status(500).json({ error: err.message || "Error processing data" });
    }
}

function convertData(data) {
    let result = [];
    if (data.Device_id && data.Data?.length > 0 && data.Device_id.trim() !== "") {
        let timestamp = new Date();
        if (data.Time?.length > 0) {
            let [year, month, day, hours, minutes, second] = [
                data.Time.slice(0, 4), data.Time.slice(4, 6), data.Time.slice(6, 8),
                data.Time.slice(8, 10), data.Time.slice(10, 12), data.Time.slice(12, 14)
            ];
            timestamp = new Date(year, month - 1, day, hours, minutes, second);
        }
      //console.log("🚀 data1:", data.Data[0].STA);
      //console.log("🚀 data1:", data.Data[0]);
        // Xử lý dữ liệu multi-satiation "G1", G2", "G3"..v..
        if (data.Data[0].STA === undefined) {
            //console.log("🚀 data222:", data.Data[0].STA);
            data.Data.forEach(item => {
                result.push({
                    ChannelId: `${data.Device_id}_${item.CN}`,
                    Station: item.STA,
                    Value: item.V,
                    DeviceId: data.Device_id,
                    Unit: item.U,
                    Status: item.St,
                    Mode: item.M,
                    TimeStamp: timestamp
                });
            });
           
        } else {
            data.Data.forEach(item => {
                result.push({
                    ChannelId: `${data.Device_id}_${item.STA}_${item.CN}`,
                    Channel: `${data.Device_id}_${item.CN}`,
                    Station: item.STA,
                    Value: item.V,
                    DeviceId: data.Device_id,
                    Unit: item.U,
                    Status: item.St,
                    Mode: item.M,
                    TimeStamp: timestamp
                });
            });
        }
    }
    return result;
}


module.exports = { handleAidata };