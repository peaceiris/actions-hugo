import * as core from '@actions/core';
import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {createReadStream} from 'fs';
import {pipeline} from 'stream/promises';

export function getChecksumsURL(version: string): string {
  return `https://github.com/gohugoio/hugo/releases/download/v${version}/hugo_${version}_checksums.txt`;
}

export function findChecksum(checksumsText: string, assetName: string): string {
  for (const line of checksumsText.split('\n')) {
    const [checksum, filename] = line.trim().split(/\s+/);
    if (filename === assetName && checksum) {
      return checksum;
    }
  }

  return '';
}

export const FetchChecksumsTimeoutMs = 10000;

export async function fetchReleaseChecksum(version: string, assetURL: string): Promise<string> {
  const checksumsURL = getChecksumsURL(version);
  const assetName = assetURL.substring(assetURL.lastIndexOf('/') + 1);

  let checksumsText = '';
  try {
    const response = await fetch(checksumsURL, {
      signal: AbortSignal.timeout(FetchChecksumsTimeoutMs)
    });
    if (!response.ok) {
      core.warning(`request to ${checksumsURL} failed with status ${response.status}`);
      return '';
    }
    checksumsText = await response.text();
  } catch (error) {
    core.warning(`request to ${checksumsURL} failed: ${error}`);
    return '';
  }

  const checksum = findChecksum(checksumsText, assetName);
  if (checksum === '') {
    core.warning(`no SHA-256 checksum for ${assetName} found in ${checksumsURL}`);
  }

  return checksum;
}

export async function computeSHA256(filePath: string): Promise<string> {
  const hash = createHash('sha256');
  await pipeline(createReadStream(filePath), hash);
  return hash.digest('hex');
}

export async function verifyChecksum(
  filePath: string,
  assetURL: string,
  expectedSHA256: string
): Promise<void> {
  const expected = expectedSHA256.trim().toLowerCase();
  const actual = await computeSHA256(filePath);

  if (actual !== expected) {
    throw new Error(
      `SHA-256 checksum mismatch for ${assetURL} (expected: ${expected}, actual: ${actual})`
    );
  }

  core.info(`SHA-256 checksum verified: ${actual}`);
}
