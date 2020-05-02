const config = require('./config');
const path = require('path');
const express = require('express');
const logger = require('./utils/logger');
var multer = require("multer");
var minify = require('express-minify');
var zerorpc = require("zerorpc");
// const bodyParser = require('body-parser');
var fs = require('fs')
var http = require('http')
var upload = multer({ dest: "./download/" });

//import controllers
const sampleController = require('./controllers/controller-sample');

//create express app
const app = express();

var server = http.createServer(app)

var io = require("socket.io")(server, {
  pingTimeout: 15000
});
// io.set('transports', ['xhr-polling']);
// io.configure( function() {
//   io.set('close timeout', 60*60); // 24h time out
// });

const router = express.Router();
var publicPath = path.join(__dirname, 'public');
var case_data = '';

// zeroRPC related config
var zeroRPCclient = new zerorpc.Client();
zeroRPCclient.connect("tcp://127.0.0.1:4242");

zeroRPCclient.invoke("hello", "RPC", function(error, res, more) {
  
  if(res === "Hello, RPC") {
    logger.info("Python server connected");
  }
  if(error) {
    logger.error("Zero RPC error: " + error);
  }

});

app.use(router); // tell the app this is the router we are using
app.use(minify());
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
  var socketId = JSON.parse(req.body['filepond'])['socketId']
  imgpath = path.join(__dirname, req.file.path)

  if (socketId && imgpath) {
  // send request to python server for object detection
  zeroRPCclient.invoke("object_detection", imgpath, function(error, res, more) {
  
    console.log(res)
    
    if(error) {
      logger.error("Zero RPC error: " + error);
    }

    if (res > 0) {
      io.sockets.sockets[socketId].emit('mm_detected', {data: res});
    }
  
  });
  }


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
    // sampleController.getInfractions(data.lng, data.lat).then((res) => {
    //   logger.verbose("Now emitting infractions");
    //   socket.emit('cityInfractions', {
    //     infractions: res
    //   })
    // });
    // sampleController.getCompanies(data.lng, data.lat).then((res) => {
    //   logger.verbose("Now emitting companies");
    //   socket.emit('cityCompanies', {
    //     companies: res
    //   })
    // });
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