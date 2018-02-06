'use strict';

const compress = require('compression');
const express = require('express');
var http = require('http');
const path = require('path');
var session = require('express-session');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
//const server = require('./handlers.js');

const app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, ''));
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: path.join(__dirname, '/app/public') }));
app.use(express.static(path.join(__dirname, '/app/public')));

const environment = process.env.NODE_ENV;

var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'node-login';

var dbURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
if (app.get('env') == 'live') {
    // prepend url with authentication credentials // 
    dbURL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + dbHost + ':' + dbPort + '/' + dbName;
}

app.use(session({
    secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: dbURL })
}));

require(path.join(__dirname, '/server/routes.js'))(app);

// console.log('**ready**');

// app.disable('etag');
// app.use(compress());

// app.use('/', express.static(path.join(__dirname)));

// app.get('/status', function(req, res, next) {
//     res.status(200).send("I'm up!");
// });

// app.use(function(req, res) {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});