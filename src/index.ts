import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {getLatestVersion} from './get-latest-version';
import {installer} from './installer';

export interface actionResult {
  exitcode: number;
  output: string;
}

export async function showVersion(
  cmd: string,
  args: string[]
): Promise<actionResult> {
  try {
    let result: actionResult = {
      exitcode: 0,
      output: ''
    };

    const options = {
      listeners: {
        stdout: (data: Buffer) => {
          result.output += data.toString();
        }
      }
    };

    result.exitcode = await exec.exec(cmd, args, options);
    core.debug(`
      exit code: ${result.exitcode}
      stdout: ${result.output}
    `);
    return result;
  } catch (e) {
    return e;
  }
}

async function run() {
  try {
    const toolVersion: string = core.getInput('hugo-version');
    let installVersion: string = '';

    let result: actionResult = {
      exitcode: 0,
      output: ''
    };

    if (toolVersion === '' || toolVersion === 'latest') {
      installVersion = await getLatestVersion('gohugoio', 'hugo', 'brew');
    } else {
      installVersion = toolVersion;
    }

    core.info(`hugo version: ${installVersion}`);
    await installer(installVersion);
    result = await showVersion('hugo', ['version']);

    return result;
  } catch (e) {
    core.setFailed(`Action failed with error ${e}`);
    return e;
  }
}

run();
