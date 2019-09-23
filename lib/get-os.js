"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getOS(platform) {
    if (platform === 'linux') {
        return 'Linux';
    }
    else if (platform === 'darwin') {
        return 'macOS';
    }
    else if (platform === 'win32') {
        return 'Windows';
    }
    else {
        throw new Error(`${platform} is not supported`);
    }
}
exports.default = getOS;
//# sourceMappingURL=get-os.js.map