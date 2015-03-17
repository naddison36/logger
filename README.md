A configurable Winston logger
===============

A simple wrapper to the [Winston](https://github.com/winstonjs/winston) logger that allows the log level and optional [Loggly](https://www.loggly.com/) configuration to be done in a configuration file using [node-config](https://github.com/lorenwest/node-config).

## Install

This is not currently publish in npm so needs to be installed from the git repo
```
npm install https://github.com/naddison36/logger.git
```

## Usage

```javascript
var logger = require('logger');

// log the stack of an Error object
var err = new Error('something really bad happened');
logger.error(err.stack);

// two different logger calls to achieve the same result
logger.info('some interesting stuff just happened');
logger.level('info', 'exactly the same stuff just called a different way');
```

See [Winston doco](https://github.com/winstonjs/winston#logging) for more info

## Config
The logger will work without a configuration file. The default logging level will be set to "warn" with the following default logging levels of: silly, debug, verbose, info, warn and error.

To override the default logger configuration create a logger config file in your ./config directory in either .yml, .yaml, .coffee, .cson, .properties, .json, .json5, .hjson or .js formats.
Note the config file needs to be in your project's home folder and not in the logger module.

For example, a logger.yaml config file would look like
```yaml
---
  # either trace, debug, info, warn or error
  logLevel: "info"
  levels:
    trace: 0
    debug: 1
    info: 2
    warn: 3
    error: 4
  colors:
    trace: grey
    debug: blue
    info: yellow
    warn: orange
    error: red
  loggly:
    subdomain: yourLogglySubDomain
    inputToken: yourLogglyToken
    tag: yourTag
```

A logger.json config file would look like
```json
{
  "logLevel": "info",
  "loggly": {
    "inputToken": "yourLogglyToken",
    "subdomain": "yourLogglySubDomain",
    "tag": "yourTag"
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

## Loggly
The subdomain is the Loggly account subdomain that was created on signup. The input token is the Loggly [customer token](https://www.loggly.com/docs/customer-token-authentication-token/).

You can add metadata to Loggly with the [tag](https://www.loggly.com/docs/tags/) config. If not defined it will default to logger.

If you don't want to log to Loggly then just don't include the Loggly config.
