const { version } = require('../../package.json');

module.exports = function (options = {}) {
  return async function () {

    const checks = options.checks || [];

    let results = {};

    for (let i = 0; i < checks.length; i++) {
      const {
              check,
              name,
              retries
            } = checks[i],
            checkBegan = new Date();

      let pass,
          err,
          failCount = 0;

      while (!pass && failCount < (retries || 0)) {
        try {
          await check();
        } catch (e) {
          failCount++;
          err = e;
          continue;
        }

        pass = true;
      }

      results[name] = {
        healthy: !!pass,
        time:    new Date() - checkBegan
      };

      if (err) {
        results[name].error = err.messsage;
      }
    }

    const status = Object.keys(results).find(k => !results[k].healthy) ? 'failing' : 'ok';

    return {
      status,
      healthy:        status === 'ok',
      checks:         results,
      'seer-version': version
    };
  };
};
