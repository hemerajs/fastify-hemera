'use strict'

const Fastify = require('fastify')

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
    schema: {
      querystring: {
        a: { type: 'integer' },
        b: { type: 'integer' }
      }
    },
    handler: (req, reply) => {
      req.log.info('Reply route')
      reply.send(
        reply.act({ topic: 'math', cmd: 'add', a: req.query.a, b: req.query.b })
      )
    }
  })
}

function build(opts) {
  const fastify = Fastify(opts)

  fastify
    .register(require('./'), {
      nats: 'nats://localhost:4222'
    })
    .after(() => {
      routes(fastify)
      hemeraActions(fastify)
    })

  return fastify
}

if (require.main === module) {
  const fastify = build({
    logger: {
      level: 'info'
    }
  })
  fastify.listen(3000, err => {
    if (err) throw err
    console.log(
      `Server listenting at http://localhost:${fastify.server.address().port}`
    )
  })
}

module.exports = build
