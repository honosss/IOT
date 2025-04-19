let Buffer = require('buffer/').Buffer;

function checkSum(str) {
    let dat = Buffer.from(str, 'ascii');
    let len = str.length;
    let crc = 0;
    for (let i = 0; i < len; i++) {
        crc += dat[i];
    }
    crc &= 0xFF;

    crc = crc.toString('16') ;

    return crc;
}

let string ='$03,00000000,00000000000000000000000000000000#'
let chec = checkSum(string);
console.log(chec); // 0a
module.exports = {checkSum};