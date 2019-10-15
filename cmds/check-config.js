const config = require("../helpers/config");
const inquirer = require("inquirer");
const defaultConfigContent = {
  access_token: null,
  email: null,
  environments: {}
};

module.exports = args => {
  config
    .readConfig()
    .then(data => {
      if (data) {
        require("./login")(args);
      } else {
        requestInitMothershipProject();
      }
    })
    .catch(() => {
      requestInitMothershipProject();
    });

  function requestInitMothershipProject() {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "createConfig",
          message:
            "Do you want to initialize a mothership project in this directory and create the mothership config file?"
        }
      ])
      .then(answers => {
        if (!answers.createConfig) {
          process.exit();
        } else {
          createConfig();
        }
      });
  }

  function createConfig() {
    config
      .writeConfig(defaultConfigContent)
      .then(() => {
        console.log(
          "The configuration was succesfully saved as .mothership.json in this directory."
        );
        require("./login")(args);
      })
      .catch(() => {
        console.log("There was a problem writing the config file");
        process.exit();
      });
  }
};
