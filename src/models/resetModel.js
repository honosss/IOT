const mongoose = require('mongoose');

// Định nghĩa schema cho SYS/RESET
const ResetSchema = new mongoose.Schema({
    DeviceId: String,
    TimeStamp: Date,
    ResetReason: String,
    ResetCount: Number
});

// Tạo model cho collection t_Reset
const Reset = mongoose.model('t_Reset', ResetSchema, 't_Reset');

// Hàm cập nhật hoặc thêm mới bản ghi reset
async function updateReset(record) {
    await Reset.updateOne(
        { DeviceId: record.DeviceId },
        { $set: record },
        { upsert: true }
    );
}

// Hàm lưu bản ghi reset vào collection
async function saveReset(record) {
    const collection = mongoose.connection.collection(`t_Reset_${record.DeviceId}`);
    await collection.insertOne(record);
}

module.exports = { updateReset, saveReset };