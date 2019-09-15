const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const io = require("@actions/io");
const exec = require("@actions/exec");
const getLatestVersion = require("./get-latest-version");

// most @actions toolkit packages have async methods
async function run() {
  try {
    let hugoVersion = core.getInput("hugo-version");
    if (!hugoVersion || hugoVersion === "latest") {
      hugoVersion = getLatestVersion();
    }
    core.debug("Hugo version:", hugoVersion);

    let extended = core.getInput("extended");
    if (!extended) {
      extended = false;
    }
    core.debug("Hugo extended:", extended);

    let extendedStr = "";
    if (extended) {
      extendedStr = "extended_";
    }

    const hugoName = `hugo_${extendedStr}${hugoVersion}_Linux-64bit`;
    core.debug("hugoName:", hugoName);

    const hugoURL = `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/${hugoName}.tar.gz`;
    core.debug("hugoURL:", hugoURL);

    const hugoPath = "/usr/local/bin";
    await io.mkdirP(hugoPath);

    // Download and extract Hugo binary
    const hugoTarball = await tc.downloadTool(hugoURL);
    const hugoExtractedFolder = await tc.extractTar(hugoTarball, "/tmp");
    core.debug("hugoExtractedFolder:", hugoExtractedFolder);
    await exec.exec("sudo", ["mv", `${hugoExtractedFolder}/hugo`, hugoPath]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
