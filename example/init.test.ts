import '../lib/init'
import assert from 'assert'

// from .env.local
assert.strictEqual(process.env.DEBUG, 'true')
// from .env.dev.local
assert.strictEqual(process.env.PORT, '4000')
// from .env.dev
assert.strictEqual(process.env.NAME, 'DEV')
