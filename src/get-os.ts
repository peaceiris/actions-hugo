export default function getOS(platform: string): string {
  switch (platform) {
    case 'linux':
      return 'Linux';
    case 'darwin':
      return 'macOS';
    case 'win32':
      return 'Windows';
    default:
      throw new Error(`${platform} is not supported`);
  }
}
