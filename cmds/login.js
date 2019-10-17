const inquirer = require("inquirer");
const ora = require("ora");
const axios = require("axios");
const config = require("../helpers/config");

module.exports = args => {
  let access_token = null;
  let email = null;

  config
    .getProperties(["access_token", "email"])
    .then(loginInfo => {
      console.log("Logged in!");
      require("./choose-project")(args, loginInfo.access_token);
    })
    .catch(err => {
      console.log(err);
      showLoginForm();
    });

  function attemptLogin(payload) {
    return new Promise((resolve, reject) => {
      axios
        .post("http://mothershipapi.test/oauth/token", {
          grant_type: "mothership.webapp",
          username: payload.email,
          password: payload.password
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function showLoginForm() {
    inquirer
      .prompt([
        { type: "input", name: "email", message: "Login Email:" },
        { type: "password", name: "password", message: "Password:" }
      ])
      .then(answers => {
        const spinner = ora().start();
        attemptLogin(answers)
          .then(function(response) {
            email = answers.email;
            access_token = response.data.access_token;

            config.setProperty({ email: email, access_token: access_token });

            spinner.stop();
            console.log("Logged in!");
            require("./choose-project")(args, access_token);
          })
          .catch(error => {
            spinner.stop();
            console.log("The login information was incorrect");
            login();
          });
      });
  }
};
