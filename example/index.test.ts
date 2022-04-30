import dotenv from '../lib/index'
import assert from 'assert'
dotenv.init()

// from .env.local
assert.strictEqual(process.env.DEBUG, 'true')
// from .env.dev.local
assert.strictEqual(process.env.PORT, '4000')
// from .env.dev
assert.strictEqual(process.env.NAME, 'DEV')
