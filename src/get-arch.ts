export default function getArch(arch: string, os: string, version: string): string {
  const segments = version.split('.').map(s => parseInt(s));

  if (os == 'darwin' || (os == 'macOS' && segments[0] >= 0 && segments[1] >= 102)) {
    return 'universal'
  }

  if (segments[0] >= 0 && segments[1] >= 103) {
    switch (arch) {
      case 'x64':
        return 'amd64';
      case 'arm64':
        return 'arm64';
      default:
        throw new Error(`${arch} is not supported`);
    }
  }

  switch (arch) {
    case 'x64':
      return (segments[0] >= 0 && segments[1] >= 103) ? 'amd64' : '64bit';
    case 'arm':
      if (segments[0] >= 0 && segments[1] < 102) {
        return 'ARM';
      } else {
        throw new Error(`${arch} is not supported`);
      }
    case 'arm64':
      return (segments[0] >= 0 && segments[1] >= 103) ? 'arm64' : 'ARM64';
    default:
      throw new Error(`${arch} is not supported`);
  }
}
