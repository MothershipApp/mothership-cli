const inquirer = require("inquirer");
const ora = require("ora");
const axios = require("axios");
const dayjs = require("dayjs");
const chalk = require("chalk");
const aws = require("../helpers/aws");

const repositorySync = require("./sync/repository");
const databaseSync = require("./sync/database");
const directorySync = require("./sync/directory");
const fileSync = require("./sync/files");

module.exports = (
  args,
  access_token,
  selectedProject,
  selectedEnvironment,
  selectedBackup
) => {
  function getCommit() {
    return selectedBackup.backups.find(backup => {
      return backup.target.type === "Repository";
    }).value;
  }

  function filterDirectories() {
    return selectedBackup.backups.filter(backup => {
      return backup.target.type === "Directory";
    });
  }

  function filterFiles() {
    return selectedBackup.backups.filter(backup => {
      return backup.target.type === "File";
    });
  }

  function filterDatabases() {
    return selectedBackup.backups.filter(backup => {
      return backup.target.type === "Database";
    });
  }

  function buildMessage() {
    let commit = getCommit();
    let directories = filterDirectories();
    let databases = filterDatabases();
    let files = filterFiles();
    console.log("buildMessage");
    let message = `\n\n${chalk.red("ATTENTION")}:`;
    message += `You are about to sync this project with the mothership backup made on ${dayjs(
      selectedBackup.backed_up_at
    ).format("ddd, MMM D YYYY @ h:mm:ss a")}.`;

    if (files.length) {
      message += `\n\nThe Following files will be modified with older files being deleted and new files from the backup being added:`;

      for (let i = 0; i < directories.length; i++) {
        const directory = directories[i];
        message += `\n\n\t\t${directory.value}`;
      }
    }

    if (directories.length) {
      message += `\n\nData in the follow directories will be modified with older files being deleted and new files from the backup being added:`;

      for (let i = 0; i < directories.length; i++) {
        const directory = directories[i];
        message += `\n\n\t\t${directory.value}`;
      }
    }

    if (commit) {
      message += `\n\nThe project will be pulled to the following commit: ${commit}`;
    }

    if (databases) {
      message += `\n\nFinally, the database will be overwritten by the included database.`;
      for (let i = 0; i < databases.length; i++) {
        const database = databases[i];
        message += `\n\n\t\t${database.value}`;
      }
    }

    message += `\n\n${chalk.red("Are you sure you want to proceed?")}`;

    return message;
  }

  async function buildConfig() {
    for (let i = 0; i < selectedBackup.backups.length; i++) {
      const backup = selectedBackup.backups[i];

      if (
        backup.target.type === "Directory" ||
        backup.target.type === "File" ||
        backup.target.type === "Database"
      ) {
        await aws.configureProfile(backup).then(() => {
          return true;
        });
      }

      if (backup.target.type === "File" && args.files) {
        console.log("\n\nSyncing file...");
        await fileSync.configure(selectedEnvironment, backup).then(() => {
          return true;
        });
      }

      if (backup.target.type === "Directory" && args.directories) {
        console.log("\n\nSyncing directory...");
        await directorySync.configure(selectedEnvironment, backup).then(() => {
          return true;
        });
      }

      if (backup.target.type === "Repository" && args.repositories) {
        await repositorySync.configure(selectedEnvironment, backup).then(() => {
          return true;
        });
      }

      if (backup.target.type === "Database" && args.databases) {
        await databaseSync.configure(selectedEnvironment, backup).then(() => {
          return true;
        });
      }
    }
  }

  function confirmSync() {
    console.log("confirm message");
    message = buildMessage();
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirmation",
          message: message
        }
      ])
      .then(answers => {
        if (answers.confirmation) {
          sync();
        } else {
          require("./check-config")(args);
        }
      });
  }

  async function sync() {
    for (let i = 0; i < selectedBackup.backups.length; i++) {
      const backup = selectedBackup.backups[i];
      if (backup.target.type === "File" && args.files) {
        await fileSync
          .sync(selectedEnvironment, backup)
          .then(() => {
            return true;
          })
          .catch(err => {
            console.log("Error syncing file " + err);
          });
      }

      if (backup.target.type === "Directory" && args.directories) {
        await directorySync
          .sync(selectedEnvironment, backup)
          .then(() => {
            return true;
          })
          .catch(err => {
            console.log("Error syncing directory " + err);
          });
      }

      if (backup.target.type === "Repository" && args.repositories) {
        await repositorySync.sync(selectedEnvironment, backup).then(() => {
          return true;
        });
      }

      if (backup.target.type === "Database" && args.databases) {
        await databaseSync
          .sync(selectedEnvironment, backup)
          .then(() => {
            return true;
          })
          .catch(err => {
            console.log("Error syncing database " + err);
          });
      }
    }
  }

  buildConfig().then(() => {
    console.log("confirm");
    confirmSync();
  });
};
