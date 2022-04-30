## Features

Support multiple `.env` files and keep the inheritance

Priority:

- local > not unassigned local
- mode > not unassigned mode

e.g. `.env.{{mode}}.local` > `.env.{{mode}}` > `.env.local` > `.env`

```bash
# in .env file
HOST=127.0.0.1
PORT=3000
# in .env.local file
PORT=3001

# out
{"HOST": "127.0.0.1", "PORT": "3001"}
```

## How to use

```shell
npm i dotenv-multi-x
# or
yarn add dotenv-multi-x
```

```javascript
import dotenv from 'dotenv-multi-x'
dotenv.init()

console.log(process.env)
```

## Commond Line

```shell

dotenv --mode=dev node ./example/cli.test.js

```

## Methods

- init
- parse
- getConfig

### init

`init` will get `mode` from `process.env` or `process.argv`, read the `.env*` files, parse the content, handle the inheritance, and reture an object.

```javascript
dotenv.init()
```

### parse

Parse the content and return an Object with the parsed keys and values.

```javascript
dotenv.parse(Buffer.from('PROT=3001'))
```

### getConfig

Accept a `mode` and read `.env*` files, and handle the inheritance. return finally result.

## Example

```bash
# Windows Powershell
$env:mode="dev"
node .\example\index.mjs
# Mac
mode=dev node ./example/index.mjs

# or
node .\example\index.mjs --mode=dev
```

## Suggest

Add `.env.local*` in your `.gitignore` file.

## Why not dotenv

When you run your code in multiple environments, you may need some different environments variable. But `dotenv` didn't support multiple `.env` files.

If you don't use `docker` or other `CI/CD` environment variable to instead of `.env` file, or don't use shell script to replace `.env` file, the multiple files is the easiest way to make it work.

For example, your server launched on port 3000, but you want to run on 3001 in local device, the `.env` file will be shared on repos which used `git`, so you need a `.env.local` file, this file has higher-priority then `.env` and it can doesn't share with `git`.

You can create mutiple `.env*` files, and use them in different environments as easier as possible.
