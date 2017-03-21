var bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'appLogger',
    level: 'info',
    streams: [{
      level: 'info',
      path: './app/log/logs.log'
    }]
});

module.exports = log;
