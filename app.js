var http = require('http'),
    parse = require('url').parse,
    fs = require('fs'),
    path = require('path'),
    log4js = require('log4js');

var Dirs = require('./app_modules/dirs'),
    dirs = new Dirs();

log4js.configure(path.join(dirs.baseDir, 'config/log4js.json'), {cwd: dirs.logDir});

var Config = require('./app_modules/config');
config = new Config(path.join(dirs.baseDir, 'config/app.json'));

// storage for SHURL
var Storage = require('./app_modules/storage'),
    storage = new Storage(config);

var MIN_SHORT_URL_PATH_LENGTH = 5;
// base62 converter
var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function createShortUrlPath(num) {
    var shortUrlPath = '';
    do {
        shortUrlPath = chars[num % 62] + shortUrlPath;
    }
    while (num = Math.floor(num / 62));
    return shortUrlPath;
}

// http server
var srv = http.createServer(function (req, res) {
    var param = parse(req.url, true);

    switch (param.pathname) {

        // load UI
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

        // create new short url from original url
        case '/add/':
            var originalUrl = param.query.url;
            if (originalUrl !== undefined) {
                storage.getShortForFull(originalUrl, function (err, shortUrlPath) {
                    if (shortUrlPath == undefined) {
                        shortUrlPath = createShortUrlPath(storage.getUid());
                        while (shortUrlPath.length < MIN_SHORT_URL_PATH_LENGTH) {
                            shortUrlPath = chars[0] + shortUrlPath;
                        }
                        storage.setShortForFull(shortUrlPath, originalUrl);
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(JSON.stringify({
                        shortUrl: 'http://' + config.host + ':' + config.port + '/' +
                        shortUrlPath,
                        shortUrlPath: shortUrlPath
                    }));
                });
            }
            break;

        // go to the original url to from short url
        default:
            var shortUrlPath = param.pathname.substring(1);
            storage.getFullForShort(shortUrlPath, function (err, originalUrl) {
                if (originalUrl != undefined) {
                    res.writeHead(302, {'Location': originalUrl});
                    res.end();
                } else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end('404 - Requested url not found');
                }
            });
    }
}).listen(config.port, config.host);

console.log('Server running at http://' +config.host + ':' + config.port);
console.log('Open in you browser http://' + config.host + ':' + config.port + config.uiPath);

