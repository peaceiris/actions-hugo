const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getLatestVersion() {
  return new Promise((resolve, reject) => {
    // if (typeof milliseconds !== "number") {
    //   throw new Error("milleseconds not a number");
    // }

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
      } else if (xhr.status !== 200) {
        reject(`ERROR: got status ${xhr.status}`);
      }
    };
  });
}

module.exports = getLatestVersion;
