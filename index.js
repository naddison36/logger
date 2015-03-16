var winston = require('winston'),
    Loggly = require('winston-loggly').Loggly,
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
var logLevel = loggerConfig.logLevel || "warn";

var logLevels = getLogLevels(loggerConfig);

// instantiate a winston logger with console output
var logger = module.exports = new (winston.Logger)({
    levels: logLevels,
    transports: [
      new (winston.transports.Console)({level: logLevel, colorize: true})
    ]
});

addLoggly(logLevel);

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

function addLoggly(logLevel)
{
    // if no Loggly configuration then return
    if (!loggerConfig.loggly || !loggerConfig.loggly.subdomain || !loggerConfig.loggly.inputToken) return;

    // configure Loggly settings
    var logglyOptions = {
        level: logLevel,
        subdomain: loggerConfig.loggly.subdomain,
        inputToken: loggerConfig.loggly.inputToken,
        json: false,
        tag: loggerConfig.loggly.tag || 'logger'
    };

    // add Loggly to logger
    logger.add(Loggly, logglyOptions);
}