const logger = require('../utils/logger');
const config = require('../config.js');
const mlUtil = require('../utils/mlUtil');

module.exports.detectbikeshare = async (filePath) => {

    try {
        var cmd = 'curl --location --request POST "' + config.mlApi.url +  config.mlApi.path +
        '" --header "Content-Type: text/plain" \
        --data-binary @"' + filePath + '"';
        var result = mlUtil.execShellCommand(cmd);
        return result;
    } catch (error) {
        logger.error(`detectbikeshare error in model: ${error.message}`);
    }
}