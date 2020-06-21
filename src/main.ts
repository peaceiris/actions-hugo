import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {getLatestVersion} from './get-latest-version';
import {installer} from './installer';
import {Tool} from './constants';

export interface ActionResult {
  exitcode: number;
  output: string;
}

export async function showVersion(cmd: string, args: string[]): Promise<ActionResult> {
  const result: ActionResult = {
    exitcode: 0,
    output: ''
  };

  const options = {
    listeners: {
      stdout: (data: Buffer): void => {
        result.output += data.toString();
      }
    }
  };

  result.exitcode = await exec.exec(cmd, args, options);
  core.debug(`command: ${cmd} ${args}`);
  core.debug(`exit code: ${result.exitcode}`);
  core.debug(`stdout: ${result.output}`);
  return result;
}

export async function run(): Promise<ActionResult> {
  const toolVersion: string = core.getInput('hugo-version');
  let installVersion = '';

  let result: ActionResult = {
    exitcode: 0,
    output: ''
  };

  if (toolVersion === '' || toolVersion === 'latest') {
    installVersion = await getLatestVersion(Tool.Org, Tool.Repo, 'brew');
  } else {
    installVersion = toolVersion;
  }

  core.info(`${Tool.Name} version: ${installVersion}`);
  await installer(installVersion);
  result = await showVersion(Tool.CmdName, [Tool.CmdOptVersion]);

  return result;
}
