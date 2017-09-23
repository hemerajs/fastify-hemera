'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
let fastify = null

function hemeraActions(fastify) {
  fastify.hemera.add(
    {
      topic: 'math',
      cmd: 'add'
    },
    function(req, reply) {
      reply(null, { result: req.a + req.b })
    }
  )
}

function routes(fastify) {
  fastify.route({
    method: 'GET',
    url: '/reply',
    handler: (req, reply) => {
      req.log.info('Reply route')
      reply.send(reply.act({ topic: 'math', cmd: 'add', a: 1, b: 2 }))
    }
  })
}

t.tearDown(() => {
  fastify.close()
})

test('boot server', t => {
  fastify = Fastify({
    logger: {
      level: 'info'
    }
  })
  fastify
    .register(require('./'), {
      nats: 'nats://localhost:4222'
    })
    .after(() => {
      routes(fastify)
      hemeraActions(fastify)
      t.end()
    })
})

test('reply interface', t => {
  t.plan(1)

  fastify.inject(
    {
      method: 'GET',
      url: '/reply'
    },
    res => {
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, { result: 3 })
    }
  )
})
