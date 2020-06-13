const logger = require('./../utils/logger');
const mlModel = require('./../models/model-ml');

// sample controller using transaction
module.exports.detectbikeshare = async (filePath) => {
    try {
        let result = await mlModel.detectbikeshare(filePath);
        // this is where you transform the result into something meaningful
        // var mlResponse = result["rekogResponse"]
        logger.info(result);
        return result;
    } catch (error) {
        logger.error(`detectbikeshare error in controller: ${error.message}`);
    }
}
