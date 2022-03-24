"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.setParsed = exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
// copy from https://github.com/motdotla/dotenv/blob/master/lib/main.js
// Parser src into an Object
function parse(src) {
    const obj = {};
    // Convert buffer to string
    let lines = src.toString();
    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/gm, '\n');
    let match;
    while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        // Default undefined or null to empty string
        let value = match[2] || '';
        // Remove whitespace
        value = value.trim();
        // Check if double quoted
        const maybeQuote = value[0];
        // Remove surrounding quotes
        value = value.replace(/^(['"`])([\s\S]*)\1$/gm, '$2');
        // Expand newlines if double quoted
        if (maybeQuote === '"') {
            value = value.replace(/\\n/g, '\n');
            value = value.replace(/\\r/g, '\r');
        }
        // Add to object
        obj[key] = value;
    }
    return obj;
}
function getConfig(mode) {
    const file = path_1.default.resolve(process.cwd(), `.env.${mode}`);
    const envDefault = parse(fs_1.default.readFileSync(path_1.default.resolve(process.cwd(), '.env')));
    console.log(envDefault);
    if (fs_1.default.existsSync(file)) {
        const envConfig = parse(fs_1.default.readFileSync(file));
        const merge = Object.assign(envDefault || {}, envConfig);
        console.log(merge);
        return merge;
    }
    return envDefault;
}
exports.getConfig = getConfig;
function setParsed(env, override) {
    Object.keys(env).forEach(function (key) {
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = env[key];
        }
        else {
            if (override === true) {
                process.env[key] = env[key];
            }
        }
    });
}
exports.setParsed = setParsed;
function init(options = [
    'local',
    'dev',
    'production',
    'test',
    'release',
    'staging',
]) {
    let mode = process.env.mode;
    if (!mode) {
        const argv = (0, yargs_1.default)(process.argv.slice(2))
            .options({
            mode: {
                choices: options,
                demandOption: true,
            },
        })
            .parseSync();
        mode = argv.mode;
    }
    console.log(mode);
    const env = getConfig(mode);
    setParsed(env);
    return env;
}
exports.init = init;
const dotenv = {
    init,
    getConfig,
    setParsed,
};
exports.default = dotenv;
