const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getLatestVersion() {
  // return new Promise((resolve, reject) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    const url = "https://api.github.com/repos/gohugoio/hugo/releases/latest";
    xhr.open("GET", url);
    xhr.send();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const latestURL = result["assets"][0].browser_download_url;
        const latestVersion = latestURL.match(/(\d+).(\d+).(\d+)/g)[0];

        resolve(latestVersion);
        // } else {
        //   reject(`ERROR: got status ${xhr.status}`);
      }
    };
  });
}

module.exports = getLatestVersion;
