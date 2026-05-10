export default function getURL(
  os: string,
  arch: string,
  extended: string,
  version: string
): string[] {
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
  const assetBase = `hugo_${extendedStr(extended)}${version}_`;
  const legacyVersionedAssetBase = `hugo_${extendedStr(extended)}v${version}_`;
  const assetBases = [assetBase, legacyVersionedAssetBase];
  const assetURLs = (assetNames: string[]): string[] => {
    return Array.from(new Set(assetNames)).map(assetName => {
      return `${baseURL}/v${version}/${assetName}`;
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

  if (os === 'Windows') {
    return assetURLs(
      assetBases.flatMap(assetBase => [
        `${assetBase}Windows-${arch}.zip`,
        `${assetBase}windows-${lowerArch(arch)}.zip`
      ])
    );
  }

  if (os === 'Linux') {
    return assetURLs(
      assetBases.flatMap(assetBase => [
        `${assetBase}Linux-${arch}.tar.gz`,
        `${assetBase}Linux_${arch}.tar.gz`,
        `${assetBase}linux-${lowerArch(arch)}.tar.gz`
      ])
    );
  }

  return assetURLs([`${assetBase}${os}-${arch}.tar.gz`]);
}
