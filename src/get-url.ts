export default function getURL(
  os: string,
  extended: string,
  version: string
): string {
  const extendedStr = (extended: string) => {
    if (extended === 'true') {
      return 'extended_';
    } else {
      return '';
      // } else {
      //   throw new Error(`Invalid input (extended): ${extended}`);
    }
  };

  const ext = (os: string) => {
    if (os === 'Windows') {
      return 'zip';
    } else {
      return 'tar.gz';
    }
  };

  const hugoName: string = `hugo_${extendedStr(
    extended
  )}${version}_${os}-64bit`;
  const baseURL: string = 'https://github.com/gohugoio/hugo/releases/download';
  const url: string = `${baseURL}/v${version}/${hugoName}.${ext(os)}`;

  return url;
}
