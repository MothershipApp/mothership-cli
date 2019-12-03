const minimist = require("minimist");
const aws = require("./helpers/aws");

module.exports = () => {
  const args = minimist(process.argv.slice(2), {
    string: ["backup-date"],
    boolean: ["directories", "databases", "repositories", "files"],
    alias: {
      f: "directories",
      d: "databases",
      r: "repositories",
      i: "files"
    }
  });

  if (
    !args.databases &&
    !args.directories &&
    !args.repositories &&
    !args.files
  ) {
    args.databases = true;
    args.d = true;
    args.directories = true;
    args.f = true;
    args.repositories = true;
    args.r = true;
    args.files = true;
    args.i = true;
  }

  let cmd = args._[0] || "help";

  if (args.version || args.v) {
    cmd = "version";
  }

  if (args.help || args.h) {
    cmd = "help";
  }

  aws
    .checkAwsPresence()
    .then(() => {
      switch (cmd) {
        case "sync":
          require("./cmds/check-config")(args);
          break;

        case "reset":
          require("./cmds/check-config")(args);
          break;

        case "version":
          require("./cmds/version")(args);
          break;

        case "help":
          require("./cmds/help")(args);
          break;

        default:
          console.error(`"${cmd}" is not a valid command!`);
          break;
      }
    })
    .catch(err => {
      console.log(err);
      console.error(
        `Please install aws CLI for your platform: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html`
      );
    });
};
