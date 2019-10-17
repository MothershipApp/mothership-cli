const configFile = "./.mothership.json";
const { exec } = require("child_process");

module.exports = {
  checkAwsPresence() {
    return new Promise((resolve, reject) => {
      exec("aws help", (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }
};
