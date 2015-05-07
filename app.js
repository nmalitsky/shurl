var http = require('http'),
    parse = require('url').parse,
    fs = require('fs'),
    path = require('path');

var Dirs = require('./app_modules/dirs'),
    dirs = new Dirs();

var Config = require('./app_modules/config');
    config = new Config(dirs);

// storage for url maps
var Storage = require('./app_modules/storage'),
    storage = new Storage(config, dirs);
storage.init();

var log4js = require('log4js');
log4js.configure(path.join(dirs.baseDir, 'log4js.json'), { cwd: dirs.logDir });
var log = log4js.getLogger('AppLogger');
var err_log = log4js.getLogger('ErrorLogger');

var _shortUrlLength = 5;

// base62 converter
var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var getShortUrl = function (num) {
    var _shortUrl = '';
    do {
        _shortUrl = chars[num % 62] + _shortUrl;
    }
    while (num = Math.floor(num / 62));
    return _shortUrl;
};

// http server
var srv = http.createServer(function (req, res) {
    var param = parse(req.url, true);
    switch (param.pathname) {
        case config.uiPath:
            var htmlFile = path.join(dirs.baseDir, config.indexPage);
            fs.exists(htmlFile, function (exists) {
                if (exists) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    fs.createReadStream(htmlFile).pipe(res);
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('404 - Requested url not found');
                }
            });
            break;

        case '/add/':
            if (param.query.url != undefined) {
                var _shortUrl = storage.getShortUrl(param.query.url);
                if (_shortUrl == undefined) {
                    _shortUrl = getShortUrl(storage.getCnt());
                    while (_shortUrl.length < _shortUrlLength) {
                        _shortUrl = chars[0] + _shortUrl;
                    }
                    storage.update(param.query.url, _shortUrl)
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(JSON.stringify({
                    shortUrl: 'http://' + config.host + ':' + config.port + '/' + _shortUrl,
                    _shortUrl: _shortUrl
                }));
            }
            break;

        default:
            var longUrl = storage.getLongUrl(param.pathname.substring(1));
            if (longUrl != undefined) {
                res.writeHead(302, {'Location': longUrl});
                res.end();
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 - Requested url not found');
            }
    }
}).listen(config.port, config.host);

console.log('Server running at http://' + config.host + ':' + config.port);
console.log('Open in you browser http://' + config.host + ':' + config.port + config.uiPath);

log.info('Server running at http://' + config.host + ':' + config.port);
log.info('Open in you browser http://' + config.host + ':' + config.port + config.uiPath);