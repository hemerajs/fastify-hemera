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
      reply.act({ topic: 'math', cmd: 'add', a: req.query.a, b: req.query.b })
    }
  })

  fastify.route({
    method: 'GET',
    url: '/request',
    schema: {
      querystring: {
        a: { type: 'integer' },
        b: { type: 'integer' }
      }
    },
    handler: (req, reply) => {
      req.log.info('Reply route')
      return req.hemera.act({
        topic: 'math',
        cmd: 'add',
        a: req.query.a,
        b: req.query.b
      }).then((resp) => resp.data)
    }
  })
}

function build(opts) {
  const fastify = Fastify({ logger: opts.logger })

  fastify
    .register(require('./'), {
      hemera: opts.hemera,
      plugins: opts.plugins,
      nats: opts.nats
    })
    .after(err => {
      if (err) throw err
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
  fastify.listen(3000)
}

module.exports = build
