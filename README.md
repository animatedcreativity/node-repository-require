# node-repository-require
Install any public/private repository (even a node module) easily in node_modules folder, on the go.

---------------------------------------------------

**NOTE:** If you include public/private git links in package.json dependencies, they will also work by default without this module, and will be installed by `npm update`. _But, its better to use this module if the repository is not a npm module._

---------------------------------------------------

Why the module was made?<br/>
**Made this module just because Glitch.com (https://glitch.com/) was not supporting installing my private Github repositories, at this time.**

---------------------------------------------------

**ToDo:**
- Install dependencies automatically.
- Remove dependencies automatically from package.json just like they are added.

---------------------------------------------------

**Usage:**

Create installer with optional config, it will use defaults if not provided.
```
var nodeRepository = require("node-repository-require");
var installer = new nodeRepository({consoleLog: true});
```

Require module
```
installer.require("module-name", "https://<github_token>:x-oauth-basic@github.com/<user>/<module_name>.git");
```

Run npm update in console just one time once you have required a new module from repository. This is because once the module is downloaded, its dependencies are added in package.json
```
npm update
```

If you are using this module on Glitch.com, then just run `refresh` in the console.<br/>
**If the repository is not a npm module, then no need to do `npm update`.**

Check if the module was installed
```
installer.require("module-name", "https://<github_token>:x-oauth-basic@github.com/<user>/<module_name>.git")
.then(function(result) {
  var module = require("module-name");
  // do something with module
});
```

---------------------------------------------------

**Repository links:**

- **public**: A normal repository link like: https://github.com/<user>/<module_name>.git

- **private**: Repository link with access token for example for Github, like: https://<github_token>:x-oauth-basic@github.com/<user>/<module_name>.git

---------------------------------------------------

**`installer` Methods**

Checks if module already exists, installs/reinstalls if required.

`.require(name, link, forceReinstall)`
- name: module name to use
- link: module's public/private repository link
- forceReinstall: Force reinstall a module, useful if there is a new version for the module available from the repository.

`.exists(name)`

Checks if module already exists.

- name: module name to use

`.path(name)`

Gets absolute module path.

- name: module name to use

`.version(name)`

Gets installed module's version.

- name: module name to use

`.install(name, link)`

Checks if module already exists, installs if required. Does not reinstall.

- name: module name to use
- link: module's public/private repository link

`.addDependencies(name)`

Finds dependencies in a module's package.json and adds them to current project's package.json. `npm update` is necessary after this.

- name: module name to use