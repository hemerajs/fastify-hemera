'use strict'

const t = require('tap')
const test = t.test
const build = require('./example')
let fastify = null

t.tearDown(() => {
  fastify.close()
})

test('boot server', t => {
  t.plan(0)
  fastify = build()
})

test('reply interface', t => {
  t.plan(1)

  fastify.inject(
    {
      method: 'GET',
      url: '/reply?a=1&b=2'
    },
    res => {
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, { result: 3 })
    }
  )
})
