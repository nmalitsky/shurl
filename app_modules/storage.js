var path = require('path'),
    redis = require('redis');

var log4js = require('log4js');

var Storage = function (dirs, config) {
    log4js.configure(path.join(dirs.baseDir, 'log4js.json'), {cwd: dirs.logDir});
    var log = log4js.getLogger('AppLogger');
    var err_log = log4js.getLogger('ErrorLogger');

    var client = redis.createClient(config.redis.port, config.redis.host);
    client.on('error', function (err) {
        var redisSrv = config.redis.host + ':' + config.redis.port;
        console.log('Can`t connect to Redis Server ' + redisSrv + " - the server is stopped");
        log.error('Can`t connect to Redis Server ' + redisSrv + " - the server is stopped");
        err_log.error('Can`t connect to Redis Server ' + redisSrv + " - the server is stopped");
        process.exit(1);
    });

    var uid = 0;
    client.get('uid', function (err, reply) {
        if (reply) {
            uid = +reply;
        }
    });

    return {
        getUid: function () {
            return uid;
        },

        getShortForFull: function (originalUrl, callback) {
            client.hget("full2short", originalUrl, function (err, reply) {
                if (reply) {
                    return callback(null, reply);
                }
                return callback(null, undefined);
            });
        },

        getFullForShort: function (shortUrlPath, callback) {
            client.hget("short2full", shortUrlPath, function (err, reply) {
                if (reply) {
                    return callback(null, reply);
                }
                return callback(null, undefined);
            });
        },

        setShortForFull: function (shortUrlPath, originalUrl) {
            var shortUrl = 'http://' + config.host + ':' + config.port + '/' + shortUrlPath;
            log.info('Set short URL "' + shortUrl + '" for full URL "' + originalUrl + '"');

            client.hset("full2short", originalUrl, shortUrlPath, function (err, reply) {
                if (err) {
                    log.error('Can`t set short URL "' + shortUrl +
                    '" for full URL "' + originalUrl + '" [hash=full2short, uid=' + uid + ']');
                    err_log.error('Can`t set short URL "' + shortUrl +
                    '" for full URL "' + originalUrl + '" [hash=full2short, uid=' + uid + ']');
                }
            });

            client.hset("short2full", shortUrlPath, originalUrl, function (err, reply) {
                if (err) {
                    log.error('Can`t set short URL "' + shortUrl +
                    '" for full URL "' + originalUrl + '" [hash=short2full, uid=' + uid + ']');
                    err_log.error('Can`t set short URL "' + shortUrl +
                    '" for full URL "' + originalUrl + '" [hash=short2full, uid=' + uid + ']');
                }
            });

            client.set("uid", ++uid);
        }
    }
};

module.exports = Storage;


