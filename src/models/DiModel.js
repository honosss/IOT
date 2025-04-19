const mongoose = require('mongoose');

const DiChannelSchema = new mongoose.Schema({
    ChannelId: String,
    DeviceId: String,
    TimeStamp: Date,
    Di_00: [String],
    Di_10: [String],
    is_do: Number
});


const DiChannel = mongoose.model('t_Data_Input', DiChannelSchema,'t_Data_Input');

async function updateDiChannel(record) {
    await DiChannel.updateOne(
        { ChannelId: record.ChannelId },
        { $set: record },
        { upsert: true }
    );
}

async function saveDiData(record) {
    const collection = mongoose.connection.collection(`t_Data_Input_${record.DeviceId}`);
    await collection.insertOne({
        TimeStamp: record.TimeStamp,
        Di_00: record.Di_00,
        Di_10: record.Di_10,
        is_do: record.is_do
    });
}

module.exports = { updateDiChannel, saveDiData };