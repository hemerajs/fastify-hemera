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
      reply.send(
        req.hemera.act({
          topic: 'math',
          cmd: 'add',
          a: req.query.a,
          b: req.query.b
        })
      )
    }
  })
}

function build(opts, cb) {
  const fastify = Fastify({ logger: opts.logger })

  fastify
    .register(require('./'), {
      hemera: opts.hemera,
      plugins: opts.plugins,
      nats: opts.nats
    })
    .after(() => {
      routes(fastify)
      hemeraActions(fastify)
      cb(fastify)
    })
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
