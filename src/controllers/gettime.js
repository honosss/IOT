const { getFormattedDateTime } = require('../helpers/timeUtils');
const { checkSum } = require('../helpers/checksum');
require('dotenv').config();

function gettime(inputData) {
    const stringSplit = inputData.split(',');
    const deviceId = stringSplit[1];
    
    // Lấy thời gian
    const { date, time } = getFormattedDateTime();
    
    // Tạo message và checksum
    const rawMessage = `$CMD05,${deviceId},TIME,${date},${time}#`;
    const checksum = checkSum(rawMessage);
    const fullMessage = `${rawMessage}${checksum}`;
    
    // Tạo lệnh mosquitto_pub
    return `mosquitto_pub -h ${process.env.SERVER_IP}-p ${process.env.SERVER_PORT} -m "${fullMessage}" -t SYS/CONFIG/${deviceId} -u ${process.env.MQTT_USERNAME} -P ${process.env.MQTT_PASSWORD}`;
}

module.exports = { gettime };