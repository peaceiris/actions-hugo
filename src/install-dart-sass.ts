import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import {createHash} from 'crypto';
import {createReadStream} from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

interface ReleaseAsset {
  name: string;
  digest?: string | null;
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
}

export function getDartSassAssetName(
  version: string,
  platform: string,
  arch: string,
  glibcVersion?: string
): string {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error('dart-sass-version must be a fixed version such as 1.108.2 (without v).');
  }
  const platforms: Record<string, string> = {linux: 'linux', darwin: 'macos', win32: 'windows'};
  const os = platforms[platform];
  if (!os || !['x64', 'arm64'].includes(arch)) {
    throw new Error(`Unsupported Dart Sass platform: ${platform}/${arch}.`);
  }
  if (platform === 'linux' && !glibcVersion) {
    throw new Error('Dart Sass requires Linux with glibc; musl and unknown libc are unsupported.');
  }
  const extension = platform === 'win32' ? 'zip' : 'tar.gz';
  return `dart-sass-${version}-${os}-${arch}.${extension}`;
}

export async function verifyDartSassArchive(archive: string, digest: string): Promise<void> {
  if (!/^sha256:[a-fA-F0-9]{64}$/.test(digest)) {
    throw new Error('Dart Sass release asset has no valid GitHub API SHA-256 digest.');
  }
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(archive)) {
    hash.update(chunk);
  }
  if (hash.digest('hex') !== digest.slice(7).toLowerCase()) {
    throw new Error('Dart Sass archive SHA-256 mismatch; refusing to extract or execute it.');
  }
}

export async function installDartSass(version: string): Promise<void> {
  if (version === '') {
    return;
  }

  // Node's report identifies the libc actually used by this runner. Do not assume
  // Linux means glibc or silently install an incompatible archive on musl.
  const header =
    process.platform === 'linux'
      ? (process.report?.getReport() as {header?: {glibcVersionRuntime?: string}})?.header
      : undefined;
  const name = getDartSassAssetName(
    version,
    process.platform,
    process.arch,
    header?.glibcVersionRuntime
  );
  const headers: Record<string, string> = {
    'User-Agent': 'peaceiris/actions-hugo',
    Accept: 'application/vnd.github+json'
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(
    `https://api.github.com/repos/sass/dart-sass/releases/tags/${version}`,
    {headers, redirect: 'error'}
  );
  if (!response.ok) {
    throw new Error(
      `Unable to fetch Dart Sass ${version} release metadata: HTTP ${response.status}.`
    );
  }
  const release = (await response.json()) as Release | null;
  if (release?.tag_name !== version || !Array.isArray(release.assets)) {
    throw new Error(`Invalid Dart Sass ${version} release metadata.`);
  }
  const asset = release.assets.find(candidate => candidate?.name === name);
  if (!asset) {
    throw new Error(`Dart Sass ${version} has no release asset for this runner: ${name}.`);
  }
  if (typeof asset.digest !== 'string' || !/^sha256:[a-fA-F0-9]{64}$/.test(asset.digest)) {
    throw new Error(`Dart Sass asset ${name} has no valid GitHub API SHA-256 digest.`);
  }
  const url = `https://github.com/sass/dart-sass/releases/download/${version}/${name}`;
  if (asset.browser_download_url !== url) {
    throw new Error(`Unexpected download URL for Dart Sass asset ${name}.`);
  }
  const archive = await tc.downloadTool(url);
  await verifyDartSassArchive(archive, asset.digest);
  // Keep the launcher and its sibling src runtime together, including on Windows.
  const extracted = name.endsWith('.zip')
    ? await tc.extractZip(archive)
    : await tc.extractTar(archive);
  core.addPath(path.join(extracted, 'dart-sass'));
  core.info(`Dart Sass version: ${version}`);
}
