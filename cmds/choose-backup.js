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
        `http://mothershipapi.test/api/v1/projects/${selectedProject.id}/environments/${selectedEnvironment.id}/backups?success-only=1`
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

        chooseBackup();
      })
      .catch(error => {
        console.log("There was an error loading backups", error);
        process.exit();
      });
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
