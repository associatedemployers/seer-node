const Router = require('koa-router'),
      asyncMiddleware = require('./util/express-async-middleware');

const responseCache = {
  getCache () {
    return !this.cache || this.cache.expires < new Date() ? false : this.cache.data;
  },

  setCache (data, debounce) {
    this.cache = {
      data,
      expires: (new Date()).setTime((new Date()).getTime() + (debounce || 0))
    };
  }
};

function setup (app, opts, healthCheck) {
  if (!app) {
    throw new Error('Routing requires an app instance passed as the first argument');
  }

  if (!healthCheck || typeof healthCheck !== 'function') {
    throw new Error('Routing requires a health check function passed as the last argument');
  }
}

exports.barebones = function (app, opts, healthCheck) {
  return async function (options) {
    let cache = responseCache.getCache(),
        result = cache;

    if (!result) {
      result = await healthCheck(options);
      responseCache.setCache(result, opts.debounce);
    }

    return result;
  };
};

exports.express = function (app, opts, healthCheck) {
  setup(...arguments);

  app.get(opts.statusUrl, asyncMiddleware(async function (req, res) {
    let cache = responseCache.getCache(),
        result = cache;

    if (!result) {
      result = await healthCheck(req);
      responseCache.setCache(result, opts.debounce);
    }

    res.send(result);
  }));

  return app;
};

exports.koa = function (app, opts, healthCheck) {
  setup(...arguments);

  let router = new Router();

  router.get(opts.statusUrl, async (ctx) => {
    let cache = responseCache.getCache(),
        result = cache;

    if (!result) {
      result = await healthCheck(ctx);
      responseCache.setCache(result, opts.debounce);
    }

    ctx.body = result;
  });

  app
  .use(router.routes())
  .use(router.allowedMethods());

  return app;
};
