Contains the functions of the following libraries

- [dotenv](https://github.com/motdotla/dotenv)
- [dotenv-cli](https://github.com/entropitor/dotenv-cli)

## 👋 Features

- Multiple `.env` file support
- Command Line support
- Assign a mode mode

### Support multiple `.env` files and keep the inheritance

File Priority:

- `.local` file > not unassigned local
- `.mode` file > not unassigned mode

If the mode is 'dev', then the import order is:

1. `.env.dev.local`
2. `.env.dev`
3. `.env.local`
4. `.env`

```bash
# the local file has higher priority

# in .env file
HOST=127.0.0.1
PORT=3000
# in .env.local file
PORT=3001

# out
{"HOST": "127.0.0.1", "PORT": "3001"}
```

```bash
# the assigned mode file has higher priority

# in .env file
PORT=3000
# in .env.prod file
PORT=80

# mode=prod
# out
{"PORT": "80"}
```

> 💡If you have used vite, it works the same way.

### Commond Line

```bash
$ dotenv node ./example/cli.test.js
$ dotenv --mode=dev node ./example/cli.test.js
```

OR

```bash
$ node -r dotenv-multi-x/lib/init.js ./example/cli.test.js
$ node -r dotenv-multi-x/lib/init.js ./example/cli.test.js --mode=dev
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
