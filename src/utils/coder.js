const BASE64 = require('base-64');
const MD5 = require('md5');

exports.decodeBase64 = (value) => {
    try {
        return BASE64.decode(value);
    } catch (error) {
    }
    return value;
}

exports.encryptMD5 = (value) => {
    try {
        return MD5(value);
    } catch (error) {
    }
    return value;
}
