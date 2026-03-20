export default function getURL(
  system: {
    os: string,
    arch: string,
  },
  options: {
    extended: string,
    withdeploy: string,
    version: string  
  }
): string {
  let withdeployStr = '';
  if (options.withdeploy === 'true') {
    withdeployStr = 'withdeploy_';
  }
  let extendedStr = '';
  if (options.extended === 'true' || withdeployStr) {
    extendedStr = 'extended_';
  }
  let ext = 'tar.gz';
  if (system.os === 'Windows') {
    ext = 'zip';
  }

  const hugoName = `hugo_${extendedStr}${withdeployStr}${options.version}_${system.os}-${system.arch}`;
  const baseURL = 'https://github.com/gohugoio/hugo/releases/download';
  const url = `${baseURL}/v${options.version}/${hugoName}.${ext}`;

  return url;
}
