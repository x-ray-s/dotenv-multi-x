import fs from 'fs'
import path from 'path'
import yargs from 'yargs'

interface ENV {
    [propName: string]: string
}

const LINE =
    /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm

// copy from https://github.com/motdotla/dotenv/blob/master/lib/main.js
// Parser src into an Object
function parse(src: Buffer) {
    const obj: ENV = {}

    // Convert buffer to string
    let lines = src.toString()

    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/gm, '\n')

    let match
    while ((match = LINE.exec(lines)) != null) {
        const key = match[1]

        // Default undefined or null to empty string
        let value = match[2] || ''

        // Remove whitespace
        value = value.trim()

        // Check if double quoted
        const maybeQuote = value[0]

        // Remove surrounding quotes
        value = value.replace(/^(['"`])([\s\S]*)\1$/gm, '$2')

        // Expand newlines if double quoted
        if (maybeQuote === '"') {
            value = value.replace(/\\n/g, '\n')
            value = value.replace(/\\r/g, '\r')
        }

        // Add to object
        obj[key] = value
    }

    return obj
}

function _resolve(filename: string) {
    return path.resolve(process.cwd(), filename)
}

function readAndParse(path: string) {
    if (fs.existsSync(path)) {
        return parse(fs.readFileSync(path))
    } else {
        return {}
    }
}

function getConfig(mode?: string) {
    try {
        const files = ['.env', '.env.local']
        if (mode) {
            files.concat([`.env.${mode}`, `.env.${mode}.local`])
        }
        return files
            .map((i) => readAndParse(_resolve(i)))
            .reduce((pre, cur) => {
                return {
                    ...pre,
                    ...cur,
                }
            }, {})
    } catch (e) {
        return {}
    }
}

function setParsed(env: ENV, override?: boolean) {
    Object.keys(env).forEach(function (key) {
        if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = env[key]
        } else {
            if (override === true) {
                process.env[key] = env[key]
            }
        }
    })
}

const _getArgMode = () => {
    const args = process.argv.slice(2)

    const modePair = args.find((val) => {
        return val.startsWith('--mode=') || val.startsWith('mode=')
    })
    console.log(modePair)
}

_getArgMode()

function init(
    options: string[] = ['dev', 'production', 'test', 'release', 'staging'],
    demandOption: boolean = false
) {
    let mode = process.env.mode
    if (!mode) {
        const argv = yargs(process.argv.slice(2))
            .options({
                mode: {
                    choices: options,
                    demandOption,
                },
            })
            .parseSync()
        mode = argv.mode
    }
    const env = getConfig(mode)
    setParsed(env)
    return env
}

const dotenv = {
    init,
    parse,
    getConfig,
}

export default dotenv

export { getConfig, parse, init }
