function getOS(platform) {
  if (platform === "linux") {
    return "Linux";
  } else if (platform === "darwin") {
    return "macOS";
  } else if (platform === "win32") {
    return "Windows";
    // throw new Error("Windows is not supported");
  } else {
    throw new Error(`${platform} is not supported`);
  }
}

module.exports = getOS;
