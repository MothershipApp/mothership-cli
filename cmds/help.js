const menus = {
  main: `
    outside [command] <options>

    sync  .............. sync this machine with a mothership.app backup
    reset  ............. reset your configuration file and reconfigure
    version ............ show package version
    help ............... show help menu for a command`,

  sync: `
    sync <environment-to-sync> <options>

    --databases, -d ..... include databases
    --repositories, -r ..... include repository
    --directories, -f ..... include directories and files`
};

module.exports = args => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
