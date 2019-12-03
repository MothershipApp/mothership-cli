const inquirer = require("inquirer");
const ora = require("ora");
const axios = require("axios");
const dayjs = require("dayjs");

module.exports = (args, access_token, selectedProject, selectedEnvironment) => {
  let backups = [];
  let backupsData = [];

  function retrieveBackups() {
    const spinner = ora().start();
    axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    axios
      .get(
        `https://mothership.app/api/v1/projects/${selectedProject.id}/environments/${selectedEnvironment.id}/backups?success-only=1`
      )
      .then(response => {
        spinner.stop();
        backupsData = response.data.data;
        for (let i = 0; i < backupsData.length; i++) {
          const backup = backupsData[i];

          backups.push({
            name: dayjs(backup.backed_up_at).format(
              "ddd, MMM D YYYY @ h:mm:ss a"
            ),
            value: backup
          });
        }

        // Check arguments and see if the environment name provided matches
        // Any in the list. If so, use that one. If not, error and ask to choose
        backupFromArgument = getBackupArgument();
        if (backupFromArgument) {
          require("./sync")(
            args,
            access_token,
            selectedProject,
            selectedEnvironment,
            backupFromArgument
          );
        } else {
          chooseBackup();
        }
      })
      .catch(error => {
        console.log("There was an error loading backups", error);
        process.exit();
      });
  }

  function getBackupArgument() {
    if (args["backup-date"]) {
      for (let i = 0; i < backups.length; i++) {
        if (args["backup-date"] === backups[i].name) {
          return backups[i].value;
        }
      }
      console.error("Backup argument provided not found");
    }
    return false;
  }

  function chooseBackup() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "backup",
          message: "Choose which backup to sync:",
          choices: backups
        }
      ])
      .then(answers => {
        require("./sync")(
          args,
          access_token,
          selectedProject,
          selectedEnvironment,
          answers.backup
        );
      });
  }

  retrieveBackups();
};
