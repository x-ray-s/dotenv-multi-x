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

function getConfig(mode: string) {
    const file = path.resolve(process.cwd(), `.env.${mode}`)

    const envDefault = parse(
        fs.readFileSync(path.resolve(process.cwd(), '.env'))
    )

    if (fs.existsSync(file)) {
        const envConfig = parse(fs.readFileSync(file))
        const merge = Object.assign(envDefault || {}, envConfig)
        return merge
    }
    return envDefault as ENV
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

function init(
    options: string[] = [
        'local',
        'dev',
        'production',
        'test',
        'release',
        'staging',
    ]
) {
    let mode = process.env.mode
    if (!mode) {
        const argv = yargs(process.argv.slice(2))
            .options({
                mode: {
                    choices: options,
                    demandOption: true,
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
