shurl - URL shortener
==============================

This is a complete URL shortener web application. It contains the HTML UI client (single-page application with AJAX) to communicate with server (node.js).
The server use to store URL address Redis storage (http://redis.io/).

System requirements:
--------------------

- Installed Node.js server
- Installed Redis server

Config of the application in:
-----------------------------

    ./config/app.json

Logging
-------
Logs (`log4js`) are stored in the directory specified in the parameter `--logDir`.

Parameters for `log4js` in:

    ./config/log4js.json

Install with:
-------------
    npm install

Examples start service:
----------------------

    npm start

Start the service and open in the your browser:

    http://127.0.0.1:4444/shurl/


