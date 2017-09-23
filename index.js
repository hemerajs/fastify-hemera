'use strict'

const fp = require('fastify-plugin')
const Nats = require('nats')
const Hemera = require('nats-hemera')

function fastifyHemera(fastify, opts, next) {
  const hemera = new Hemera(Nats.connect(opts.nats), opts.hemera)

  if (opts.plugins) {
    opts.plugins.forEach(plugin => {
      if (plugin.plugin) {
        hemera.use(plugin)
      } else {
        hemera.use(plugin.register, plugin.options)
      }
    })
  }

  fastify.addHook('onClose', (instance, done) => {
    hemera.close(done)
  })

  fastify.decorate('hemera', hemera)
  fastify.decorateRequest('hemera', hemera)
  fastify.decorateReply('add', hemera.add.bind(hemera))
  fastify.decorateReply('act', hemera.act.bind(hemera))

  hemera.ready(next)
}

module.exports = fp(fastifyHemera, '>=0.28.2')
