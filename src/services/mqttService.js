const mqtt = require('mqtt');
require('dotenv').config()
const { handleAidata } = require('../controllers/AiController');
const { handleStartupMessage } = require('../controllers/startupController');
const { handleDiMessage } = require('../controllers/DiController');

const client = mqtt.connect(process.env.MQTT_BROKER, {
    username : process.env.MQTT_USERNAME,
    password : process.env.MQTT_PASSWORD 
    
});
function start() {
    client.on('connect', () => {
        console.log('✅ Connected to MQTT broker');
        client.subscribe(['SYS/AI_DATA', 'SYS/DI_DATA', 'SYS/STARTUP']);
    });

    client.on('message', async (topic, message) => {
        try {
            let dataString = message.toString();
            //console.log(`📩 Received on ${topic}:`, dataString);

            if (topic === 'SYS/AI_DATA') {
                const data = JSON.parse(dataString);
                await handleAidata({ body: data }, { status: () => ({ json: console.log }) });
            } 
            else if (topic === 'SYS/DI_DATA') {
                //console.log(`📥 Raw DI Data: ${dataString}`);  // Debug dữ liệu thô
                
                handleDiMessage({ body: dataString }, { status: () => ({ json: console.log }) });
            }
            
            // else if (topic === 'SYS/STARTUP') {

            //     await handleStartupMessage({ body: dataString }, { status: () => ({ json: console.log }) });
            // }
        } catch (err) {
            console.error(`❌ Error processing message on topic ${topic}:`, err);
        }
    });
}



module.exports = { start };

