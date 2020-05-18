var AWS = require('aws-sdk')
var fs = require('fs')
var path = require('path')

const config = require('../config.js');
const logger = require('./logger');

const s3config = {
    bucketName: config.s3.bucketName,
    prefixName: config.s3.prefixName
}

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// call S3 to retrieve upload file to specified bucket 
var uploadParams = {
    Bucket: s3config.bucketName,
    Key: '',
    Body: ''
};

module.exports.uploadToS3 = async (keyPrefix, filePath) => {
    var fileName = path.basename(filePath);
    var fileStream = fs.createReadStream(filePath);

    fileStream.on('open', () => {
        logger.info('OPEN');
    })
    fileStream.on('end', () => {
        logger.info('END');
    })
    fileStream.on('close', () => {
        logger.info('CLOSE');
    })
    fileStream.on('error', function (err) {
        logger.error('File Error: ', err);
    });

    uploadParams.Body = fileStream;
    uploadParams.Key = path.join(s3config.prefixName, keyPrefix, fileName);

    try {
        // call S3 to retrieve upload file to specified bucket
        const response = await s3.upload(uploadParams).promise();
        return response;
    } catch (error) {
        logger.error(`s3 upload error: ${error.message}`);
        throw new Error(error.message);
    }


}
