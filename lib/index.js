"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.parse = exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const argv = require('minimist')(process.argv.slice(2));
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
exports.parse = parse;
function _resolve(filename) {
    return path_1.default.resolve(process.cwd(), filename);
}
function readAndParse(path) {
    if (fs_1.default.existsSync(path)) {
        return parse(fs_1.default.readFileSync(path));
    }
    else {
        return {};
    }
}
function getConfig(mode) {
    try {
        let files = ['.env', '.env.local'];
        if (mode) {
            files = files.concat([`.env.${mode}`, `.env.${mode}.local`]);
        }
        return files
            .map((i) => readAndParse(_resolve(i)))
            .reduce((pre, cur) => {
            return {
                ...pre,
                ...cur,
            };
        }, {});
    }
    catch (e) {
        return {};
    }
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
function init() {
    let mode = process.env.mode;
    if (!mode) {
        if (argv.mode) {
            mode = argv.mode;
        }
    }
    const env = getConfig(mode);
    setParsed(env);
    return env;
}
exports.init = init;
const dotenv = {
    init,
    parse,
    getConfig,
};
exports.default = dotenv;
