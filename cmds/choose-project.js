const inquirer = require("inquirer");
const ora = require("ora");
const axios = require("axios");
const config = require("../helpers/config");

module.exports = (args, access_token) => {
  let projects = [];
  let projectsData = [];

  config
    .getProperties("project")
    .then(project => {
      if (project.id) {
        require("./choose-environment")(args, access_token, project);
      } else {
        retrieveProjects();
      }
    })
    .catch(err => {
      retrieveProjects();
    });

  function retrieveProjects() {
    const spinner = ora().start();
    axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

    axios
      .get(`http://mothershipapi.test/api/v1/projects`)
      .then(response => {
        spinner.stop();
        projectsData = response.data.data;
        for (let i = 0; i < projectsData.length; i++) {
          const project = projectsData[i];

          projects.push({
            name: project.name,
            value: project
          });
        }

        chooseProject();
      })
      .catch(error => {
        console.log("There was an error loading projects");
      });
  }

  function chooseProject() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "project",
          message: "Choose which project to sync:",
          choices: projects
        }
      ])
      .then(answers => {
        config.setProperty("project", answers.project);
        require("./choose-environment")(args, access_token, answers.project);
      });
  }
};
