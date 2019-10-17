const inquirer = require("inquirer");
const { exec } = require("child_process");
const config = require("../../helpers/config");
const chalk = require("chalk");

module.exports = {
  configure: function(environment, backup) {
    return new Promise((resolve, reject) => {
      // If the path already is present in the config file then super,
      // if not, then ask for it and store it in the config
      config
        .getEnvironmentProperties(
          environment.name,
          `Repository: ${backup.target.id}`
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          let path = process.cwd();

          inquirer
            .prompt([
              {
                type: "input",
                name: "path",
                message: `${chalk.green(
                  "SYNCING REPOSITORY BY JUMPING TO COMMIT"
                )}\n\nWhat directory relative to this one (${path}) should ${
                  backup.target.path
                } sync to? `,
                default: "./"
              }
            ])
            .then(answers => {
              config.setEnvironmentProperty(
                environment.name,
                `Repository: ${backup.target.id}`,
                `${path}/${answers.path}`
              );
              resolve();
            });
        });
    });
  }
};
