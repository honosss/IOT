const mongoose = require('mongoose');

// Định nghĩa schema cho SYS/DISCONCT
const DisconnectSchema = new mongoose.Schema({
    DeviceId: String,
    TimeStamp: Date,
    Reason: String
});

// Tạo model cho collection t_Disconnect
const Disconnect = mongoose.model('t_Disconnect', DisconnectSchema, 't_Disconnect');

// Hàm cập nhật hoặc thêm mới bản ghi disconnect
async function updateDisconnect(record) {
    await Disconnect.updateOne(
        { DeviceId: record.DeviceId },
        { $set: record },
        { upsert: true }
    );
}

// Hàm lưu bản ghi disconnect vào collection
async function saveDisconnect(record) {
    const collection = mongoose.connection.collection(`t_Disconnect_${record.DeviceId}`);
    await collection.insertOne(record);
}

module.exports = { updateDisconnect, saveDisconnect };