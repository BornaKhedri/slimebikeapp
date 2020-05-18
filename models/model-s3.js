const logger = require('../utils/logger');
const s3Util = require('../utils/s3Util');


module.exports.uploadToS3 = async (keyPrefix, filePath) => {
    try {
        result = await s3Util.uploadToS3(keyPrefix, filePath);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}
