const historyHandler = require('./../handler/history.handler');

module.exports = (router, repository) => {
  const { saveHistory, findHistory } = historyHandler(repository);

  router.post('/saveHistory', saveHistory);
  router.post('/findHistory', findHistory);

  return router;
}