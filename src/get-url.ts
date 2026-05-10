export default function getURL(
  os: string,
  arch: string,
  extended: string,
  version: string
): string[] {
  const downloadVersion = getDownloadVersion(version);

  const extendedStr = (extended: string): string => {
    if (extended === 'true') {
      return 'extended_';
    } else {
      return '';
      // } else {
      //   throw new Error(`Invalid input (extended): ${extended}`);
    }
  };

  const lowerArch = (arch: string): string => {
    switch (arch) {
      case '64bit':
        return 'amd64';
      case 'ARM':
        return 'arm';
      case 'ARM64':
        return 'arm64';
      default:
        return arch.toLowerCase();
    }
  };

  const baseURL = 'https://github.com/gohugoio/hugo/releases/download';
  const assetBase = `hugo_${extendedStr(extended)}${downloadVersion}_`;
  const legacyVersionedAssetBase = `hugo_${extendedStr(extended)}v${downloadVersion}_`;
  const assetBases = [assetBase, legacyVersionedAssetBase];
  const assetURLs = (assetNames: string[]): string[] => {
    return Array.from(new Set(assetNames)).map(assetName => {
      return `${baseURL}/v${downloadVersion}/${assetName}`;
    });
  };

  if (os === 'macOS') {
    return assetURLs(
      assetBases.flatMap(assetBase => [
        `${assetBase}macOS-${arch}.tar.gz`,
        `${assetBase}macOS-${arch}.zip`,
        `${assetBase}macOS-all.tar.gz`,
        `${assetBase}darwin-universal.tar.gz`,
        `${assetBase}darwin-universal.pkg`
      ])
    );
  }

  if (os === 'darwin') {
    return assetURLs(
      assetBases.flatMap(assetBase => [
        `${assetBase}darwin-${arch}.tar.gz`,
        `${assetBase}darwin-${arch}.pkg`
      ])
    );
  }

  if (os === 'Windows' || os === 'windows') {
    const assetPatterns =
      os === 'windows'
        ? [`windows-${lowerArch(arch)}.zip`, `Windows-${arch}.zip`]
        : [`Windows-${arch}.zip`, `windows-${lowerArch(arch)}.zip`];

    return assetURLs(
      assetBases.flatMap(assetBase => assetPatterns.map(asset => `${assetBase}${asset}`))
    );
  }

  if (os === 'Linux' || os === 'linux') {
    const assetPatterns =
      os === 'linux'
        ? [`linux-${lowerArch(arch)}.tar.gz`, `Linux-${arch}.tar.gz`, `Linux_${arch}.tar.gz`]
        : [`Linux-${arch}.tar.gz`, `Linux_${arch}.tar.gz`, `linux-${lowerArch(arch)}.tar.gz`];

    return assetURLs(
      assetBases.flatMap(assetBase => assetPatterns.map(asset => `${assetBase}${asset}`))
    );
  }

  return assetURLs([`${assetBase}${os}-${arch}.tar.gz`]);
}

export function getDownloadVersion(version: string): string {
  if (version === '0.139.5') {
    // v0.139.5 has no release archives; Hugo publishes the same archives under v0.139.4.
    return '0.139.4';
  }

  return version;
}
