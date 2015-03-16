A configurable Winston logger
===============

A simple wrapper to the [Winston](https://github.com/winstonjs/winston) logger that allows the log level and optional [Loggly](https://www.loggly.com/) configuration to be done in a configuration file using [node-config](https://github.com/lorenwest/node-config)

## Install

This is not currently publish in npm so needs to be installed from the git repo
```npm install https://github.com/naddison36/logger.git```

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
Create a logger config file in your config directory in either .yml, .yaml, .coffee, .cson, .properties, .json, .json5, .hjson or .js formats.
Note the config file needs to be in your project's home folder and not in the logger module

For example, a logger.yaml config file would look like
```yaml
---
  # either trace, debug, info, warn or error
  logLevel: "info"
  loggly:
    enable: true
    subdomain: yourLogglySubDomain
    inputToken: yourLogglyToken
    noLogglyOnOsPlatform: darwin
```

A logger.json config file would look like
```json
{
  "logLevel": "info",
  "loggly": {
    "enable": true,
    "inputToken": "yourLogglyToken",
    "subdomain": "yourLogglySubDomain",
    "noLogglyOnOsPlatform": "darwin"
  }
}
```

See the config's [Configuration Files](https://github.com/lorenwest/node-config/wiki/Configuration-Files) doco for more information.

### Environment instances
The NODE_APP_INSTANCE environment variable allows for different versions of your logger to run in different environments.
For example, setting NODE_APP_INSTANCE to prod will look for a logger-prod.EXT config file while
setting NODE_APP_INSTANCE to test will look for a logger-test.EXT file

If NODE_APP_INSTANCE is not set a logger.EXT file will be loaded

### NODE_CONFIG
The configuration in the config file can be overridden with the NODE_CONFIG environment variable. eg the following will override the logLevel in the config file to debug
`NODE_CONFIG='{"logLevel":"debug"}'`

See config's [Environment Variable](https://github.com/lorenwest/node-config/wiki/Environment-Variables) doco for more info

## Loggly
The subdomain is the Loggly account subdomain that was created on signup. The input token is the Loggly [customer token](https://www.loggly.com/docs/customer-token-authentication-token/).

The noLogglyOnOsPlatform config allows an operating system platform not to use Loggly. For example, you might not want to use Loggly for your local development. If you are developing on a Mac OSX then the noLogglyOnOsPlatform config would be 'darwin'. Windows will be 'win32' and Linux will be 'linux'.
