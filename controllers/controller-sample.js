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
module.exports.getCompanies = async (city) => {
    try {
        let result = await sampleModel.getCompanies(city);
        console.log(result.rows)
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getTime error: ${error.message}`);
        res.status(500).json({status:'error', message: error.message, statusCode: 500});
    }
}

module.exports.getInfractions = async (city) => {
    try {
        let result = await sampleModel.getInfractions(city);
        console.log(result.rows)
        return result.rows;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getTime error: ${error.message}`);
        res.status(500).json({status:'error', message: error.message, statusCode: 500});
    }
}

module.exports.insertReport = async (report) => {
    try {
        let result = await sampleModel.insertReport(report);
        console.log(result)
        return result;
        // res.status(200).json(result.rows);
    } catch (error) {
        logger.error(`getTime error: ${error.message}`);
        // res.status(500).json({status:'error', message: error.message, statusCode: 500});
    }
}