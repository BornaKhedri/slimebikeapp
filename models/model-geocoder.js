const logger = require('../utils/logger');
const geocoderUtil = require('../utils/geocoderUtil');

module.exports.getCity = async (lat, lng) => {
    try {
        result = await geocoderUtil.getCity(lat, lng);
        return result;
    } catch (error) {
        logger.error(`getCity error in model: ${error.message}`);
        throw new Error(error.message);
    }
}