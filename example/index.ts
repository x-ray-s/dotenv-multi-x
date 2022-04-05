import dotenv from '../lib/index'
import assert from 'assert'
dotenv.init()

assert.strictEqual(process.env.DEBUG, 'true')
