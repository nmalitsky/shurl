var fs = require('fs'),
    path = require('path'),
    redis = require('redis');

var log4js = require('log4js');

var Storage = function (_config, _dirs) {
    var config = _config;
    var dirs = _dirs;

    log4js.configure(path.join(dirs.baseDir, 'log4js.json'), { cwd: dirs.logDir });
    var log = log4js.getLogger('AppLogger');
    var err_log = log4js.getLogger('ErrorLogger');

    var cnt = 0;
    var url2short = {};
    var short2url = {};

    if (config.useRedis) {
        client = redis.createClient(config.redis.port, config.redis.host);
        client.on('error', function (err) {
            console.log('Can`t connect to Redis Server ' + config.redis.host + ':' + config.redis.port + " - the server is stopped");
            log.error('Can`t connect to Redis Server ' + config.redis.host + ':' + config.redis.port + " - the server is stopped");
            err_log.error('Can`t connect to Redis Server ' + config.redis.host + ':' + config.redis.port + " - the server is stopped");
            process.exit(1);
        });
    }

    return {
        init: function () {
            if (config.useRedis) {
                client.get('cnt', function (err, reply) {
                    if (reply) cnt = Number(reply);
                });
                client.hgetall('url2short', function (err, reply) {
                    if (reply) url2short = reply;
                });
                client.hgetall('short2url', function (err, reply) {
                    if (reply) short2url = reply;
                });
                console.log("Server use Redis storage");
                log.info("Server use Redis storage");
            } else {
                try {
                    cnt = fs.existsSync(path.join(dirs.dataDir, 'cnt.json')) ? Number(fs.readFileSync(path.join(dirs.dataDir, 'cnt.json'), {encoding: 'utf-8'})) : 0;
                    url2short = fs.existsSync(path.join(dirs.dataDir, 'url2short.json')) ? JSON.parse(fs.readFileSync(path.join(dirs.dataDir, 'url2short.json'), {encoding: 'utf-8'})) : {};
                    short2url = fs.existsSync(path.join(dirs.dataDir, 'short2url.json')) ? JSON.parse(fs.readFileSync(path.join(dirs.dataDir, 'short2url.json'), {encoding: 'utf-8'})) : {};
                } catch (err) {
                    console.log(err.message + " - the server is stopped");
                    log.error(err.message + " - the server is stopped");
                    err_log.error(err.message + " - the server is stopped");
                    process.exit(1);
                }
                console.log("Server use JSON storage");
                log.info("Server use JSON storage");
            }
        }
        ,
        update: function (longUrl, _shortUrl) {
            url2short[longUrl] = _shortUrl;
            short2url[_shortUrl] = longUrl;
            cnt++;

            if (config.useRedis) {
                client.hmset("url2short", longUrl, _shortUrl);
                client.hmset("short2url", _shortUrl, longUrl);
                client.set("cnt", cnt);
            } else {
                fs.writeFile(path.join(dirs.dataDir, 'cnt.json'), cnt, function (err) {
                    if (err) {
                        log.error('Can`t write to file ' + path.join(dirs.dataDir, 'cnt.json'));
                        err_log.error('Can`t write to file ' + path.join(dirs.dataDir, 'cnt.json'));
                        return console.log(err);
                    }
                });
                fs.writeFile(path.join(dirs.dataDir, 'url2short.json'), JSON.stringify(url2short, null, 2), function (err) {
                    if (err) {
                        log.error('Can`t write to file ' + path.join(dirs.dataDir, 'url2short.json'));
                        err_log.error('Can`t write to file ' + path.join(dirs.dataDir, 'url2short.json'));
                        return console.log(err);
                    }
                });
                fs.writeFile(path.join(dirs.dataDir, 'short2url.json'), JSON.stringify(short2url, null, 2), function (err) {
                    if (err) {
                        log.error('Can`t write to file ' + path.join(dirs.dataDir, 'short2url.json'));
                        err_log.error('Can`t write to file ' + path.join(dirs.dataDir, 'short2url.json'));
                        return console.log(err);
                    }
                });
            }
        }
        ,
        getShortUrl: function (longUrl) {
            return url2short[longUrl];
        }
        ,
        getLongUrl: function (_shortUrl) {
            return short2url[_shortUrl];
        }
        ,
        getCnt: function () {
            return cnt;
        }
    }
};

module.exports = Storage;


