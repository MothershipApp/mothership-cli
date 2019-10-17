const inquirer = require("inquirer");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
const { exec } = require("child_process");
const config = require("../../helpers/config");
const chalk = require("chalk");

inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

module.exports = {
  configure: function(environment, backup) {
    return new Promise((resolve, reject) => {
      // If the path already is present in the config file then super,
      // if not, then ask for it and store it in the config
      config
        .getEnvironmentProperties(
          environment.name,
          `Directory: ${backup.target.name}`
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
                name: "path",
                message: `\n\n${chalk.green(
                  "SYNCING DIRECTORY FROM BACKUP:"
                )}\n\nWhat directory relative to this one should ${
                  backup.value
                } sync to? `
              }
            ])
            .then(answers => {
              config.setEnvironmentProperty(
                environment.name,
                `Directory: ${backup.target.name}`,
                `${path}/${answers.path}`
              );
              resolve();
            });
        });
    });
  }
};
