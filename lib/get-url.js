function getURL(os, extended, version) {
  let extendedStr = "";
  let ext = "tar.gz";

  if (extended === true) {
    extendedStr = "extended_";
  }

  if (os === "Windows") {
    ext = "zip";
  }

  const hugoName = `hugo_${extendedStr}${version}_${os}-64bit`;
  const url = `https://github.com/gohugoio/hugo/releases/download/v${version}/${hugoName}.${ext}`;

  return url;
}

module.exports = getURL;
