import * as core from '@actions/core';
import * as exec from '@actions/exec';
import getLatestVersion from './get-latest-version';
import installer from './installer';

// most @actions toolkit packages have async methods
async function run() {
  const showVersion = async () => {
    await exec.exec('hugo version');
  };

  try {
    const hugoVersion: string = core.getInput('hugo-version');

    if (hugoVersion === '' || hugoVersion === 'latest') {
      getLatestVersion().then(
        async function(latestVersion): Promise<void> {
          console.log(`Hugo version: ${latestVersion} (${hugoVersion})`);
          await installer(latestVersion);
          await showVersion();
        },
        function(error) {
          core.setFailed(error);
        }
      );
    } else {
      console.log(`Hugo version: ${hugoVersion}`);
      await installer(hugoVersion);
      await showVersion();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
