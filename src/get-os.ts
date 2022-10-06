export default function getOS(platform: string, version: string): string {
  const segments = version.split('.').map(s => parseInt(s));
  switch (platform) {
    case 'linux':
      return (segments[0] >= 0 && segments[1] >= 103) ? 'linux' : 'Linux'
    case 'darwin':
      return (segments[0] >= 0 && segments[1] >= 102) ? 'darwin' : 'macOS'
    case 'win32':
      return (segments[0] >= 0 && segments[1] >= 103) ? 'windows' : 'Windows'
    default:
      throw new Error(`${platform} is not supported`);
  }
}
