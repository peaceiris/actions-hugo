import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {mkdtemp, writeFile, rm} from 'fs/promises';
import {tmpdir} from 'os';
import * as path from 'path';
import {
  getDartSassAssetName,
  installDartSass,
  verifyDartSassArchive
} from '../src/install-dart-sass';

jest.mock('node-fetch');

const version = '1.108.2';
const body = 'test archive bytes';
const digest = `sha256:${createHash('sha256').update(body).digest('hex')}`;
const mockedFetch = jest.mocked(fetch);
const originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform')!;
const originalArch = Object.getOwnPropertyDescriptor(process, 'arch')!;
let directory: string;
let archive: string;

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'dart-sass-test-'));
  archive = path.join(directory, 'archive');
  await writeFile(archive, body);
  jest.spyOn(tc, 'downloadTool').mockResolvedValue(archive);
  jest.spyOn(tc, 'extractTar').mockResolvedValue(directory);
  jest.spyOn(tc, 'extractZip').mockResolvedValue(directory);
  jest.spyOn(core, 'addPath').mockImplementation(() => {});
  jest.spyOn(exec, 'exec').mockResolvedValue(0);
  mockedFetch.mockReset();
});

afterEach(async () => {
  Object.defineProperty(process, 'platform', originalPlatform);
  Object.defineProperty(process, 'arch', originalArch);
  jest.restoreAllMocks();
  await rm(directory, {recursive: true, force: true});
});

function metadata(overrides: Record<string, unknown> = {}): void {
  const name = getDartSassAssetName(version, process.platform, process.arch, '2.39');
  mockedFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      tag_name: version,
      assets: [
        {
          name,
          digest,
          browser_download_url: `https://github.com/sass/dart-sass/releases/download/${version}/${name}`,
          ...overrides
        }
      ]
    })
  } as Awaited<ReturnType<typeof fetch>>);
}

function expectNoInstallation(): void {
  expect(tc.extractTar).not.toHaveBeenCalled();
  expect(tc.extractZip).not.toHaveBeenCalled();
  expect(exec.exec).not.toHaveBeenCalled();
  expect(core.addPath).not.toHaveBeenCalled();
}

test('empty input makes no network calls or PATH changes', async () => {
  await installDartSass('');
  expect(fetch).not.toHaveBeenCalled();
  expect(tc.downloadTool).not.toHaveBeenCalled();
  expectNoInstallation();
});

test.each([
  'latest',
  '^1.89.1',
  '1.89',
  'v1.89.1',
  '01.89.1',
  '1.89.1-beta.1',
  'https://example.com/sass',
  '../1.89.1'
])('rejects non-fixed input %s before network access', async value => {
  await expect(installDartSass(value)).rejects.toThrow('fixed version');
  expect(fetch).not.toHaveBeenCalled();
  expectNoInstallation();
});

test.each([
  ['linux', 'x64', 'linux-x64.tar.gz'],
  ['linux', 'arm64', 'linux-arm64.tar.gz'],
  ['darwin', 'x64', 'macos-x64.tar.gz'],
  ['darwin', 'arm64', 'macos-arm64.tar.gz'],
  ['win32', 'x64', 'windows-x64.zip'],
  ['win32', 'arm64', 'windows-arm64.zip']
])('maps %s/%s exactly', (platform, arch, suffix) => {
  expect(getDartSassAssetName(version, platform, arch, '2.39')).toBe(
    `dart-sass-${version}-${suffix}`
  );
});

test.each([
  ['freebsd', 'x64'],
  ['linux', 'ia32'],
  ['darwin', 'arm'],
  ['win32', 'riscv64']
])('rejects unsupported %s/%s', (platform, arch) => {
  expect(() => getDartSassAssetName(version, platform, arch, '2.39')).toThrow('Unsupported');
});

test('rejects musl or unknown libc', () => {
  expect(() => getDartSassAssetName(version, 'linux', 'x64')).toThrow('glibc');
});

test.each([
  undefined,
  null,
  '',
  'sha512:' + 'a'.repeat(64),
  'sha256:' + 'a'.repeat(63),
  'sha256:' + 'g'.repeat(64)
])('rejects missing or malformed digest %s before download', async invalid => {
  metadata({digest: invalid});
  await expect(installDartSass(version)).rejects.toThrow('no valid GitHub API SHA-256 digest');
  expect(tc.downloadTool).not.toHaveBeenCalled();
  expectNoInstallation();
});

test('rejects checksum mismatch before extraction or execution', async () => {
  metadata({digest: 'sha256:' + '0'.repeat(64)});
  await expect(installDartSass(version)).rejects.toThrow('SHA-256 mismatch');
  expectNoInstallation();
});

