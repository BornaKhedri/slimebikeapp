const logger = require('./../utils/logger');
const sampleModel = require('./../models/model-sample');

// sample controller using transaction
module.exports.sampleTransaction = async (req, res) => {
    try {
        let result = await sampleModel.sampleTransaction();
        res.status(200).json({status:'ok', message: result, statusCode: 200});
    } catch (error) {
        logger.error(`sampleTransaction error: ${error.message}`);
        res.status(500).json({status:'error', message: error.message, statusCode: 500});
    }
}

// sample controller
module.exports.getCompanies = async (lng, lat) => {
    try {
        let result = await sampleModel.getCompanies(lng, lat);
        logger.info("getCompanies in controller returned: " + result.rows.length + " rows")
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getCompanies error in controller: ${error.message}`);

    }
}

module.exports.getCity = async (lng, lat) => {
    try {
        let result = await sampleModel.getCity(lng, lat);
        logger.info("getCity in controller returned : " + result.rows.length + " rows")
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getCity error in controller: ${error.message}`);

    }
}

module.exports.getInfractions = async (lng, lat) => {
    try {
        let result = await sampleModel.getInfractions(lng, lat);
        logger.info("getInfractions returned : " + result.rows.length + " rows")
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getInfractions error in controller: ${error.message}`);

    }
}

module.exports.insertReport = async (report) => {
    try {
        let result = await sampleModel.insertReport(report);
        // console.log(result)
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`insertReport error in controller: ${error.message}`);

    }
}