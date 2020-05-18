const logger = require('./../utils/logger');
const s3Model = require('./../models/model-s3');

module.exports.uploadToS3 = async (keyPrefix, filePath) => {
    try {
        result = await s3Model.uploadToS3(keyPrefix, filePath);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}