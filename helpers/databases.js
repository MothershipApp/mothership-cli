const { exec } = require("child_process");

module.exports = {
  async importDB(file, database) {
    if (database.db_type === "mysql") {
      this.importMySQL(file, database).then(() => {
        resolve();
      });
    }
  },

  async importMySQL(file, database) {
    return new Promise((resolve, reject) => {
      let importStatement = database.db_password
        ? `mysql -u ${database.db_user} -p${database.db_password} ${database.db_name} < ${file}`
        : `mysql -u ${database.db_user} ${database.db_name} < ${file}`;

      exec(importStatement, (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }

        return resolve();
      });
    });
  }
};
