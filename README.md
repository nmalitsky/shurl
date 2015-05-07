shurl - URL shortener
==============================

This is a complete URL shortener web application. It contains the HTML UI client (single-page application with AJAX) to communicate with server (node.js).
The server can use to store URL address 2 types of storage: `JSON` files or `Redis` server (http://redis.io/).

System requirements:
--------------------

- Installed Node.js server
- Installed Redis server (optional)

Config of the application in:
-----------------------------

    ./config.json

If you have not installed Redis server, you can use the `JSON` files for storage in the folder specified in the startup parameter service `--dataDir` (see example below).
Specify in the file `./config.json` parameter `useRedis` to `false` and start the service.


Logging
-------
Logs (`log4js`) are stored in the directory specified in the parameter `--logDir`.

Parameters for `log4js` in:

    ./log4js.json

Install with:
-------------
    npm install shurl

Examples start service:
----------------------

- npm start
- node app --baseDir=./ --dataDir=./data/ --logDir=./logs/


Start the service and open in the your browser:

    http://127.0.0.1:4444/shurl/
# shurl 
