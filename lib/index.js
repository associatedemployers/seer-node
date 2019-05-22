const routing = require('./routing'),
      buildHealthChecks = require('./health-checks');

const defaultOptions = {
  framework: 'express',
  statusUrl: '/api/__status__',
  debounce:  30 * 1000 // 30 sec
};

module.exports = function (appInstance, options = {}) {
  const opts = Object.assign({}, defaultOptions, options),
        routingHandler = routing[opts.framework];

  return routingHandler(appInstance, opts, buildHealthChecks(options));
};
