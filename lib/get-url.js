"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getURL(os, extended, version) {
    const extendedStr = (extended) => {
        if (extended === 'true') {
            return 'extended_';
        }
        else {
            return '';
        }
    };
    const ext = (os) => {
        if (os === 'Windows') {
            return 'zip';
        }
        else {
            return 'tar.gz';
        }
    };
    const hugoName = `hugo_${extendedStr(extended)}${version}_${os}-64bit`;
    const baseURL = 'https://github.com/gohugoio/hugo/releases/download';
    const url = `${baseURL}/v${version}/${hugoName}.${ext(os)}`;
    return url;
}
exports.default = getURL;
//# sourceMappingURL=get-url.js.map