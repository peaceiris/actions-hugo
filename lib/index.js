const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const io = require("@actions/io");
const exec = require("@actions/exec");
const getOS = require("./get-os");
const getURL = require("./get-url");
const getLatestVersion = require("./get-latest-version");

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

        const extended = core.getInput("extended");
        console.log(`Hugo extended: ${extended}`);

        const osName = getOS(process.platform);
        console.log(`Operating System: ${osName}`);

        const hugoURL = getURL(osName, extended, hugoVersion);
        core.debug(`hugoURL: ${hugoURL}`);

        const hugoPath = `${process.env.HOME}/bin`;
        await io.mkdirP(hugoPath);
        core.addPath(hugoPath);

        // Download and extract Hugo binary
        const hugoTarball = await tc.downloadTool(hugoURL);
        const hugoExtractedFolder = await tc.extractTar(hugoTarball, "/tmp");
        core.debug("hugoExtractedFolder:", hugoExtractedFolder);
        await io.mv(`${hugoExtractedFolder}/hugo`, hugoPath);

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
