const logger = require('./../utils/logger');
const geocoderModel = require('./../models/model-geocoder');

module.exports.getCity = async (lat, lng) => {
    try {
        result = await geocoderModel.getCity(lat, lng);
        if (result) {
            city = result[0].city || 'Generic';
        } else { 
            city = 'Generic';
        }
        
        return city;
    } catch (error) {
        logger.error(`getCity error in controller: ${error.message}`);
    }
}
