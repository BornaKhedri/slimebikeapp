const config = require('./config');
const path = require('path');
const express = require('express');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
var fs = require('fs')
var http = require('http')

/*var certOptions = {
  key: fs.readFileSync(path.resolve('cert/server.key')),
  cert: fs.readFileSync(path.resolve('cert/server.crt'))
}*/

// Certificate
/*const privateKey = fs.readFileSync('./cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./cert/cert.pem', 'utf8');
const ca = fs.readFileSync('./cert/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};*/

//import controllers
const sampleController = require('./controllers/controller-sample');

//create express app
const app = express();
// var server = require('https').Server(app);

/*var server = https.createServer(credentials, app)*/
var server = http.createServer( app)

var io = require('socket.io')(server);
const router = express.Router();
var publicPath = path.join(__dirname, 'public');


app.use(bodyParser.json());
app.use(router); // tell the app this is the router we are using

app.use(express.static(publicPath));
app.get('/', function(req, res) {
  // res.sendStatus(200) 
  res.sendFile(path.join(publicPath + '/index.html'));
});

io.on('connection', function(socket) {
  console.log("Connected to a client");

  socket.on('city_sensed', function(data) {
    console.log("CIty:" + data.city);
    sampleController.getCompanies(data.city).then(res => socket.emit('cityCompanies', {
      companies: res
    }));
    sampleController.getInfractions(data.city).then(res => socket.emit('cityInfractions', {
      infractions: res
    }));

  });

  socket.on('case_report', function(data) {
    // console.log(data);
    sampleController.insertReport(data.case_data).then(res =>

      console.log(res + " Inserted successfully")
    )
  });

  socket.on('disconnect', function() {
    console.log('socket disconnected. socket.id=' + socket.id + ' . pid = ' + process.pid);
  });
});

io.on('disconnect', function(socket) {
  console.log('Lost a socket. socket.id=' + socket.id + ' . pid = ' + process.pid);
});

// start the server
server.listen(config.port, config.server.host, function() {
  logger.info(`server listening on port: ${config.port}`);
});
//}

module.exports = server
