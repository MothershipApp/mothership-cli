const menus = {
  main: `
    outside [command] <options>

    sync  .............. sync this machine with a mothership.app backup
    version ............ show package version
    help ............... show help menu for a command`,

  sync: `
    sync <options>

    --project, -p ..... the project to sync`
};

module.exports = args => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
