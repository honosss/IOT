const mqtt = require('mqtt');
require('dotenv').config()
const { handleAidata } = require('../controllers/AiController');
const { handleStartupMessage } = require('../controllers/startupController');
const { handleDiMessage } = require('../controllers/DiController');
const { handleDoMessage } = require('../controllers/DoController');
const { updateReset, saveReset } = require('../models/resetModel');
const { updateDisconnect, saveDisconnect } = require('../models/disconnectModel'); 
const {gettime} = require('../controllers/gettime');
const logger = require('../utils/logger');

const client = mqtt.connect(process.env.MQTT_BROKER, {
    username : process.env.MQTT_USERNAME,
    password : process.env.MQTT_PASSWORD 
    
});
function start() {
    client.on('connect', () => {
        logger.info('✅ Connected to MQTT broker');
        client.subscribe(['SYS/AI_DATA', 'SYS/DI_DATA', 'SYS/DO_DATA', 'SYS/STARTUP']);
    });

    client.on('message', (topic, message) => {
        const dataString = message.toString();
        
        // Xử lý từng topic trong các hàm async riêng biệt để chạy song song
        switch (topic) {
            case 'SYS/AI_DATA':
                (async () => {
                    try {
                        const data = JSON.parse(dataString);
                        await handleAidata({ body: data }, { status: () => ({ json: console.log }) });
                    } catch (err) {
                        logger.error(`❌ Error processing message on ${topic}: ${err}`);
                    }
                })();
                break;
            case 'SYS/DI_DATA':
                (async () => {
                    try {
                        await handleDiMessage({ body: dataString }, { status: () => ({ json: console.log }) });
                    } catch (err) {
                        logger.error(`❌ Error processing message on ${topic}: ${err}`);
                    }
                })();
                break;
                case 'SYS/DO_DATA':
                    (async () => {
                        try {
                            await handleDoMessage({ body: dataString }, { status: () => ({ json: console.log }) });
                        } catch (err) {
                            logger.error(`❌ Error processing message on ${topic}: ${err}`);
                        }
                    })();
                    break;
            case 'SYS/STARTUP':
                (async () => {
                    try {
                        await handleStartupMessage({ body: dataString }, { status: () => ({ json: console.log }) });
                        await gettime(dataString); // Gọi hàm gettime với dataString
                        logger.info(`✅ Processed SYS/STARTUP for DeviceId: ${dataString}`);
                    } catch (err) {
                        logger.error(`❌ Error processing message on ${topic}: ${err}`);
                    }
                })();
                break;
                case 'SYS/RESET':
                    (async () => {
                        try {
                            const data = JSON.parse(dataString);
                            await updateReset(data); // Cập nhật hoặc thêm mới
                            await saveReset(data);   // Lưu vào collection riêng
                            logger.info(`✅ Processed SYS/RESET for DeviceId: ${data.DeviceId}`);
                        } catch (err) {
                            logger.error(`❌ Error processing SYS/RESET: ${err}`);
                        }
                    })();
                    break;
                    case 'SYS/DISCONCT':
                        (async () => {
                            try {
                                const data = JSON.parse(dataString);
                                await updateDisconnect(data); // Cập nhật hoặc thêm mới
                                await saveDisconnect(data);   // Lưu vào collection riêng
                                logger.info(`✅ Processed SYS/DISCONCT for DeviceId: ${data.DeviceId}`);
                            } catch (err) {
                                logger.error(`❌ Error processing SYS/DISCONCT: ${err}`);
                            }
                        })();
                        break;    
            default:
                logger.warn(`Unhandled - topic: ${topic}`);
        }
    });
}
module.exports = { start };

