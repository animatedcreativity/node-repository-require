module.exports = exports = function(config) {
  var sanitize = require("node-sanitize-options");
  config = sanitize.options(config, {
    consoleLog: true
  });
  var fs = require("fs");
  var rimraf = require("rimraf");
  var fileJson = require("node-file-json");
  var installer = {
    require: function(name, link, forceReinstall) {
      return new Promise(function(resolve, reject) {
        var result = "";
        if (!installer.exists(name) || forceReinstall === true) {
          var path = installer.path(name);
          rimraf.sync(path);
          installer.install(name, link).then(function(message) {
            resolve(message);
          }).catch(function(error) {
            reject(error);
          });
        } else {
          installer.addDependencies(name);
          if (config.consoleLog === true) console.log("node-repository: module: " + name + "@" + installer.version(name) + " already installed.");
          resolve({status: true, message: "Already exists"});
        }
      });
    },
    exists: function(name) {
      var path = installer.path(name);
      if (fs.existsSync(path) && fs.existsSync(path + "/package.json")) {
        return true;
      }
      return false;
    },
    root: function() {
      var path = require('path');
      return path.dirname(require.main.filename);
    },
    path: function(name) {
      return installer.root() + "/node_modules/" + name;
    },
    version: function(name) {
      var version = "";
      if (installer.exists(name) === true) {
        var path = installer.path(name);
        var json = new fileJson();
        json.load(path + "/package.json");
        version = json.data.version;
      }
      return version;
    },
    install: function(name, link) {
      return new Promise(function(resolve, reject) {
        var path = installer.path(name);
        if (!fs.existsSync(path)) {
          var git = require("nodegit");
          git.Clone(link, path).then(function(repository) {
            installer.addDependencies(name);
            if (config.consoleLog === true) console.log("node-repository: module: " + name + "@" + installer.version(name) + " installed, do not forget to run (npm update) in project root");
            resolve({status: true, message: "Installed", repository: repository});
          }).catch(function(error) {
            reject(error);
          });
        } else {
          installer.addDependencies(name);
          if (config.consoleLog === true) console.log("node-repository: module: " + name + "@" + installer.version(name) + " already installed.");
          resolve({status: true, message: "Already exists"});
        }
      });
    },
    addDependencies: function(name) {
      if (installer.exists(name)) {
        var path = installer.path(name);
        var repoJson = new fileJson();
        repoJson.load(path + "/package.json");
        var json = new fileJson();
        json.load(installer.root() + "/package.json");
        var changed = false;
        for (var key in repoJson.data.dependencies) {
          var module = key + "@" + repoJson.data.dependencies[key];
          if (json.data[key] != repoJson.data[key]) {
            if (config.consoleLog === true) console.log("node-repository: adding dependency: " + module);
            json.data.dependencies[key] = repoJson.data.dependencies[key];
            changed = true;
          }
        }
        if (changed === true) {
          json.save();
          if (config.consoleLog === true) {
            console.log("node-repository: please check a copy of OLD package.json below, if needed.");
            console.log(json.data);
            console.log("node-repository: run (npm update) in project root");
          }
        }
      }
    }
  }
  return installer;
};