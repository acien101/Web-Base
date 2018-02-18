"use strict"

// REQUIRES ////////////////////////////////////////////////////////////
//Express stuff
var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var proxy = require('express-http-proxy');
var https = require('https');
var fs = require('fs');

//Log
var log = require('./utils/logger.js').Logger;

//Config
var config = require('./config.js').config;

// APPs ////////////////////////////////////////////////////////////////
var app = express();
app.use(express.static(__dirname + '/static'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'cambia esto cuando puedas',
    cookie: {
        maxAge: 1800000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(expressValidator());

// ROUTES, GET AND POST ////////////////////////////////////////////////

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.listen(config.web_port, config.web_host);
log("Web server listening: " + config.web_host + ":" + config.web_port);

var options = {
    key  : fs.readFileSync('ssl/key.pem'),
    ca   : fs.readFileSync('ssl/csr.pem'),
    cert : fs.readFileSync('ssl/cert.pem')
}

https.createServer(options, app).listen(config.web_secure_port, config.web_host);
log("Web secure server listening: " + config.web_host + ":" + config.web_secure_port);
