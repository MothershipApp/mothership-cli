const inquirer = require("inquirer");
const { exec } = require("child_process");
const config = require("./config");

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
  },

  configureProfile: function(backup) {
    return new Promise((resolve, reject) => {
      config
        .getProfileProperties(`${backup.target.bucket}`)
        .then(() => {
          resolve();
        })
        .catch(() => {
          inquirer
            .prompt([
              {
                type: "input",
                name: "profile",
                message: `What aws profile should ${backup.target.bucket} use to connect? `,
                default: "default"
              }
            ])
            .then(answers => {
              config.setProfileProperty(backup.target.bucket, answers.profile);
              resolve();
            });
        });
    });
  },

  syncS3(bucket, bucketDirectory, to) {
    return new Promise((resolve, reject) => {
      config
        .getProfileProperties(bucket)
        .then(profile => {
          exec(
            `aws s3 sync s3://${bucket}${bucketDirectory} ${to} --profile ${profile}`,
            (err, stdout, stderr) => {
              if (err) {
                return reject(err);
              }

              return resolve();
            }
          );
        })
        .catch(error => {
          return reject(error);
        });
    });
  },

  cpS3(bucket, filePath, to) {
    return new Promise((resolve, reject) => {
      config
        .getProfileProperties(bucket)
        .then(profile => {
          exec(
            `aws s3 cp s3://${bucket}${filePath} ${to} --profile ${profile}`,
            (err, stdout, stderr) => {
              if (err) {
                return reject(err);
              }

              return resolve();
            }
          );
        })
        .catch(error => {
          return reject(error);
        });
    });
  }
};
