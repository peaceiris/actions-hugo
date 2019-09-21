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
const exec = __importStar(require("@actions/exec"));
const get_latest_version_1 = __importDefault(require("./get-latest-version"));
const installer_1 = __importDefault(require("./installer"));
// most @actions toolkit packages have async methods
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const dump = () => __awaiter(this, void 0, void 0, function* () {
            // Show version
            yield exec.exec('hugo version');
            yield exec.exec('go version');
            yield exec.exec('git --version');
        });
        try {
            const hugoVersion = core.getInput('hugo-version');
            console.log(`Hugo version: ${hugoVersion}`);
            if (hugoVersion === '' || hugoVersion === 'latest') {
                get_latest_version_1.default().then(function (latestVersion) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield installer_1.default(latestVersion);
                        yield dump();
                    });
                }, function (error) {
                    core.setFailed(error);
                });
            }
            else {
                yield installer_1.default(hugoVersion);
                yield dump();
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
