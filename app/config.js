require('dotenv').config()
var AWS = require('aws-sdk')
var SES = new AWS.SES({ apiVersion: '2010-12-01', region: 'us-west-2' });

config = {
    serviceName: process.env.SERVICENAME || 'boilerplate node express postgress app',
    port: process.env.PORT || 3000,
    loggerLevel: process.env.LOGGERLEVEL || 'debug',
    db: {
        user: process.env.DB_USER || '',
        database: process.env.DB || '',
        password: process.env.DB_PASS || '',
        host: process.env.DB_HOST || '',
        port: parseInt(process.env.DB_PORT) || 5432,
        max: parseInt(process.env.DB_MAX_CLIENTS) || 20,
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS) || 30000
    }, 
    server: {
        host: process.env.SERVER_HOST
    }, 
    email: {
        transport: SES, 
        from: 'admin@misplacedwheels.com', 
        subject: 'Misplaced Wheels Report',
        attachmentName: 'reportimage.png'
    }, 
    geocoder: {
        provider: 'here', 
        apiKey: process.env.HERE_API_KEY
    }, 
    cloudwatch: {
        logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
        region: process.env.AWS_REGION
    }
}

module.exports = config;