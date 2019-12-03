const inquirer = require("inquirer");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
const config = require("../../helpers/config");
const aws = require("../../helpers/aws");
const chalk = require("chalk");
const ora = require("ora");

inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

module.exports = {
  configure: function(environment, backup) {
    return new Promise((resolve, reject) => {
      // If the path already is present in the config file then super,
      // if not, then ask for it and store it in the config
      config
        .getEnvironmentProperties(
          environment.name,
          `Directory: ${backup.target.id}`
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          let path = process.cwd();

          inquirer
            .prompt([
              {
                type: "file-tree-selection",
                onlyShowDir: true,
                name: "path",
                default: "Do not sync",
                message: `\n\n\n\n${chalk.green(
                  "SYNCING DIRECTORY FROM BACKUP:"
                )}\n\nWhat directory should ${backup.target.name} sync to? `
              }
            ])
            .then(answers => {
              config.setEnvironmentProperty(
                environment.name,
                `Directory: ${backup.target.id}`,
                `${path}/${answers.path}`
              );
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
          `Directory: ${backup.target.id}`
        )
        .then(configuration => {
          console.log(backup.target.bucket, backup.value, configuration);
          aws
            .syncS3(backup.target.bucket, backup.value, configuration)
            .then(() => {
              spinner.stop();
              console.log(
                chalk.green(
                  `Directory s3://${backup.target.bucket}${backup.value} sync complete
                  
                  `
                )
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