test('rejects missing archive', async () => {
  metadata({name: 'another-platform.tar.gz'});
  await expect(installDartSass(version)).rejects.toThrow('no release asset');
  expect(tc.downloadTool).not.toHaveBeenCalled();
  expectNoInstallation();
});

test('rejects unexpected download URL', async () => {
  metadata({browser_download_url: 'https://example.com/archive'});
  await expect(installDartSass(version)).rejects.toThrow('Unexpected download URL');
  expect(tc.downloadTool).not.toHaveBeenCalled();
  expectNoInstallation();
});

test.each([403, 404, 429, 500])('fails closed on API HTTP %s', async status => {
  mockedFetch.mockResolvedValue({ok: false, status} as Awaited<ReturnType<typeof fetch>>);
  await expect(installDartSass(version)).rejects.toThrow(`HTTP ${status}`);
  expect(tc.downloadTool).not.toHaveBeenCalled();
  expectNoInstallation();
});

test('fails closed on network error', async () => {
  mockedFetch.mockRejectedValue(new Error('network failed'));
  await expect(installDartSass(version)).rejects.toThrow('network failed');
  expectNoInstallation();
});

test.each([null, {}, {tag_name: 'other', assets: []}, {tag_name: version, assets: null}])(
  'rejects malformed release metadata %j',
  async release => {
    mockedFetch.mockResolvedValue({ok: true, json: async () => release} as Awaited<
      ReturnType<typeof fetch>
    >);
    await expect(installDartSass(version)).rejects.toThrow('Invalid Dart Sass');
    expectNoInstallation();
  }
);

test('fails closed on invalid JSON', async () => {
  mockedFetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: async (): Promise<unknown> => {
      throw new Error('invalid JSON');
    }
  } as Awaited<ReturnType<typeof fetch>>);
  await expect(installDartSass(version)).rejects.toThrow('invalid JSON');
  expectNoInstallation();
});

test('fails closed on download or read failure', async () => {
  metadata();
  jest.mocked(tc.downloadTool).mockRejectedValueOnce(new Error('download failed'));
  await expect(installDartSass(version)).rejects.toThrow('download failed');
  jest.mocked(tc.downloadTool).mockResolvedValueOnce(path.join(directory, 'missing'));
  await expect(installDartSass(version)).rejects.toThrow('ENOENT');
  expectNoInstallation();
});

test('verifies bytes then preserves the whole standalone directory on PATH', async () => {
  metadata();
  await installDartSass(version);
  const extract = process.platform === 'win32' ? tc.extractZip : tc.extractTar;
  expect(extract).toHaveBeenCalledWith(archive);
  expect(core.addPath).toHaveBeenCalledWith(path.join(directory, 'dart-sass'));
  expect(exec.exec).not.toHaveBeenCalled();
});

test('accepts uppercase checksum hex but rejects invalid verification input', async () => {
  await expect(
    verifyDartSassArchive(archive, 'sha256:' + digest.slice(7).toUpperCase())
  ).resolves.toBeUndefined();
  await expect(verifyDartSassArchive(archive, '')).rejects.toThrow('no valid');
});

test.each([
  ['linux', 'x64'],
  ['linux', 'arm64'],
  ['darwin', 'x64'],
  ['darwin', 'arm64'],
  ['win32', 'x64'],
  ['win32', 'arm64']
])('installs the verified archive for %s/%s', async (platform, arch) => {
  Object.defineProperty(process, 'platform', {value: platform, configurable: true});
  Object.defineProperty(process, 'arch', {value: arch, configurable: true});
  jest
    .spyOn(process.report, 'getReport')
    .mockReturnValue({header: {glibcVersionRuntime: '2.39'}} as unknown as ReturnType<
      typeof process.report.getReport
    >);
  metadata();
  await installDartSass(version);
  const extract = platform === 'win32' ? tc.extractZip : tc.extractTar;
  const otherExtract = platform === 'win32' ? tc.extractTar : tc.extractZip;
  expect(extract).toHaveBeenCalledWith(archive);
  expect(otherExtract).not.toHaveBeenCalled();
  expect(core.addPath).toHaveBeenCalledWith(path.join(directory, 'dart-sass'));
});

test('does not add PATH if extraction fails', async () => {
  metadata();
  jest.mocked(tc.extractTar).mockRejectedValue(new Error('extraction failed'));
  jest.mocked(tc.extractZip).mockRejectedValue(new Error('extraction failed'));
  await expect(installDartSass(version)).rejects.toThrow('extraction failed');
  expect(core.addPath).not.toHaveBeenCalled();
});
