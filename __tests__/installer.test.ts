import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import path from 'path';
import {downloadHugoAsset, extractHugoAsset, isWindowsAsset} from '../src/installer';

jest.mock('@actions/tool-cache', () => ({
  downloadTool: jest.fn(),
  extractTar: jest.fn(),
  extractZip: jest.fn()
}));

jest.mock('@actions/io', () => ({
  mv: jest.fn()
}));

jest.mock('@actions/exec', () => ({
  exec: jest.fn()
}));

describe('downloadHugoAsset()', () => {
  const mockedTC = tc as jest.Mocked<typeof tc>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retry 404 candidates and return the first downloaded asset', async () => {
    mockedTC.downloadTool
      .mockRejectedValueOnce(new Error('Unexpected HTTP response: 404'))
      .mockResolvedValueOnce('/tmp/hugo');

    const result = await downloadHugoAsset([
      'https://example.com/missing.tar.gz',
      'https://example.com/hugo.tar.gz'
    ]);

    expect(result).toEqual({
      path: '/tmp/hugo',
      url: 'https://example.com/hugo.tar.gz'
    });
    expect(mockedTC.downloadTool).toHaveBeenCalledTimes(2);
  });

  test('throw a clear error when all candidates return 404', async () => {
    mockedTC.downloadTool.mockRejectedValue(new Error('Unexpected HTTP response: 404'));

    await expect(
      downloadHugoAsset([
        'https://example.com/missing-1.tar.gz',
        'https://example.com/missing-2.tar.gz'
      ])
    ).rejects.toThrow('Unable to find a compatible Hugo release asset');
  });

  test('rethrow non-404 download failures without retrying', async () => {
    const error = new Error('socket hang up');
    mockedTC.downloadTool.mockRejectedValueOnce(error);

    await expect(
      downloadHugoAsset(['https://example.com/hugo.tar.gz', 'https://example.com/fallback.tar.gz'])
    ).rejects.toBe(error);
    expect(mockedTC.downloadTool).toHaveBeenCalledTimes(1);
  });
});

describe('extractHugoAsset()', () => {
  const mockedTC = tc as jest.Mocked<typeof tc>;
  const mockedIO = io as jest.Mocked<typeof io>;
  const mockedExec = exec as jest.Mocked<typeof exec>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('extract a tar.gz asset', async () => {
    mockedTC.extractTar.mockResolvedValue('/tmp/extracted');

    await extractHugoAsset('/tmp/tool', 'https://example.com/hugo.tar.gz', '/tmp/temp', '/tmp/bin');

    expect(mockedTC.extractTar).toHaveBeenCalledWith('/tmp/tool', '/tmp/temp');
    expect(mockedIO.mv).toHaveBeenCalledWith(path.join('/tmp/extracted', 'hugo'), '/tmp/bin');
  });

  test('extract a zip asset', async () => {
    mockedTC.extractZip.mockResolvedValue('/tmp/extracted');

    await extractHugoAsset(
      '/tmp/tool',
      'https://example.com/hugo_0.58.2_Windows-64bit.zip',
      '/tmp/temp',
      '/tmp/bin'
    );

    expect(mockedTC.extractZip).toHaveBeenCalledWith('/tmp/tool', '/tmp/temp');
    expect(mockedIO.mv).toHaveBeenCalledWith(path.join('/tmp/extracted', 'hugo.exe'), '/tmp/bin');
  });

  test('extract a macOS zip asset', async () => {
    mockedTC.extractZip.mockResolvedValue('/tmp/extracted');

    await extractHugoAsset(
      '/tmp/tool',
      'https://example.com/hugo_0.20.2_macOS-64bit.zip',
      '/tmp/temp',
      '/tmp/bin'
    );

    expect(mockedTC.extractZip).toHaveBeenCalledWith('/tmp/tool', '/tmp/temp');
    expect(mockedIO.mv).toHaveBeenCalledWith(path.join('/tmp/extracted', 'hugo'), '/tmp/bin');
  });

  test('extract a macOS pkg asset', async () => {
    mockedExec.exec.mockResolvedValue(0);

    await extractHugoAsset('/tmp/tool', 'https://example.com/hugo.pkg', '/tmp/temp', '/tmp/bin');

    expect(mockedExec.exec).toHaveBeenCalledWith('pkgutil', [
      '--expand-full',
      '/tmp/tool',
      path.join('/tmp/temp', 'pkg')
    ]);
    expect(mockedIO.mv).toHaveBeenCalledWith(
      path.join('/tmp/temp', 'pkg', 'Payload', 'hugo'),
      '/tmp/bin'
    );
  });
});

describe('isWindowsAsset()', () => {
  test('detect Windows asset URLs', () => {
    expect(isWindowsAsset('https://example.com/hugo_0.58.2_Windows-64bit.zip')).toBe(true);
    expect(isWindowsAsset('https://example.com/hugo_0.119.0_windows-amd64.zip')).toBe(true);
    expect(isWindowsAsset('https://example.com/hugo_0.20.2_macOS-64bit.zip')).toBe(false);
  });
});
