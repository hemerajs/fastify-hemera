# fastify-hemera
[Fastify](https://github.com/fastify/fastify) plugin to integrate [Hemera](https://github.com/hemerajs/hemera)

## Install
```bash
npm install --save fastify-hemera
```

## Register plugin
```js
fastify.register(require("fastify-hemera"), {
    plugins: [{
      register: require('hemera-mongo-store'),
      options: {}
    }],
    hemera:{
      name: 'test',
      logLevel: 'debug'
    },
    nats: 'nats://localhost:4242'
})
```