'use strict';

const compress = require('compression');
const express = require('express');
var http = require('http');
const path = require('path');
var session = require('express-session');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
const server = require('./handlers.js');

const app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, ''));

const environment = process.env.NODE_ENV;

console.log('**ready**');

app.disable('etag');
app.use(compress());

app.use('/', express.static(path.join(__dirname)));

app.get('/status', function(req, res, next) {
    res.status(200).send("I'm up!");
});

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// app.listen(port, () => {
//     console.log(`Listening on port ${port}`);
// });

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});