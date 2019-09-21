import * as core from "@actions/core";
import * as exec from "@actions/exec";
import getLatestVersion from "./get-latest-version";
import installer from "./installer";

// most @actions toolkit packages have async methods
async function run() {
  const dump = async () => {
    // Show version
    await exec.exec("hugo version");
    await exec.exec("go version");
    await exec.exec("git --version");
  };

  try {
    const hugoVersion: string = core.getInput("hugo-version");
    console.log(`Hugo version: ${hugoVersion}`);

    if (hugoVersion === "" || hugoVersion === "latest") {
      getLatestVersion().then(
        async function(latestVersion): Promise<void> {
          await installer(latestVersion);
          await dump();
        },
        function(error) {
          core.setFailed(error);
        }
      );
    } else {
      await installer(hugoVersion);
      await dump();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
