import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import {getConventions} from './get-conventions';
import getOS from './get-os';
import getArch from './get-arch';
import getURL, {getDownloadVersion} from './get-url';
import * as path from 'path';
import {Tool, Action} from './constants';

export interface DownloadedAsset {
  path: string;
  url: string;
}

export function getHomeDir(): string {
  let homedir = '';

  if (process.platform === 'win32') {
    homedir = process.env['USERPROFILE'] || 'C:\\';
  } else {
    homedir = `${process.env.HOME}`;
  }

  core.debug(`homeDir: ${homedir}`);

  return homedir;
}

export async function createWorkDir(): Promise<string> {
  const workDir = path.join(getHomeDir(), Action.WorkDirName);
  await io.mkdirP(workDir);
  core.debug(`workDir: ${workDir}`);
  return workDir;
}

export async function createTempDir(workDir: string): Promise<string> {
  const tempDir = path.join(workDir, Action.TempDirName);
  await io.mkdirP(tempDir);
  core.debug(`tempDir: ${tempDir}`);
  return tempDir;
}

export async function createBinDir(workDir: string): Promise<string> {
  const binDir = path.join(workDir, 'bin');
  await io.mkdirP(binDir);
  core.addPath(binDir);
  core.debug(`binDir: ${binDir}`);
  return binDir;
}

export function isRetryableDownloadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : `${error}`;
  return (
    message.includes('Unexpected HTTP response: 404') ||
    message.includes('Code(404)') ||
    (message.includes('404') && message.includes('Not Found'))
  );
}

export function isWindowsAsset(assetURL: string): boolean {
  return /(?:Windows[-_]|windows[-_])/.test(assetURL);
}

export async function downloadHugoAsset(toolURLs: string[]): Promise<DownloadedAsset> {
  for (const toolURL of toolURLs) {
    core.debug(`toolURL: ${toolURL}`);

    try {
      return {
        path: await tc.downloadTool(toolURL),
        url: toolURL
      };
    } catch (error) {
      if (!isRetryableDownloadError(error)) {
        throw error;
      }

      core.debug(`Hugo asset not found at ${toolURL}`);
    }
  }

  throw new Error(
    `Unable to find a compatible Hugo release asset for this runner. Tried:\n${toolURLs.join('\n')}`
  );
}

export async function extractHugoAsset(
  assetPath: string,
  assetURL: string,
  tempDir: string,
  binDir: string
): Promise<void> {
  let toolBin = '';

  if (assetURL.endsWith('.zip')) {
    const toolExtractedFolder: string = await tc.extractZip(assetPath, tempDir);
    const toolCmd = isWindowsAsset(assetURL) ? `${Tool.CmdName}.exe` : Tool.CmdName;
    toolBin = path.join(toolExtractedFolder, toolCmd);
  } else if (assetURL.endsWith('.pkg')) {
    const pkgExtractedFolder = path.join(tempDir, 'pkg');
    await exec.exec('pkgutil', ['--expand-full', assetPath, pkgExtractedFolder]);
    toolBin = path.join(pkgExtractedFolder, 'Payload', Tool.CmdName);
  } else {
    const toolExtractedFolder: string = await tc.extractTar(assetPath, tempDir);
    toolBin = path.join(toolExtractedFolder, Tool.CmdName);
  }

  await io.mv(toolBin, binDir);
}

export async function installer(version: string): Promise<void> {
  const extended: string = core.getInput('extended');
  core.debug(`Hugo extended: ${extended}`);

  const conventions = getConventions(version);

  const osName: string = getOS(process.platform, conventions);
  core.debug(`Operating System: ${osName}`);

  const archName: string = getArch(process.arch, osName, conventions);
  core.debug(`Processor Architecture: ${archName}`);

  const toolURLs: string[] = getURL(osName, archName, extended, version);
  const downloadVersion = getDownloadVersion(version);
  if (downloadVersion !== version) {
    core.info(
      `Hugo ${version} release does not publish archives; downloading v${downloadVersion} archives instead.`
    );
  }

  const workDir = await createWorkDir();
  const binDir = await createBinDir(workDir);
  const tempDir = await createTempDir(workDir);

  const toolAsset: DownloadedAsset = await downloadHugoAsset(toolURLs);
  await extractHugoAsset(toolAsset.path, toolAsset.url, tempDir, binDir);
}
