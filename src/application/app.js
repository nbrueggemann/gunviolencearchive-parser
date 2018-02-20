/**
 * This is the main application object for this app.  Although not explicitely built as
 * a singleton it's expected that there will only ever be one of these instantiated.
 *
 * The job of this class is simple.  It constructs all main subsystems for the application
 * and holds the instance to those constructed sub systems.
 */
var express = require('express');
var cors = require('cors');
var fs = require("fs");
var http = require('http');
var https = require('https');
var bodyParser = require("body-parser");

var appConfig = require("./appConfig.json");

// Include the routes
var IncidentRoute = require('../routes/incident');
var Past72Hours = require('../routes/past72hours');

class Application {
    constructor() {

	}

	initialize () {
        // Pull in the config
        this.appConfig = appConfig;

        this._initializeExpress();
        this._initializeExpressRoutes();
    }

    _initializeExpress () {
        // Init express
        this.express = express();

        // Plugin our cors middleware
        this.express.use(cors());

        // Body parser middleware
        this.express.use(bodyParser.json({limit: '50mb'}));
        this.express.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

        // Create the express server
        http.createServer(this.express).listen(appConfig.appInfo.port);
    }

    _initializeExpressRoutes () {
        this.incidentRoute = new IncidentRoute(this.express, this.appConfig);
        this.past72Hours = new Past72Hours(this.express, this.appConfig);
    }

} // end class

module.exports = Application;
