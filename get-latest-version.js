const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getLatestVersion() {
  // return new Promise((resolve, reject) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    const url = "https://formulae.brew.sh/api/formula/hugo.json";
    xhr.open("GET", url);
    xhr.send();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const latestVersion = result.versions.stable;
        resolve(latestVersion);
        // } else {
        //   reject(`ERROR: got status ${xhr.status}`);
      }
    };
  });
}

module.exports = getLatestVersion;
