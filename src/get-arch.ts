import {conventions} from './get-conventions';

export default function getArch(arch: string, os: string, conventions: conventions): string {
  if (conventions.arch.darwinUniversal && (os === 'darwin' || os === 'macOS')) {
    return 'universal';
  }

  switch (arch) {
    case 'x64':
      return conventions.arch.standardizedNaming ? 'amd64' : '64bit';
    case 'arm':
      if (conventions.arch.droppedWindowsArmSupport && (os === 'Windows' || os === 'windows')) {
        throw new Error(`${arch} is not supported`);
      }

      return conventions.arch.standardizedNaming ? 'arm' : 'ARM';
    case 'arm64':
      return conventions.arch.standardizedNaming ? 'arm64' : 'ARM64';
    default:
      throw new Error(`${arch} is not supported`);
  }
}
