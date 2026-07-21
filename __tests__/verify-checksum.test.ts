import * as core from '@actions/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {clearMockFetchResponses, mockFetchError, mockFetchResponse} from './mocks/node-fetch';
import {
  computeSHA256,
  fetchReleaseChecksum,
  findChecksum,
  getChecksumsURL,
  verifyChecksum
} from '../src/verify-checksum';

// SHA-256 of the ASCII string 'hello world'
const helloWorldSHA256 = 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9';

const checksumsURL =
  'https://github.com/gohugoio/hugo/releases/download/v0.158.0/hugo_0.158.0_checksums.txt';
const assetURL =
  'https://github.com/gohugoio/hugo/releases/download/v0.158.0/hugo_extended_0.158.0_linux-amd64.tar.gz';
const checksumsText = [
  '1111111111111111111111111111111111111111111111111111111111111111  hugo_0.158.0_linux-amd64.tar.gz',
  `${helloWorldSHA256}  hugo_extended_0.158.0_linux-amd64.tar.gz`,
  '2222222222222222222222222222222222222222222222222222222222222222  hugo_extended_0.158.0_windows-amd64.zip'
].join('\n');

describe('verify-checksum', () => {
  let tempDir = '';
  let filePath = '';

  beforeAll(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-checksum-'));
    filePath = path.join(tempDir, 'asset.tar.gz');
    fs.writeFileSync(filePath, 'hello world');
  });

  afterAll(() => {
    fs.rmSync(tempDir, {recursive: true, force: true});
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
  });

  afterEach(() => {
    clearMockFetchResponses();
  });

  describe('getChecksumsURL()', () => {
    test('return the checksums file URL of a release', () => {
      expect(getChecksumsURL('0.158.0')).toBe(checksumsURL);
    });
  });

  describe('findChecksum()', () => {
    test('return the checksum of the given asset', () => {
      expect(findChecksum(checksumsText, 'hugo_extended_0.158.0_linux-amd64.tar.gz')).toBe(
        helloWorldSHA256
      );
    });

    test('return an empty string when the asset is not listed', () => {
      expect(findChecksum(checksumsText, 'hugo_extended_0.158.0_darwin-universal.pkg')).toBe('');
    });
  });

  describe('fetchReleaseChecksum()', () => {
    test('return the checksum of the downloaded asset', async () => {
      mockFetchResponse(checksumsURL, 200, checksumsText);

      expect(await fetchReleaseChecksum('0.158.0', assetURL)).toBe(helloWorldSHA256);
    });

    test('warn and return an empty string when the checksums file is missing', async () => {
      mockFetchResponse(checksumsURL, 404);

      expect(await fetchReleaseChecksum('0.158.0', assetURL)).toBe('');
      expect(core.warning).toHaveBeenCalledWith(
        `request to ${checksumsURL} failed with status 404`
      );
    });

    test('warn and return an empty string when the fetch throws', async () => {
      mockFetchError(checksumsURL, new Error('socket hang up'));

      expect(await fetchReleaseChecksum('0.158.0', assetURL)).toBe('');
      expect(core.warning).toHaveBeenCalledWith(
        `request to ${checksumsURL} failed: Error: socket hang up`
      );
    });

    test('warn and return an empty string when the asset is not listed', async () => {
      mockFetchResponse(checksumsURL, 200, checksumsText);
      const pkgAssetURL =
        'https://github.com/gohugoio/hugo/releases/download/v0.158.0/hugo_extended_0.158.0_darwin-universal.pkg';

      expect(await fetchReleaseChecksum('0.158.0', pkgAssetURL)).toBe('');
      expect(core.warning).toHaveBeenCalledWith(
        `no SHA-256 checksum for hugo_extended_0.158.0_darwin-universal.pkg found in ${checksumsURL}`
      );
    });
  });

  describe('computeSHA256()', () => {
    test('compute the SHA-256 checksum of a file', async () => {
      expect(await computeSHA256(filePath)).toBe(helloWorldSHA256);
    });
  });

  describe('verifyChecksum()', () => {
    test('pass when the checksum matches', async () => {
      await expect(
        verifyChecksum(filePath, 'https://example.com/hugo.tar.gz', helloWorldSHA256)
      ).resolves.toBeUndefined();
    });

    test('ignore case and surrounding whitespace in the expected checksum', async () => {
      await expect(
        verifyChecksum(
          filePath,
          'https://example.com/hugo.tar.gz',
          ` ${helloWorldSHA256.toUpperCase()} `
        )
      ).resolves.toBeUndefined();
    });

    test('throw a clear error when the checksum does not match', async () => {
      const wrongSHA256 = 'a'.repeat(64);

      await expect(
        verifyChecksum(filePath, 'https://example.com/hugo.tar.gz', wrongSHA256)
      ).rejects.toThrow(
        `SHA-256 checksum mismatch for https://example.com/hugo.tar.gz (expected: ${wrongSHA256}, actual: ${helloWorldSHA256})`
      );
    });
  });
});
