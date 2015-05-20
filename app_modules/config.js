var fs = require('fs'),
    path = require('path'),
    log4js = require('log4js');

var Config = function (dirs) {
    log4js.configure(path.join(dirs.baseDir, 'log4js.json'), { cwd: dirs.logDir });
    var log = log4js.getLogger('AppLogger');
    var err_log = log4js.getLogger('ErrorLogger');

    var config;
    var f_config = path.join(dirs.baseDir, 'config.json');
    if (fs.existsSync(f_config)) {
        try {
            config = JSON.parse(fs.readFileSync(f_config, {encoding: 'utf-8'}));
        } catch (err) {
            console.log("Error in JSON structure " + f_config + " - the server is stopped");
            log.error("Error in JSON structure " + f_config + " - the server is stopped");
            err_log.error("Error in JSON structure " + f_config + " - the server is stopped");
            process.exit(1);
        }
    } else {
        console.log("Can't find " + f_config + " - the server is stopped");
        log.error("Can't find " + f_config + " - the server is stopped");
        err_log.error("Can't find " + f_config + " - the server is stopped");
        process.exit(1);
    }


    // check params
    if (config.host == null) {
        console.log('Can`t find "host" in ' + f_config);
        log.error('Can`t find "host" in ' + f_config);
        err_log.error('Can`t find "host" in ' + f_config);
        process.exit(1);
    }

    if (config.port == null) {
        console.log('Can`t find "port" in ' + f_config);
        log.error('Can`t find "port" in ' + f_config);
        err_log.error('Can`t find "port" in ' + f_config);
        process.exit(1);
    }

    if (config.uiPath == null) {
        console.log('Can`t find "uiPath" in ' + f_config);
        log.error('Can`t find "uiPath" in ' + f_config);
        err_log.error('Can`t find "uiPath" in ' + f_config);
        process.exit(1);
    }

    if (config.indexPage == null) {
        console.log('Can`t find "indexPage" in ' + f_config);
        log.error('Can`t find "indexPage" in ' + f_config);
        err_log.error('Can`t find "indexPage" in ' + f_config);
        process.exit(1);
    }

    if (config.redis != null) {
        if (config.redis.host == null) {
            console.log('Can`t find "redis.host" in ' + f_config);
            log.error('Can`t find "redis.host" in ' + f_config);
            err_log.error('Can`t find "redis.host" in ' + f_config);
            process.exit(1);
        }

        if (config.redis.port == null) {
            console.log('Can`t find "redis.port" in ' + f_config);
            log.error('Can`t find "redis.port" in ' + f_config);
            err_log.error('Can`t find "redis.port" in ' + f_config);
            process.exit(1);
        }
    } else {
        console.log('Can`t find "redis" in ' + f_config);
        log.error('Can`t find "redis" in ' + f_config);
        err_log.error('Can`t find "redis" in ' + f_config);
        process.exit(1);
    }

    return config;
};

module.exports = Config;
