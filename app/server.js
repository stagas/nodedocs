/*
 * Nodedocs
 */

// Dependencies

var path = require('path');
var express = require('express');
require('express-prettylogger');

// Create server

var app = express.createServer();

// Export app

exports = module.exports = app;

// Settings

var settings = app.settings;
app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('secret', 'your secret');
});

// Middleware

app.configure(function () {
  app.use(function (req, res, next) {
    express.errorHandler.title = app.settings.name;
    req.connection.remoteAddress
    = req.headers['ip']
    = req.headers['ip']
      || req.headers['x-ip']
      || req.headers['x-real-ip']
      || req.connection.remoteAddress;
    next();
  });
  app.use(express.logger('pretty'));
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.settings.secret));
  app.use(express.session({ secret: app.settings.secret }));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(function (req, res, next) {
    res.statusCode = 404;
    res.render('error', { title: '404 Not Found' });
  });
});

app.configure('development', function () {
  app.use(express.errorHandler({
    'stack': true
  , 'dump': true
  }));
});

app.configure('production', function () {
  app.error(function (err, req, res, next) {
    console.error(err.stack);
    res.statusCode = 500;
    res.render('error', { title: '500 Server Error' });
  });
});

// nodedocs

var fs = require('fs')
var docs, docsJson
try {
  docs = require('./all.json')
  docsJson = JSON.stringify(docs)
} catch (_) {
  ;(function getDocs () {
    console.log('Getting docs...')
    require('http').get(require('url').parse('http://nodejs.org/api/all.json'), function (res) {
      res.setEncoding('utf8')
      var body = ''
      res.on('data', function (chunk) { body += chunk })
      res.on('end', function () {
        try {
          docs = JSON.parse(body)
          docsJson = body
          fs.writeFileSync(__dirname + '/all.json', body)
          console.log('Got docs json')
        } catch (_) {
          console.log('Error with docs, getting docs again')
          setTimeout(function () {
            getDocs()
          }, 1000)
        }
      })
    })
  }());
}

// Locals

app.locals({
  title: 'Node.js docs'
});

// Dynamic helpers

app.dynamicHelpers({
  statusCode: function (req, res) { return res.statusCode; }
, docs: function () { return docs }
, docsJson: function () { return docsJson }
});

// Routes

app.get('/', function (req, res) {
  res.render('index');
});
