export default function getOS(platform: string): string {
  switch (platform) {
    case 'linux':
      return 'linux';
    case 'darwin':
      return 'darwin';
    case 'win32':
      return 'windows';
    default:
      throw new Error(`${platform} is not supported`);
  }
}
