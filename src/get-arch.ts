export default function getArch(arch: string): string {
  switch (arch) {
    case 'x64':
      return '64bit';
    case 'arm':
      return 'ARM';
    case 'arm64':
      return 'ARM64';
    default:
      throw new Error(`${arch} is not supported`);
  }
}
