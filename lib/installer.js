"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const io = __importStar(require("@actions/io"));
const get_os_1 = __importDefault(require("./get-os"));
const get_url_1 = __importDefault(require("./get-url"));
function installer(version) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const extended = core.getInput("extended");
            console.log(`Hugo extended: ${extended}`);
            const osName = get_os_1.default(process.platform);
            console.log(`Operating System: ${osName}`);
            const hugoURL = get_url_1.default(osName, extended, version);
            core.debug(`hugoURL: ${hugoURL}`);
            const hugoPath = `${process.env.HOME}/bin`;
            yield io.mkdirP(hugoPath);
            core.addPath(hugoPath);
            // Download and extract Hugo binary
            const hugoAssets = yield tc.downloadTool(hugoURL);
            let hugoBin = "";
            if (osName === "Windows") {
                const hugoExtractedFolder = yield tc.extractZip(hugoAssets, "/tmp");
                hugoBin = `${hugoExtractedFolder}/hugo.exe`;
            }
            else {
                const hugoExtractedFolder = yield tc.extractTar(hugoAssets, "/tmp");
                hugoBin = `${hugoExtractedFolder}/hugo`;
            }
            yield io.mv(hugoBin, hugoPath);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
exports.default = installer;
