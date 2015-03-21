var winston = require('winston'),
    os = require('os'),
    config = require('config');

var original_NODE_ENV = process.env.NODE_ENV;

// set environment variable so config looks for the logger config file in the config folder. eg ./config/logger.EXT
// as per the following config doco, the config file can be in a number of different formats.
// eg .yml, .yaml, .coffee, .cson, .properties, .json, .json5, .hjson or .js
// https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order

// environment variable NODE_ENV sets the {deployment} name
// environment variable NODE_APP_INSTANCE sets the instance name.
// eg NODE_APP_INSTANCE=test will look for config file ./config/logger-test.EXT

// config items in env var NODE_CONFIG will override anything in the logger config file.
// eg NODE_CONFIG='{"logLevel":"debug"}' will override the logLevel in the logger config file
process.env.NODE_ENV = 'logger';

// loads the configuration from the config file
var loggerConfig = config.util.loadFileConfigs();

// restore original NODE_ENV environment variable
process.env.NODE_ENV = original_NODE_ENV;

// default the log level if it's not set in the config file or NODE_CONFIG environment variable. eg NODE_CONFIG='{"logLevel":"debug"}'
var globalLogLevel = loggerConfig.logLevel || "warn";

var logLevels = getLogLevels(loggerConfig);

// instantiate a winston logger with console output
var logger = module.exports = new (winston.Logger)({
    levels: logLevels
});

addStandardTransports(loggerConfig, globalLogLevel);

addAdditionalTransports(loggerConfig, globalLogLevel);

function getLogLevels(loggerConfig)
{
    // set custom level colors if in config
    if (loggerConfig.colors)
    {
        winston.addColors(loggerConfig.colors);
    }

    // if custom levels in config
    if (loggerConfig.levels)
    {
        // return custom levels from config
        return loggerConfig.levels;
    }
    else
    {
        // just return the default winston levels
        return winston.levels;

    }
}

function addTransport(transport, transportConfig, globalLevel)
{
    // if no transport config or has been explicitly disabled then do not add transport to logger
    if (!transport || !transportConfig || transportConfig.disable) return;

    // default transport log level to global level if not explicitly set in the transport config
    if (!transportConfig.level) transportConfig.level = globalLevel;

    // add transport to logger
    logger.add(transport, transportConfig);
}

function addStandardTransports(loggerConfig, globalLogLevel)
{
    // by default the console logger will be used - even if there is no console configuration
    // the console logger can be explicitly disabled with the console.disable flag in the logger configuration
    if (!loggerConfig.console) loggerConfig.console = {};

    addTransport(winston.transports.Console, loggerConfig.console, globalLogLevel);

    // load standard file transports if configuration exists
    if (loggerConfig.file && loggerConfig.file.datePattern)
    {
        // datePattern config exists so using DailyRotateFile transport
        addTransport(winston.transports.DailyRotateFile, loggerConfig.file, globalLogLevel);
    }
    else
    {
        // no datePattern config exists so using File transport
        addTransport(winston.transports.File, loggerConfig.file, globalLogLevel);
    }

    addTransport(winston.transports.Http, loggerConfig.http, globalLogLevel);
}

// load non standard transports if configuration exists
function addAdditionalTransports(loggerConfig, globalLogLevel)
{
    if (loggerConfig.loggly)
    {
        var Loggly = require('winston-loggly').Loggly;
        addTransport(Loggly, loggerConfig.loggly, globalLogLevel);
    }

    if (loggerConfig.mongodb)
    {
        var MongoDB = require('winston-mongodb').MongoDB;
        addTransport(MongoDB, loggerConfig.mongodb, globalLogLevel);
    }

    if (loggerConfig.couchdb)
    {
        var CouchDB = require('winston-couchdb').CouchDB;
        addTransport(CouchDB, loggerConfig.couchdb, globalLogLevel);
    }

    if (loggerConfig.redis)
    {
        addTransport(winston.transports.Redis, loggerConfig.redis, globalLogLevel);
    }

    if (loggerConfig.riak)
    {
        addTransport(winston.transports.Riak, loggerConfig.riak, globalLogLevel);
    }
}