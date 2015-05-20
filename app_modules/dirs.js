var fs = require('fs');

var Dirs = function () {
    var baseDir,
        dataDir,
        logDir,
        app_args = process.argv.slice(2);

    if (app_args[0] == '--help' || app_args[0] == '/?' ||
        app_args[0] == '/help' || app_args[0] == '/h' || app_args[0] == '-h') {
        console.log("Usage: node app " +
            "--baseDir=/path/to/app/ " +
            "--dataDir=/path/to/app/db " +
            "--logDir=/path/to/app/log");
        process.exit(1);
    }

    app_args.forEach(function (val) {
        global.par = val.split('=');
        switch (par[0]) {
            case '--baseDir':
                baseDir = par[1];
                break;
            case '--dataDir':
                dataDir = par[1];
                break;
            case '--logDir':
                logDir = par[1];
                break;
        }
    });

    if (!baseDir) {
        console.log("Can't find flag --baseDir");
        console.log("Usage: node app " +
        "--baseDir=/path/to/app/ " +
        "--dataDir=/path/to/app/db " +
        "--logDir=/path/to/app/log");
        process.exit(1);
    }

    if (!fs.existsSync(baseDir)) {
        console.log("Can't resolve path --baseDir=" + baseDir);
        process.exit(1);
    }

    if (!dataDir) {
        console.log("Can't find flag --dataDir");
        console.log("Usage: node app " +
        "--baseDir=/path/to/app/ " +
        "--dataDir=/path/to/app/db " +
        "--logDir=/path/to/app/log");
        process.exit(1);
    }

    if (!fs.existsSync(dataDir)) {
        console.log("Can't resolve path --dataDir=" + dataDir);
        process.exit(1);
    }

    if (!logDir) {
        console.log("Can't find flag --logDir");
        console.log("Usage: node app " +
        "--baseDir=/path/to/app/ " +
        "--dataDir=/path/to/app/db " +
        "--logDir=/path/to/app/log");
        process.exit(1);
    }

    if (!fs.existsSync(logDir)) {
        console.log("Can't resolve path --logDir=" + logDir);
        process.exit(1);
    }
    return {baseDir: baseDir, dataDir: dataDir, logDir: logDir};
};

module.exports = Dirs;
