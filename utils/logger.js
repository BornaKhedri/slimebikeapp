const config = require('../config');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, logstash } = format;
require('winston-daily-rotate-file');
const CloudWatchTransport = require('winston-aws-cloudwatch')

const loggerFormat = printf(info => {
    return `${info.timestamp} | ${info.level}: ${info.message}`;
});

const fileTransport = new (transports.DailyRotateFile)({
    dirname: './logs',
    filename: 'slimebikeapp-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    format: format.combine(
        timestamp(),
        format.json()
    )
});

const cloudWatchTransport = new CloudWatchTransport({
    logGroupName: config.cloudwatch.logGroupName, // REQUIRED
    logStreamName: config.cloudwatch.logStreamName, // REQUIRED
    createLogGroup: true,
    createLogStream: true,
    submissionInterval: 2000,
    submissionRetryCount: 1,
    batchSize: 20,
    awsConfig: {
        // accessKeyId: config.awsAccessKey,
        // secretAccessKey: config.awsSecretKey,
        region: config.cloudwatch.region
    },
    format: format.combine(
        format.json()
    )
})

const consoleTransport = new transports.Console({
    'timestamp': true,
    format: format.combine(
        timestamp(),
        format.colorize(),
        format.simple()
    )
});

const logger = createLogger({
    level: config.loggerLevel,
    // format: combine(
    //     timestamp(),
    //     logstash()
    // ),
    transports: [
        consoleTransport,
        fileTransport,
        cloudWatchTransport
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ]
});

//
// Handle errors
//
logger.on('error', function (err) {
    console.log("Logging error: " + err);
});

// // adding cloudWatch as another log destination
// const cloudwatchConfig = {
//     logGroupName: 'testing',
//     logStreamName: 'first',
//     awsRegion: 'us-west-2'
//     // logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
//     // logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.NODE_ENV}`,
//     // messageFormatter: ({ level, message, additionalInfo }) =>    `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`
// }

// logger.add(new WinstonCloudWatch(cloudwatchConfig))

module.exports = logger;