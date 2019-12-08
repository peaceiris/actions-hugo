export default function getOS(platform: string) {
  if (platform === 'linux') {
    return 'Linux';
  } else if (platform === 'darwin') {
    return 'macOS';
  } else if (platform === 'win32') {
    return 'Windows';
  } else {
    throw new Error(`${platform} is not supported`);
  }
}
