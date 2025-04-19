const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    DeviceId: String,
    TimeStamp: Date,
    EXT_MODULE: String,
    SW_VERSION: String,
    HW_VERSION: String
});

const Startup = mongoose.model('t_Startup', StartupSchema,'t_Startup');

async function updateStartup(record) {
    await Startup.updateOne(
        { DeviceId: record.DeviceId },
        { $set: record },
        { upsert: true }
    );
}

async function saveStartup(record) {
    const collection = mongoose.connection.collection(`t_Startup_${record.DeviceId}`);
    await collection.insertOne(record);
}

module.exports = { updateStartup, saveStartup };
