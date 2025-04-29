const mongoose = require('mongoose');

const DoChannelSchema = new mongoose.Schema({
    DeviceId: String,
    TimeStamp: Date,
    Do_00: [String],
    Do_10: [String],
   
});


const DoChannel = mongoose.model('t_Data_Feedback', DoChannelSchema,'t_Data_Feedback');

async function updateDoChannel(record) {
    await DoChannel.updateOne(
        { DeviceId: record.DeviceId },
        { $set: record },
        { upsert: true }
    );
}

async function saveDoData(record) {
    const collection = mongoose.connection.collection(`t_Data_Feedback_${record.DeviceId}`);
    await collection.insertOne({
        TimeStamp: record.TimeStamp,
        Do_00: record.Do_00,
        Do_10: record.Do_10,
       
    });
}

module.exports = { updateDoChannel, saveDoData };