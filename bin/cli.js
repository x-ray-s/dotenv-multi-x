#!/usr/bin/env node

const dotenv = require('../lib/index.js')
const spawn = require('cross-spawn')
dotenv.init()
const argv = require('minimist')(process.argv.slice(2))

if (argv.p) {
    const value = process.env[argv.p]
    console.log(value != null ? value : '')
    process.exit()
}
const command = argv._[0]
if (!command) {
    process.exit(1)
}
spawn(command, argv._.slice(1), { stdio: 'inherit' }).on(
    'exit',
    function (exitCode, signal) {
        if (typeof exitCode === 'number') {
            process.exit(exitCode)
        } else {
            process.kill(process.pid, signal)
        }
    }
)
