const config = require('./config');
const path = require('path');
const express = require('express');
const logger = require('./utils/logger');
var multer = require("multer");
// const bodyParser = require('body-parser');
var fs = require('fs')
var http = require('http')
var upload = multer({ dest: "./download/" });
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const crypto = require('crypto');
const requestretry = require('requestretry');
const LRU = require('lru-cache');

function fieldsForSignature(type) {
  if (type === 'SubscriptionConfirmation' || type === 'UnsubscribeConfirmation') {
    return ['Message', 'MessageId', 'SubscribeURL', 'Timestamp', 'Token', 'TopicArn', 'Type'];
  } else if (type === 'Notification') {
    return ['Message', 'MessageId', 'Subject', 'Timestamp', 'TopicArn', 'Type'];
  } else {
    return [];
  }
}

const CERT_CACHE = new LRU({ max: 5000, maxAge: 1000 * 60 });

function fetchCert(certUrl, cb) {
  const cachedCertificate = CERT_CACHE.get(certUrl);
  if (cachedCertificate !== undefined) {
    cb(null, cachedCertificate);
  } else {
    requestretry({
      method: 'GET',
      url: certUrl,
      maxAttempts: 3,
      retryDelay: 100,
      timeout: 3000
    }, (err, res, certificate) => {
      if (err) {
        cb(err);
      } else {
        if (res.statusCode === 200) {
          CERT_CACHE.set(certUrl, certificate);
          cb(null, certificate);
        } else {
          cb(new Error(`expected 200 status code, received: ${res.statusCode}`));
        }
      }
    });
  }
}

const CERT_URL_PATTERN = /^https:\/\/sns\.[a-zA-Z0-9-]{3,}\.amazonaws\.com(\.cn)?\/SimpleNotificationService-[a-zA-Z0-9]{32}\.pem$/;

function validate(message, cb) {
  if (!('SignatureVersion' in message && 'SigningCertURL' in message && 'Type' in message && 'Signature' in message)) {
    console.log('missing field');
    cb(null, false);
  } else if (message.SignatureVersion !== '1') {
    console.log('invalid SignatureVersion');
    cb(null, false);
  } else if (!CERT_URL_PATTERN.test(message.SigningCertURL)) {
    console.log('invalid certificate URL');
    cb(null, false);
  } else {
    fetchCert(message.SigningCertURL, (err, certificate) => {
      if (err) {
        cb(err);
      } else {
        // TODO verifiy signature (insert next code block here)
        const verify = crypto.createVerify('sha1WithRSAEncryption');
        fieldsForSignature(message.Type).forEach(key => {
          if (key in message) {
            verify.write(`${key}\n${message[key]}\n`);
          }
        });
        verify.end();
        const result = verify.verify(certificate, message.Signature, 'base64');
        cb(null, result);
      }
    });
  }
}



//import controllers
const sampleController = require('./controllers/controller-sample');
const s3Controller = require('./controllers/controller-s3');

const sns_params = {
  TopicArn: config.sns.topicARN, 
  Protocol: config.sns.protocol, 
  Endpoint: 'https://misplacedwheels.com',
  ReturnSubscriptionArn: true
}
// Create promise and SNS service object
var sns = new AWS.SNS({ apiVersion: '2010-03-31', region: 'us-west-2' });

//create express app
const app = express();

var server = http.createServer(app)

var io = require("socket.io")(server, {
  pingTimeout: 15000
});

const router = express.Router();
var publicPath = path.join(__dirname, 'public');
var case_data = '';

app.use(router); // tell the app this is the router we are using
// const cors = require('cors');
// app.use(cors());
app.use(express.static(publicPath));
app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath + '/index.html'));
});

// Handle file upload and temp storage
app.post('/upload', upload.single('filepond'), (req, res, next) => {

  logger.info("upload initiated");
  // logger.info(req.file);
  // send back the filename so that filepond knows the file has been transferred
  res.send([req.file.filename]);

  // upload to AWS S3, a successful upload will initiate ML in cloud using Lambda function
  var fileType = 'images';
  var filePath = path.join(__dirname, 'download', req.file.filename);
  s3Controller.uploadToS3(fileType, filePath).then((res) => {
    logger.verbose("uploaded image to S3: " + res.Location);

    sns.subscribe(sns_params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("SNS message recd.")
        console.log(data);
        // res.send(data);
      }
    });
  });

});

io.on('connect', function (socket) {
  // console.log("Connected to a client");
  logger.info(socket.client.conn.server.clientsCount + ' users connected');
  // change this to get the city from the geofence
  socket.on('location_sent', function (data) {
    logger.info(`Location: ${data.lng}, ${data.lat}`);

    sampleController.getCity(data.lng, data.lat).then((res) => {

      sampleController.getInfractions(data.lng, data.lat).then((res) => {

        sampleController.getCompanies(data.lng, data.lat).then((res) => {
          logger.verbose("Now emitting companies");
          socket.emit('cityCompanies', {
            companies: res
          })
        });

        logger.verbose("Now emitting infractions");
        socket.emit('cityInfractions', {
          infractions: res
        })
      });

      logger.verbose("Now emitting city");
      socket.emit('cityName', {
        cityName: res
      })
    });
  });

  socket.on('delete_image', function (data) {
    // console.log(data);
    var filepath = path.join(__dirname, 'download', data.imageId);
    fs.unlink(filepath, (err) => {
      if (err) throw err;
      console.log(filepath + ' was deleted');
    });
  });

  socket.on('case_report', function (data) {
    var filepath = path.join(__dirname, 'download', data.case_data.imageId);
    case_data = data.case_data;
    // console.log(data);
    //data.case_data.img = fs.readFileSync(filepath, 'base64');
    // asynchronously read the image and then insert into database
    fs.readFile(filepath, 'base64', (err, data) => {
      if (err) throw err;
      case_data.img = data;
      // data.img = imageAsBase64;
      sampleController.insertReport(case_data).then(res => {
        logger.info(res + " Inserted successfully")
        // delete the file locally after it has been inserted
        fs.unlink(filepath, (err) => {
          if (err) throw err;
          logger.info(filepath + ' was deleted');
        });
      });
    });
  });

  socket.on('disconnect', function () {
    logger.info('socket disconnected. socket.id = ' + socket.id + ' , pid = ' + process.pid);
  });

  socket.on('error', function (err) {
    logger.info("Socket.IO Error: " + err.stack);
  });
});

io.on('disconnect', function (socket) {
  logger.info('Lost a socket. socket.id = ' + socket.id + ' , pid = ' + process.pid);
});

// start the server
server.listen(config.port, config.server.host, function () {
  logger.info(`server listening on port: ${config.port}`);
});
//}

module.exports = server