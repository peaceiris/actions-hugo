const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const io = require("@actions/io");
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
        let extendedStr = "";
        if (extended === "true") {
          extendedStr = "extended_";
        }

        console.log(`Operating System: ${process.platform}`);

        const hugoName = `hugo_${extendedStr}${hugoVersion}_Linux-64bit`;
        core.debug(`hugoName: ${hugoName}`);

        const hugoURL = `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/${hugoName}.tar.gz`;
        core.debug(`hugoURL: ${hugoURL}`);

        const hugoPath = `${process.env.HOME}/bin`;
        await io.mkdirP(hugoPath);
        core.addPath(hugoPath);

        // Download and extract Hugo binary
        const hugoTarball = await tc.downloadTool(hugoURL);
        const hugoExtractedFolder = await tc.extractTar(hugoTarball, "/tmp");
        core.debug("hugoExtractedFolder:", hugoExtractedFolder);
        await io.mv(`${hugoExtractedFolder}/hugo`, hugoPath);
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
