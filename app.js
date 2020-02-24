const config = require('./config');
const path = require('path');
const express = require('express');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
var fs = require('fs')
var https = require('https')

var certOptions = {
  key: fs.readFileSync(path.resolve('cert/server.key')),
  cert: fs.readFileSync(path.resolve('cert/server.crt'))
}

//import controllers
const healthcheckController = require('./controllers/controller-healthcheck');
const sampleController = require('./controllers/controller-sample');

// if (cluster.isMaster) {
//     // create a worker for each CPU
//     // for (let i = 0; i < numCPUs; i++) {
//     //     cluster.fork();
//     // }
//     // cluster.on('online', (worker) => {
//     //     logger.info(`worker online, worker id: ${worker.id}`);
//     // });
//     // //if worker dies, create another one
//     // cluster.on('exit', (worker, code, signal) => {
//     //     logger.error(`worker died, worker id: ${worker.id} | signal: ${signal} | code: ${code}`);
//     //     cluster.fork();
//     // });
// } else {
//create express app
const app = express();
// var server = require('http').Server(app);

var server = https.createServer(certOptions, app)

var io = require('socket.io')(server);
const router = express.Router();
var publicPath = path.join(__dirname, 'public');


app.use(bodyParser.json());
app.use(router); // tell the app this is the router we are using
//healthcheck routes
//router.get('/', healthcheckController.healthcheck);

app.use(express.static(publicPath));
app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath + '/index.html'));
});

io.on('connection', function (socket) {
  console.log("Connected to a client");

  socket.on('city_sensed', function (data) {
    console.log("CIty:" + data.city);
    sampleController.getCompanies(data.city).then(res => socket.emit('cityCompanies', {
      companies: res
    }));
    sampleController.getInfractions(data.city).then(res => socket.emit('cityInfractions', {
      infractions: res
    }));

  })



  socket.on('case_report', function (data) {
    // console.log(data);
    sampleController.insertReport(data.case_data).then( res =>

      console.log(res + " Inserted successfully")
    )
  })
});

router.get('/healthcheck', healthcheckController.healthcheck);
// sampleController routes
router.get('/servertime', sampleController.getTime);
router.get('/transaction', sampleController.sampleTransaction);
// start the server
server.listen(config.port, config.server.host, function () {
  logger.info(`server listening on port: ${config.port}`);
});
//}