const configFile = "./.mothership.json";
const fs = require("fs");

module.exports = {
  readConfig() {
    return new Promise((resolve, reject) => {
      fs.readFile(configFile, "utf8", function(err, data) {
        if (err) {
          reject(err);
        } else {
          try {
            const parsedConfig = JSON.parse(data);
            resolve(parsedConfig);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  },

  writeConfig(configContent) {
    return new Promise((resolve, reject) => {
      try {
        const config = JSON.stringify(configContent, null, 4);

        return fs.writeFile(configFile, config, err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  setProperty(property, value) {
    return new Promise((resolve, reject) => {
      this.readConfig().then(config => {
        // If property is an object full of values
        if (typeof property === "object") {
          const properties = property;
          const keys = Object.keys(properties);

          for (const p of keys) {
            config[p] = properties[p];
          }

          this.writeConfig(config)
            .then(resolve)
            .catch(reject);

          // If property is a string
        } else {
          config[property] = value;
          this.writeConfig(config)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  }
};
