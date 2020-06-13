const logger = require('./logger');

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
module.exports.execShellCommand = (cmd) => {
    logger.debug(cmd);
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          logger.error(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }