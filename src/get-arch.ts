import { conventions } from "./get-conventions";

export default function getArch(arch: string, os: string, conventions: conventions): string {
  if (os == 'darwin' || os == 'macOS' && conventions.arch.darwinUniversal) {
    return 'universal'
  }

  switch (arch) {
    case 'x64':
      return conventions.arch.standardizedNaming ? 'amd64': '64bit' ;
    case 'arm':
      if (conventions.arch.dropped32BitSupport) {
        throw new Error(`${arch} is not supported`);
      }

      return 'ARM';
    case 'arm64':
      return conventions.arch.standardizedNaming ? 'arm64' : 'ARM64';
    default:
      throw new Error(`${arch} is not supported`);
  }
}
