const inquirer = require("inquirer");
const aws = require("../../helpers/aws");
const config = require("../../helpers/config");
const chalk = require("chalk");
const ora = require("ora");

module.exports = {
  configure: function(environment, backup) {
    return new Promise((resolve, reject) => {
      // If the path already is present in the config file then super,
      // if not, then ask for it and store it in the config
      config
        .getEnvironmentProperties(
          environment.name,
          `Database: ${backup.target.id}`
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          let path = process.cwd();

          console.log(`${chalk.green("SYNCING DATABASE FROM BACKUP:")}`);

          inquirer
            .prompt([
              {
                type: "list",
                name: "type",
                message: "Database Type:",
                choices: [
                  {
                    name: "MySQL (or MariaDB)",
                    value: "mysql"
                  }
                ]
              },
              {
                type: "input",
                name: "username",
                message: "Database Username:"
              },
              {
                type: "password",
                name: "password",
                message: "Database Password:"
              },
              {
                type: "input",
                name: "database",
                message: "Database Name:"
              }
            ])
            .then(answers => {
              const finalObj = {};
              finalObj[`Database: ${backup.target.id}`] = {
                db_type: answers.type,
                db_name: answers.database,
                db_user: answers.username,
                db_password: answers.password
              };
              config.setEnvironmentProperty(environment.name, finalObj);
              resolve();
            });
        });
    });
  },

  sync: function(environment, backup) {
    return new Promise((resolve, reject) => {
      const spinner = ora().start();
      config
        .getEnvironmentProperties(
          environment.name,
          `Database: ${backup.target.id}`
        )
        .then(configuration => {
          aws
            .cpS3(backup.target.bucket, backup.value, "./mothership-downloads")
            .then(() => {
              spinner.stop();
              console.log(
                `Database s3://${backup.target.bucket}${backup.value} sync complete`
              );
              resolve();
            });
        })
        .catch(err => {
          spinner.stop();
          reject(err);
        });
    });
  }
};
