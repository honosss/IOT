const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    ChannelId: String,
    Value: Number,
    DeviceId: String,
    Unit: String,
    Status: String,
    Mode: String,
    Station: String,
    TimeStamp: Date
});

const chanel = mongoose.model('t_Channel_Configurations', ChannelSchema, 't_Channel_Configurations');

const queue = [];
let processing = false; // Tránh xử lý cùng lúc nhiều lần

async function updateChannel(record) {
    queue.push(record); // Đẩy dữ liệu vào hàng đợi
}
// Định kỳ chạy batch update
setInterval(async () => {
    if (processing || queue.length === 0) return; // Nếu đang xử lý hoặc hàng đợi trống thì bỏ qua

    processing = true; // Đánh dấu đang xử lý
    const updates = queue.splice(0, queue.length); // Lấy tất cả dữ liệu trong hàng đợi

    const bulkOps = updates.map(record => ({
        updateOne: {
            filter: { ChannelId: record.ChannelId },
            update: {
                $set: { Value: record.Value,
                  DeviceId: record.DeviceId,
                  Unit: record.Unit,
                  Status: record.Status,
                  Mode: record.Mode ,
                  Station: record.Station},
                $max: { TimeStamp: record.TimeStamp }
            },
            upsert: true
        }
    }));
    await chanel.bulkWrite(bulkOps); // Chạy cập nhật hàng loạt
    processing = false; // Đánh dấu đã xong

    //console.log(`Updated ${updates.length} records`);
}, 2000);


async function saveData(record) {
  // console.log("🚀 data:", record.Station);
   // console.log("🚀 data:", record.ChannelId);
    if (typeof record.Station !== undefined) { 
        const collection = mongoose.connection.collection(`t_Data_${record.ChannelId}`);
        await collection.insertOne({ TimeStamp: record.TimeStamp, Value: record.Value });
    }else {
       // console.error("🚨 Lỗi trong saveData: Station không xác định");
        const collection = mongoose.connection.collection(`t_Data_${record.Channel}`);
        await collection.insertOne({ TimeStamp: record.TimeStamp, Value: record.Value });
        return;
    }
    // const collection = mongoose.connection.collection(`t_Data_${record.ChannelId}`);
    // await collection.insertOne({ TimeStamp: record.TimeStamp, Value: record.Value });
}


module.exports = { updateChannel, saveData};