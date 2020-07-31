var path = require('path');
var fs = require('fs');
const NodeGeocoder = require('node-geocoder');

const config = require('../config.js');
const logger = require('./logger');

const options = {
    provider: config.geocoder.provider, 
    apiKey: config.geocoder.apiKey
};

const geocoder = NodeGeocoder(options);

module.exports.getCity = async (lat, lng) => {
    logger.debug(`getCity lat: ${lat} | lng: ${lng}`);
    try {
        const res = await geocoder.reverse({ lat: lat, lon: lng });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}