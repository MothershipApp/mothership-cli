const inquirer = require("inquirer");
const ora = require("ora");
const axios = require("axios");

module.exports = (args, access_token, selectedProject) => {
  let environments = [];
  let environmentsData = [];

  function retrieveEnvironments() {
    const spinner = ora().start();
    axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    axios
      .get(`http://mothershipapi.test/api/v1/projects/${selectedProject.id}`)
      .then(response => {
        spinner.stop();
        environmentsData = response.data.data.environments;
        for (let i = 0; i < environmentsData.length; i++) {
          const environment = environmentsData[i];

          environments.push(environment.name);
        }

        chooseEnvironment();
      })
      .catch(error => {
        console.log("There was an error loading environments");
      });
  }

  function chooseEnvironment() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "environment",
          message: "Choose which environment to sync:",
          choices: environments
        }
      ])
      .then(answers => {
        for (let i = 0; i < environmentsData.length; i++) {
          if (answers.environment === environmentsData[i].name) {
            require("./choose-backup")(args, access_token, environmentsData[i]);
          }
        }
      });
  }

  retrieveEnvironments();
};
