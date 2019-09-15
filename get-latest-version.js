let getLatestVersion = function() {
  return new Promise((resolve, reject) => {
    // if (typeof milliseconds !== "number") {
    //   throw new Error("milleseconds not a number");
    // }

    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        if (this.response) {
          const latestURL = this.response["assets"][0].browser_download_url;
          console.log(latestURL);
          const latestVersion = latestURL.match(/(\d+).(\d+).(\d+)/g)[0];
          console.log(latestVersion);
          return latestVersion;
        }
      }
    };

    xmlHttpRequest.open(
      "GET",
      "https://api.github.com/repos/gohugoio/hugo/releases/latest",
      true
    );
    xmlHttpRequest.responseType = "json";
    xmlHttpRequest.send(null);

    resolve(version);
  });
};

module.exports = getLatestVersion;
