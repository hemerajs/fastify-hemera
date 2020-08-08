'use strict'

const fp = require('fastify-plugin')
const Nats = require('nats')
const Hemera = require('nats-hemera')

function fastifyHemera(fastify, opts, next) {
  const hemera = new Hemera(opts.natsInstance || Nats.connect(opts.nats), opts.hemera)

  hemera.ext('onError', error => fastify.log.error(error))

  if (opts.plugins && opts.plugins.length) {
    opts.plugins.forEach(p => {
      if (p.plugin) {
        hemera.use(p.plugin, p.options)
      } else {
        hemera.use(p)
      }
    })
  }

  fastify.addHook('onClose', (instance, done) => {
    fastify.log.debug('closing hemera...')
    hemera.close(() => {
      fastify.log.debug('hemera closed!')
      done()
    })
  })

  fastify.decorate('hemera', hemera)
  fastify.decorateRequest('hemera', hemera)
  fastify.decorateReply('add', hemera.add.bind(hemera))
  fastify.decorateReply('act', function act(pattern) {
    return hemera
      .act(pattern)
      .then(resp => this.send(resp.data))
      .catch(err => this.send(err))
  })

  hemera.ready(next)
}

module.exports = fp(fastifyHemera, {
  fastify: '>=2.0.0',
  name: 'fastify-hemera'
})
