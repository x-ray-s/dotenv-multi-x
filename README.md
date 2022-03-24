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

```javascript
import dotenv from 'dotenv-multi'
dotenv.init()

console.log(process.env)
```

## Methods

- init
- parse
- getConfig

### init

`init` will get `mode` from `process.env` or `process.argv`, read the `.env*` files, parse the content, handle the inheritance, and reture an object.

**options** : your mode options list. Default: `['local', 'dev', 'production', 'test', 'release', 'staging']`

```javascript
dotenv.init(['local', 'test', 'prod'])
```

### parse

Parse the content and return an Object with the parsed keys and values.

```javascript
dotenv.parse(Buffer.from('PROT=3001'))
```

### getConfig

Accept a `mode` and read `.env*` files, and handle the inheritance. return finally result.

## Test

```bash
# Windows Powershell
$env:mode="local"
node .\example\index.mjs
# Mac
mode=local node ./example/index.mjs

# or
node .\example\index.mjs --mode=local
```

## Suggestion

Add `.env.local*` in your `.gitignore` file.

## Why not dotenv
