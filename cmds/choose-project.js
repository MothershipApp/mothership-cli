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
      .get(`https://mothership.app/api/v1/projects`)
      .then(response => {
        spinner.stop();
        teamData = response.data.data;
        for (let i = 0; i < teamData.length; i++) {
          const team = teamData[i];

          for (let j = 0; j < team.projects.length; j++) {
            const teamProject = team.projects[j];
            projects.push({
              name: teamProject.name,
              value: teamProject
            });
          }
        }

        chooseProject();
      })
      .catch(error => {
        console.log(error, "There was an error loading projects");
      });
  }

  function chooseProject() {
    console.log(projects);
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
