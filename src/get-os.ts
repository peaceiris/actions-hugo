import { conventions } from "./get-conventions";

export default function getOS(platform: string, conventions: conventions): string {

  switch (platform) {
    case 'linux':
      return conventions.os.downcasedAll ? 'linux' : 'Linux'
    case 'darwin':
      return conventions.os.renamedMacOS ? 'darwin' : 'macOS'
    case 'win32':
      return conventions.os.downcasedAll ? 'windows' : 'Windows'
    default:
      throw new Error(`${platform} is not supported`);
  }
}
