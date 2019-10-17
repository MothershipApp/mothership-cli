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

          environments.push({
            name: environment.name,
            value: environment
          });
        }

        // Check arguments and see if the environment name provided matches
        // Any in the list. If so, use that one. If not, error and ask to choose
        environmentFromArgument = getEnvironmentArgument();
        if (environmentFromArgument) {
          require("./choose-backup")(
            args,
            access_token,
            selectedProject,
            environmentFromArgument
          );
        } else {
          chooseEnvironment();
        }
      })
      .catch(error => {
        console.error("There was an error loading environments");
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
        require("./choose-backup")(
          args,
          access_token,
          selectedProject,
          answers.environment
        );
      });
  }

  function getEnvironmentArgument() {
    if (args._[1]) {
      for (let i = 0; i < environments.length; i++) {
        if (args._[1] === environments[i].name) {
          return environments[i].value;
        }
      }
      console.error("Environment argument provided not found");
    }
    return false;
  }

  retrieveEnvironments();
};
