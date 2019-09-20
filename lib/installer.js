const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const io = require("@actions/io");
const getOS = require("./get-os");
const getURL = require("./get-url");

async function installer(version) {
  const extended = core.getInput("extended");
  console.log(`Hugo extended: ${extended}`);

  const osName = getOS(process.platform);
  console.log(`Operating System: ${osName}`);

  const hugoURL = getURL(osName, extended, version);
  core.debug(`hugoURL: ${hugoURL}`);

  const hugoPath = `${process.env.HOME}/bin`;
  await io.mkdirP(hugoPath);
  core.addPath(hugoPath);

  // Download and extract Hugo binary
  const hugoAssets = await tc.downloadTool(hugoURL);
  let hugoBin = "";
  if (osName === "Windows") {
    const hugoExtractedFolder = await tc.extractZip(hugoAssets, "/tmp");
    hugoBin = `${hugoExtractedFolder}/hugo.exe`;
  } else {
    const hugoExtractedFolder = await tc.extractTar(hugoAssets, "/tmp");
    hugoBin = `${hugoExtractedFolder}/hugo`;
  }
  await io.mv(hugoBin, hugoPath);
}

module.exports = installer;
