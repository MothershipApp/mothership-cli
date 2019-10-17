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
        .getEnvironmentProperties(environment.name, backup.target.name)
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
              finalObj[backup.target.name] = {
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
  }
};
