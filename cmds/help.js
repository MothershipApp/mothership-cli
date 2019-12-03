const menus = {
  main: `
    mothership [command] <options>

    sync  .............. sync this machine with a mothership.app backup
    reset  ............. reset your configuration file and reconfigure
    version ............ show package version
    help ............... show help menu for a command
    
    `,

  sync: `
    Syncs a backup to your current directory
    
    mothership sync <environment-to-sync> <options>

    --databases, -d ........... include databases
    --repositories, -r ........ include repository
    --directories, -f ......... include directories
    --files, -i ............... include files
    --backup-date ............. Date in format of "Tue, Dec 3 2019 @ 8:00:06 am"
    
    `,

  reset: `
    Resets your .mothership.json config file and allows you to rebuild it.

    mothership reset
    
    `
};

module.exports = args => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
