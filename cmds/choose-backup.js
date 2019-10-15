const inquirer = require("inquirer");
const ora = require("ora");
const axios = require("axios");

module.exports = (args, access_token) => {
  let backups = [
    "Production: August 4th 2018 - 3:35am",
    "Production: August 3rd 2018 - 3:35am",
    "Production: August 2nd 2018 - 3:35am",
    "Production: August 1st 2018 - 3:35am"
  ];
  let projectsData = [];

  function retrieveBackups() {
    const spinner = ora().start();
    axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    // axios
    //   .get(`http://mothershipapi.test/api/v1/projects`)
    //   .then(response => {
    //     spinner.stop();
    //     projectsData = response.data.data;
    //     for (let i = 0; i < projectsData.length; i++) {
    //       const project = projectsData[i];

    //       projects.push(project.name);
    //     }

    //     chooseProject();
    //   })
    //   .catch(error => {
    //     console.log("There was an error loading projects");
    //   });

    chooseBackup();
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
        console.log("You chose backup " + answers.backup);
      });
  }

  retrieveBackups();
};
