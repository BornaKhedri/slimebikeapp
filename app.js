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
var aws_lambda = new AWS.Lambda({
  region: 'us-west-2',
  apiVersion: '2015-03-31'
});

// var rekognition = new AWS.Rekognition({
//   region: 'us-west-2',
//   apiVersion: '2016-06-27'
// });

//import controllers
const sampleController = require('./controllers/controller-sample');
const s3Controller = require('./controllers/controller-s3');

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

var lambda_params = {
  FunctionName: 'cp84_slimebike_bsd_node',
  Payload: ''
}
// Handle file upload and temp storage
app.post('/upload', upload.single('filepond'), (req, res, next) => {

  logger.info("upload initiated");
  // logger.info(req.file);
  // send back the filename so that filepond knows the file has been transferred
  res.send([req.file.filename]);

  // upload to AWS S3, a successful upload will initiate ML in cloud using Lambda function
  var fileType = 'images';
  var filePath = path.join(__dirname, 'download', req.file.filename);
  console.log(filePath)
  // fs.readFile(filePath, 'base64', (err, data) => {
  //   if (err) throw err;
  //   var img_string = data;

  //   var buffer = Buffer.from(data).toString('base64');
  //   console.log("Buffer generated");
  //   // console.log(buffer)
  //   // now that we have things in the right type, send it to rekognition
  //   rekognition.detectLabels({
  //     Image: {
  //       Bytes: buffer
  //     }
  //   }).promise()
  //     .then((res) => {

  //       // print out the labels that rekognition sent back
  //       console.log("within rekog")
  //       console.log(res);

  //     });
  //   // try {
  //   //   lambda_params.Payload = "this is a test"; //img_string;
  //   //   // console.log(lambda_params)
  //   //   const result = await (aws_lambda.invoke(lambda_params).promise());

  //   //   console.log('Success!');
  //   //   console.log(result);
  //   // } 
  //   // catch (error) {
  //   //   console.log("error in aws lambda - " + error)
  //   // }
  //   // lambda_params.Payload = JSON.stringify(img_string);
  //   // // console.log(lambda_params);
  //   // aws_lambda.invoke(lambda_params, function(err, data) {
  //   //   if (err) console.log(err, err.stack); // an error occurred
  //   //   else {
  //   //     console.log('Success!');
  //   //     console.log(data);           // successful response
  //   //   }    
  //   // });

  // });
  s3Controller.uploadToS3(fileType, filePath).then((res) => {
    logger.verbose("uploaded image to S3: " + res.Location);
    lambda_params.Payload = JSON.stringify(res.Location);

    aws_lambda.invoke(lambda_params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log('Success!');
        console.log(data);           // successful response
      }
    });
    // sns.subscribe(sns_params, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("SNS message recd.")
    //     console.log(data);

    //     // Request options
    //     var params = {
    //       Token: data.ResponseMetadata.RequestId, /* required */
    //       TopicArn: config.sns.topicARN
    //     };

    //     sns.confirmSubscription(params, function (err, data) {
    //       if (err) console.log(err, err.stack); // an error occurred
    //       else console.log(data);           // successful response
    //     });
    //     // res.send(data);
    //   }
    // });
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