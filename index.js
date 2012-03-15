//process.env.NODE_ENV = 'production';

var path = require('path');
var app = require('./app/server');

// Info

var dirname = __dirname;
var pkg = require(dirname + '/package.json');
var version = pkg.version || '0.1.0';
var name = pkg.name || path.basename(dirname) || 'node express app';
var NODE_ENV = process.env.NODE_ENV || 'development';

// App config

app.set('name', name);
app.set('version', version);
app.set('host', process.env.HOST || process.argv[3] || 'localhost');
app.set('port', +(process.env.PORT || process.argv[2] || 8080));

// Add settings to locals for convenience

app.locals(app.settings);

// Start

console.log(new Date().toUTCString());
console.log(':::\033[36m'
  , app.settings.name, 'v' + app.settings.version, '\033[0m');
console.log('NODE_ENV=' + (NODE_ENV === 'production'
  ? '\033[31m' + NODE_ENV
  : '\033[33m' + NODE_ENV
  ) + '\033[0m');

app.listen(app.settings.port, app.settings.host, function () {
  console.log('Listening @ \033[32mhttp://'
    + app.settings.host + ':' + app.settings.port + '\033[0m');
});
