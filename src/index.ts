import * as core from "@actions/core";
import * as exec from "@actions/exec";
import getLatestVersion from "./get-latest-version";
import installer from "./installer";

// most @actions toolkit packages have async methods
async function run() {
  try {
    getLatestVersion().then(
      async function(latestVersion): Promise<any> {
        const hugoVersion: string = core.getInput("hugo-version");
        console.log(`Hugo version: ${hugoVersion}`);
        const version = (v: string, latestVersion: string): string => {
          if (v === "" || v === "latest") {
            return latestVersion;
          } else {
            return v;
          }
        };

        await installer(version(hugoVersion, latestVersion));

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
