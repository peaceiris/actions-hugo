const core = require("@actions/core");
const exec = require("@actions/exec");
const getLatestVersion = require("./get-latest-version");
const installer = require("./installer");

// most @actions toolkit packages have async methods
async function run() {
  try {
    getLatestVersion().then(
      async function(latestVersion) {
        let hugoVersion = core.getInput("hugo-version");
        if (!hugoVersion || hugoVersion === "latest") {
          hugoVersion = latestVersion;
        }
        console.log(`Hugo version: ${hugoVersion}`);

        await installer(hugoVersion);

        // Show version
        await exec.exec("hugo version");
        await exec.exec("go version");
        await exec.exec("git --version");
      },
      function(error) {
        core.setFailed(error);
      }
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
