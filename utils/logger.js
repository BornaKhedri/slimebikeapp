const config = require('../config');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, logstash } = format;
require('winston-daily-rotate-file');

const loggerFormat = printf(info => {
    return `${info.timestamp} | ${info.level}: ${info.message}`;
});
 
var fileTransport = new(transports.DailyRotateFile)({
    dirname: './logs',
    filename: 'slimebikeapp-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
});

const logger = createLogger({
    level: config.loggerLevel,
    format: combine(
        timestamp(), 
        logstash()
    ),
    transports: [
        new transports.Console(),
        fileTransport
    ]
    });

module.exports = logger;