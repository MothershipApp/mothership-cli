const configFile = "./.mothership.json";
const fs = require("fs");

module.exports = {
  async checkDownloadsDirectory() {
    const downloadDir = "./mothership-downloads";

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
  },

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

  getProperties(propertyOrProperties) {
    return new Promise((resolve, reject) => {
      this.readConfig()
        .then(config => {
          if (typeof propertyOrProperties === "object") {
            let finalObject = {};
            for (let i = 0; i < propertyOrProperties.length; i++) {
              const property = propertyOrProperties[i];
              if (config[property]) {
                finalObject[property] = config[property];
              } else {
                reject(`property not found: ${property}`);
              }
            }
            resolve(finalObject);
          } else {
            if (config[propertyOrProperties]) {
              resolve(config[propertyOrProperties]);
            } else {
              reject(`property not found: ${propertyOrProperties}`);
            }
          }
        })
        .catch(err => {
          reject(err);
        });
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
  },

  getEnvironmentProperties(environment, propertyOrProperties) {
    return new Promise((resolve, reject) => {
      this.readConfig()
        .then(config => {
          if (!config.environments && !config.environments[environment]) {
            console.log(
              "environment not found",
              config.environments,
              environment
            );
            reject(`Environment not found: ${environment}`);
          }

          if (typeof propertyOrProperties === "object") {
            let finalObject = {};
            for (let i = 0; i < propertyOrProperties.length; i++) {
              const property = propertyOrProperties[i];
              if (config.environments[environment][property]) {
                finalObject[property] =
                  config.environments[environment][property];
              } else {
                reject(`property not found: ${property}`);
              }
            }
            resolve(finalObject);
          } else {
            if (config.environments[environment][propertyOrProperties]) {
              resolve(config.environments[environment][propertyOrProperties]);
            } else {
              reject(`property not found: ${propertyOrProperties}`);
            }
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  setEnvironmentProperty(environment, property, value) {
    return new Promise((resolve, reject) => {
      this.readConfig().then(config => {
        // If property is an object full of values
        config.environments[environment] = config.environments[environment]
          ? config.environments[environment]
          : {};

        if (typeof property === "object") {
          const properties = property;
          const keys = Object.keys(properties);

          for (const p of keys) {
            config.environments[environment][p] = properties[p];
          }

          this.writeConfig(config)
            .then(resolve)
            .catch(reject);

          // If property is a string
        } else {
          config.environments[environment][property] = value;
          this.writeConfig(config)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  },

  getProfileProperties(profile) {
    return new Promise((resolve, reject) => {
      this.readConfig()
        .then(config => {
          if (config.profiles[profile]) {
            resolve(config.profiles[profile]);
          } else {
            reject(`Profile not found: ${profile}`);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  setProfileProperty(profile, value) {
    return new Promise((resolve, reject) => {
      this.readConfig().then(config => {
        config.profiles[profile] = value;
        this.writeConfig(config)
          .then(resolve)
          .catch(reject);
      });
    });
  }
};
