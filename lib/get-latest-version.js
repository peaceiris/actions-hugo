"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
function getLatestVersion() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = 'https://formulae.brew.sh/api/formula/hugo.json';
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                const latestVersion = result.versions.stable;
                resolve(latestVersion);
            }
            else if (xhr.readyState === 4 && xhr.status !== 200) {
                reject(`ERROR: got status ${xhr.status} of ${url}`);
            }
        };
    });
}
exports.default = getLatestVersion;
