const balanceHandler = require('./../handler/balance.handler');
const { validBalance } = require('../midleware/balance.midleware');

module.exports = (router, repository) => {
  const { currentBalance, depositBalance, withdrawBalance, transferBalance } = balanceHandler(repository);

  router.post('/current', currentBalance);
  router.post('/deposit', validBalance, depositBalance);
  router.post('/withdraw', validBalance, withdrawBalance);
  router.post('/transfer', validBalance, transferBalance);

  return router;
}