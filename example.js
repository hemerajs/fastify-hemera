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
      reply.send(reply.act({ topic: 'math', cmd: 'add', a: req.query.a, b: req.query.b }))
    }
  })
}

const Fastify = require('fastify')

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
  })

fastify.listen(3000)