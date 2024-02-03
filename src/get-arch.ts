export default function getArch(arch: string): string {
  switch (arch) {
    case 'x64':
      return 'amd64';
    case 'arm':
      return 'arm';
    case 'arm64':
      return 'arm64';
    case 'universal':
      return 'universal';
    default:
      throw new Error(`${arch} is not supported`);
  }
}
