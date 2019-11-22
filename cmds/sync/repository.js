const inquirer = require("inquirer");
const { exec } = require("child_process");
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
                message: `\n\n\n\n${chalk.green(
                  "SYNCING REPOSITORY BY JUMPING TO COMMIT"
                )}\n\nWhat directory should be used to sync ${backup.target.name}(${backup.target.path}) the repository commit? Use <space> to enter in a directory and <enter> to select it`,
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
  },

  sync: function(environment, backup) {
    return new Promise((resolve, reject) => {
      const spinner = ora().start();
      config
        .getEnvironmentProperties(
          environment.name,
          `Repository: ${backup.target.id}`
        )
        .then(configuration => {
          console.log("\n\nSyncing repository to specific commit...");
          this.gitToCommit(configuration, backup.value)
            .then(() => {
              spinner.stop();
              console.log(
                chalk.green(`Local value synced to commit #${backup.value}`)
              );
              resolve();
            })
            .catch(err => {
              spinner.stop();
              reject(err);
            });
        })
        .catch(err => {
          spinner.stop();
          reject(err);
        });
    });
  },

  gitToCommit: function(directory, commit) {
    return new Promise((resolve, reject) => {
      exec(
        `git --git-dir ${directory}.git checkout ${commit}`,
        (err, stdout, stderr) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      );
    });
  }
};
