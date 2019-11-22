import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import getOS from './get-os';
import getURL from './get-url';
import * as path from 'path';

let tempDir: string = process.env['RUNNER_TEMPDIRECTORY'] || '';
if (!tempDir) {
  let baseTempLocation: string;
  if (process.platform === 'win32') {
    baseTempLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    baseTempLocation = `${process.env.HOME}`;
  }
  tempDir = path.join(baseTempLocation, 'tmp');
}

export default async function installer(version: string) {
  try {
    const extended: string = core.getInput('extended');
    console.log(`Hugo extended: ${extended}`);

    const osName: string = getOS(process.platform);
    console.log(`Operating System: ${osName}`);

    const hugoURL: string = getURL(osName, extended, version);
    core.debug(`hugoURL: ${hugoURL}`);

    let baseLocation: string;
    if (process.platform === 'win32') {
      baseLocation = process.env['USERPROFILE'] || 'C:\\';
    } else {
      baseLocation = `${process.env.HOME}`;
    }
    const hugoPath: string = path.join(baseLocation, 'hugobin');
    await io.mkdirP(hugoPath);
    core.addPath(hugoPath);

    // Download and extract Hugo binary
    await io.mkdirP(tempDir);
    const hugoAssets: string = await tc.downloadTool(hugoURL);
    let hugoBin: string = '';
    if (osName === 'Windows') {
      const hugoExtractedFolder: string = await tc.extractZip(
        hugoAssets,
        tempDir
      );
      hugoBin = `${hugoExtractedFolder}/hugo.exe`;
    } else {
      const hugoExtractedFolder: string = await tc.extractTar(
        hugoAssets,
        tempDir
      );
      hugoBin = `${hugoExtractedFolder}/hugo`;
    }
    await io.mv(hugoBin, hugoPath);
  } catch (error) {
    core.setFailed(error.message);
  }
}
