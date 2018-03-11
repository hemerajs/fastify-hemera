'use strict'

const fp = require('fastify-plugin')
const Nats = require('nats')
const Hemera = require('nats-hemera')

function fastifyHemera(fastify, opts, next) {
  const hemera = new Hemera(
    opts.natsInstance || Nats.connect(opts.nats),
    opts.hemera
  )

  hemera.on('error', error => fastify.log.error(error))
  hemera.on('serverResponseError', error => fastify.log.error(error))
  hemera.on('clientResponseError', error => fastify.log.error(error))

  if (opts.plugins) {
    opts.plugins.forEach(p => hemera.use(p))
  }

  fastify.addHook('onClose', (instance, done) => {
    hemera.close(done)
  })

  fastify.decorate('hemera', hemera)
  fastify.decorateRequest('hemera', hemera)
  fastify.decorateReply('add', hemera.add.bind(hemera))
  fastify.decorateReply('act', function(pattern) {
    return hemera
      .act(pattern)
      .then(resp => this.send(resp.data))
      .catch(err => this.send(err))
  })

  hemera.ready(next)
}

module.exports = fp(fastifyHemera, {
  fastify: '^1.0.0',
  name: 'fastify-hemera'
})
