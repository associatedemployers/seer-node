const Router = require('koa-router'),
      asyncMiddleware = require('./util/express-async-middleware');

function setup (app, opts, healthCheck) {
  if (!app) {
    throw new Error('Routing requires an app instance passed as the first argument');
  }

  if (!healthCheck || typeof healthCheck !== 'function') {
    throw new Error('Routing requires a health check function passed as the last argument');
  }
}

exports.express = function (app, opts, healthCheck) {
  setup(...arguments);

  app.get(opts.statusUrl, asyncMiddleware(async function (req, res) {
    res.send(await healthCheck(req.body));
  }));

  return app;
};

exports.koa = function (app, opts, healthCheck) {
  setup(...arguments);

  let router = new Router();

  router.get(opts.statusUrl, async (ctx) => {
    ctx.body = await healthCheck(ctx);
  });

  app
  .use(router.routes())
  .use(router.allowedMethods());

  return app;
};
