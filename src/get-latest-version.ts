const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export default function getLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url: string = "https://formulae.brew.sh/api/formula/hugo.json";
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        const latestVersion: string = result.versions.stable;
        resolve(latestVersion);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        reject(`ERROR: got status ${xhr.status} of ${url}`);
      }
    };
  });
}
