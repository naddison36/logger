A configurable Winston logger
===============

A simple wrapper to the [Winston](https://github.com/winstonjs/winston) logger that allows options to be configured using [node-config](https://github.com/lorenwest/node-config).

## Install

`npm install config-logger`

## Usage

```javascript
var logger = require('config-logger');

// log the stack of an Error object
var err = new Error('something really bad happened');
logger.error(err.stack);

// two different logger calls to achieve the same result
logger.info('some interesting stuff just happened');
logger.level('info', 'some interesting stuff just happened');
```

See [Winston doco](https://github.com/winstonjs/winston#logging) for more info

## Design Principles

* logger options can be configured via configuration files or environment variables
* allow for environment specific configurations
* default console logger available after install without any configuration
* custom log levels can be set. eg trace, debug, info, warn and error
* logger transports can be explicitly enabled or disabled in configuration
* all logger transport options can be controlled through configuration

## Config
The logger will work without a configuration file. The default logging level will be set to "warn" with the following logging levels of: silly, debug, verbose, info, warn and error.

To override the default logger configuration create a logger config file in your ./config directory in either .yml, .yaml, .coffee, .cson, .properties, .json, .json5, .hjson or .js formats.
Note the config file needs to be in your project's home folder and not in the logger module.

For example, a logger.yaml config file would look like
```yaml
---
  # either trace, debug, info, warn or error
  logLevel: info
  levels:
    trace: 0
    debug: 1
    info: 2
    warn: 3
    error: 4
```

A logger.json config file would look like
```json
{
  "logLevel": "error",
  "levels": {
    "debug": 1,
    "info": 2,
    "warn": 3,
    "trace": 0,
    "error": 4
  }
}
```

See the config's [Configuration Files](https://github.com/lorenwest/node-config/wiki/Configuration-Files) doco for more information.

## Environment Variables

### NODE_APP_INSTANCE
Common configuration can be placed in the logger.EXT config file and then environment specific config in logger-{environment}.EXT files.

The NODE_APP_INSTANCE environment variable sets which environment config file will be loaded after the logger.EXT file is loaded.
For example, setting NODE_APP_INSTANCE to "prod" will load the config in the logger-prod.EXT config file overridding any config in logger.EXT. Setting NODE_APP_INSTANCE to "test" will load the logger-test.EXT config file to override any config in logger.EXT.

If NODE_APP_INSTANCE is not set a logger.EXT file will be loaded.

### NODE_CONFIG
The configuration in the config files can be overridden with the NODE_CONFIG environment variable. eg the following will override the logLevel in the config file to debug
```
NODE_CONFIG='{"logLevel":"debug"}'
```

See config's [Environment Variable](https://github.com/lorenwest/node-config/wiki/Environment-Variables) doco for more info.

### NODE_CONFIG_DIR
Used to set the location of your logger configuration files. This can be a relative path from the working directory or a direct path from root.

## Levels
You can configure your own levels rather than using the default wiston levels of: silly, debug, verbose, info, warn and error. You can also configure the color of the logged message for each level.

## Colors
Different colors can be configured for each logging level in the console output.

## Winston Transports

### Console
By default the console transport will be used even if there is no logger configuration. The console options can be controlled in the console configuration property.

A yaml example:
```yaml
---
  console:
    timestamp: true
```

The console transport can be explicityly diabled with the disable propoerty. A json example:
```json
{
  "console": {
    "disable": true
  }
}
```

To disable any console configuration in config files using an envirnment variable:
```
NODE_CONFIG='{"console":{"disable":true}}'
```

See the [Winston Console Transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport) documentation for a complete list of options.

### File
The file property configures the [Winston File Transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport). eg filename to write the logger output to.

If the dataPattern property is set in the file property then the [Winston DailyRotateFile Transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#dailyrotatefile-transport) is used instead. This will rotate files to the configured time period. Note the DailyRotateFile name is missleading as it can do more than daily file rotations.

A yaml example:
```yaml
---
  file:
    level: warn
    filename: ./logs/logger
    json: false
    timestamp: true
    datePattern: ".yyyy-MM-dd-HH'
```

## Adding other Winston transports
Additional winston transports like [Loggly](https://github.com/winstonjs/winston/blob/master/docs/transports.md#loggly-transport), [CouchDB](https://github.com/winstonjs/winston/blob/master/docs/transports.md#couchdb-transport), [MongoDB](https://github.com/winstonjs/winston/blob/master/docs/transports.md#mongodb-transport) and [Redis](https://github.com/winstonjs/winston/blob/master/docs/transports.md#redis-transport) can be used but they are not included in the logger's package.json by default.
To use these transports make sure you add them to your package.json dependencies.

### Loggly
The loggly property configures the [Winston Loggly Transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md#loggly-transport).

The subdomain is the Loggly account subdomain that was created on signup. The input token is the Loggly [customer token](https://www.loggly.com/docs/customer-token-authentication-token/).

If you don't want to log to Loggly then just don't include the loggly property in the configuration.

Example Loggly configuration file in yaml
```yaml
---
  loggly:
    subdomain: yourLogglySubDomain
    inputToken: yourLogglyToken
```

A logger.json config file would look like
```json
{
  "loggly": {
    "inputToken": "yourLogglyToken",
    "subdomain": "yourLogglySubDomain"
  }
}
```

The following should be added to the dependencies in the package.json to use the Loggly transport
```json
    "dependencies": {
        "config-logger": "~0.0.4",
        "winston-loggly": "~1.0.4"
    }
```