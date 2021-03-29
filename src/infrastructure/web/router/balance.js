const balanceHandler = require('./../handler/balance.handler');
const { validBalance } = require('../midleware/balance.midleware');
const { StatusCodes } = require("http-status-codes");
module.exports = (router, repository) => {
  const { currentBalance, depositBalance, withdrawBalance, transferBalance } = balanceHandler(repository);
  router.get('/current/:rut', async (req, res) => {
    const balance = await currentBalance(req.params);
    if (balance && balance.rut) res.status(StatusCodes.OK).json(balance);
    else res.status(StatusCodes.OK).json(balance);
  });
  router.post('/deposit', validBalance, async (req, res) => {
    const isDosited = await depositBalance(req.body);
    if (isDosited) res.status(StatusCodes.OK).json("Deposito exitoso");
    else res.status(StatusCodes.OK).json("Algo a ocurrido mientras hacia el deposito");
  });
  router.post('/withdraw', validBalance, async (req, res) => {
    const isDosited = await withdrawBalance(req.body);
    if (isDosited && typeof isDosited === 'string') res.status(StatusCodes.NOT_ACCEPTABLE).json(isDosited);
    else if (isDosited) res.status(StatusCodes.OK).json("Retiro exitoso");
    else res.status(StatusCodes.OK).json("Algo a ocurrido mientras hacia el retiro");
  });
  router.post('/transfer', validBalance, async (req, res) => {
    const isDosited = await transferBalance(req.body);
    if (isDosited && typeof isDosited === 'string') res.status(StatusCodes.NOT_ACCEPTABLE).json(isDosited);
    else if (isDosited) res.status(StatusCodes.OK).json("Transferencia exitosa");
    else res.status(StatusCodes.OK).json("Algo a ocurrido mientras hacia la transferencia");
  });
  return router;
}