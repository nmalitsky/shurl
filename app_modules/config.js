var fs = require('fs'),
    path = require('path'),
    log4js = require('log4js');

var log = log4js.getLogger('AppLogger');
var err_log = log4js.getLogger('ErrorLogger');

var Config = function (configFile) {
    var config;
    if (fs.existsSync(configFile)) {
        try {
            config = JSON.parse(fs.readFileSync(configFile, {encoding: 'utf-8'}));
        } catch (err) {
            console.log("Error in JSON structure " + configFile + " - the server is stopped");
            log.error("Error in JSON structure " + configFile + " - the server is stopped");
            err_log.error("Error in JSON structure " + configFile + " - the server is stopped");
            process.exit(1);
        }
    } else {
        console.log("Can't find " + configFile + " - the server is stopped");
        log.error("Can't find " + configFile + " - the server is stopped");
        err_log.error("Can't find " + configFile + " - the server is stopped");
        process.exit(1);
    }


    // check params
    if (config.host == null) {
        console.log('Can`t find "host" in ' + configFile);
        log.error('Can`t find "host" in ' + configFile);
        err_log.error('Can`t find "host" in ' + configFile);
        process.exit(1);
    }

    if (config.port == null) {
        console.log('Can`t find "port" in ' + configFile);
        log.error('Can`t find "port" in ' + configFile);
        err_log.error('Can`t find "port" in ' + configFile);
        process.exit(1);
    }

    if (config.uiPath == null) {
        console.log('Can`t find "uiPath" in ' + configFile);
        log.error('Can`t find "uiPath" in ' + configFile);
        err_log.error('Can`t find "uiPath" in ' + configFile);
        process.exit(1);
    }

    if (config.indexPage == null) {
        console.log('Can`t find "indexPage" in ' + configFile);
        log.error('Can`t find "indexPage" in ' + configFile);
        err_log.error('Can`t find "indexPage" in ' + configFile);
        process.exit(1);
    }

    if (config.redis != null) {
        if (config.redis.host == null) {
            console.log('Can`t find "redis.host" in ' + configFile);
            log.error('Can`t find "redis.host" in ' + configFile);
            err_log.error('Can`t find "redis.host" in ' + configFile);
            process.exit(1);
        }

        if (config.redis.port == null) {
            console.log('Can`t find "redis.port" in ' + configFile);
            log.error('Can`t find "redis.port" in ' + configFile);
            err_log.error('Can`t find "redis.port" in ' + configFile);
            process.exit(1);
        }
    } else {
        console.log('Can`t find "redis" in ' + configFile);
        log.error('Can`t find "redis" in ' + configFile);
        err_log.error('Can`t find "redis" in ' + configFile);
        process.exit(1);
    }
    return config;
};

module.exports = Config;
