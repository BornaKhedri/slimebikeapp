const config = require('./config');
const path = require('path');
const express = require('express');
const request = require('request');
const axios = require('axios');
var apigClientFactory = require('aws-api-gateway-client').default;
const logger = require('./utils/logger');
var multer = require("multer");
const fs = require('fs');
// const bodyParser = require('body-parser');
var http = require('http')
var upload = multer({ dest: "./download/" });
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var aws_lambda = new AWS.Lambda({
  region: 'us-west-2',
  apiVersion: '2015-03-31'
});

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

var postData = {
  body: ''
};

let axiosConfig = {
  headers: {
    'Content-Type': 'text/plain',
    "Access-Control-Allow-Origin": "*",
  }
};

//import controllers
const sampleController = require('./controllers/controller-sample');
const emailController = require('./controllers/controller-email');
// const geocoderController = require('./controllers/controller-geocoder');
const healthcheckController = require('./controllers/controller-healthcheck');
const mlController = require('./controllers/controller-ml');
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

router.get('/healthcheck', healthcheckController.healthcheck);

// Handle file upload and temp storage
app.post('/upload', upload.single('filepond'), async (req, res, next) => {

  logger.info("upload initiated");
  // logger.info(req.file);
  // send back the filename so that filepond knows the file has been transferred
  res.send([req.file.filename]);

  var filePath = path.join(__dirname, 'download', req.file.filename);
  console.log(filePath)

  mlController.detectbikeshare(filePath).then((res) => {
    // do something with the ml response 
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
    var filepath = path.join(__dirname, 'download', data.imageId);
    fs.unlink(filepath, (err) => {
      if (err) throw err;
      console.log(filepath + ' was deleted');
    });
  });

  socket.on('case_report', function (data) {
    var filepath = path.join(__dirname, 'download', data.case_data.imageId);
    case_data = data.case_data;

    // asynchronously read the image and then insert into database
    fs.readFile(filepath, 'base64', (err, data) => {
      if (err) throw err;
      case_data.img = data;
      // data.img = imageAsBase64;
      sampleController.insertReport(case_data).then(res => {
        logger.info(JSON.stringify(res) + " Inserted successfully")
        if (res) {
          var mispark_id = res[0].mispark_id;
          // send email to the company
          ids = emailController.sendEmail(case_data, mispark_id)
            .then(res => {

            });

          // delete the file locally after it has been inserted
          fs.unlink(filepath, (err) => {
            if (err) throw err;
            logger.info(filepath + ' was deleted');
          });
        }
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
  logger.info(`NODE_ENV: ${app.get('env')}`);
  logger.info(`server listening on port: ${config.port}`);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err)
  throw err
})

process.on('unhandledRejection', (err) => {
  logger.error('unhandled rejection', err)
})

module.exports = server