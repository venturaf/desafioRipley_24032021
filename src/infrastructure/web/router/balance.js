const balanceHandler = require('./../handler/balance.handler');
const { validBalance } = require('../midleware/balance.midleware');
const { StatusCodes } = require("http-status-codes");
module.exports = (router, repository) => {
  const { currentBalance, depositBalance, withdrawBalance, transferBalance } = balanceHandler(repository);
  router.get('/:rut', async (req, res) => {
    const balance = await currentBalance(req.params);
    if (balance && balance.rut) res.status(StatusCodes.OK).json(balance);
    else res.status(StatusCodes.NOT_FOUND).json(balance);
  });
  router.post('/deposit', validBalance, async (req, res) => {
    const isDosited = await depositBalance(req.body);
    if (isDosited) res.status(StatusCodes.OK).json("Cash deposited");
    else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("an error ocurre while depositing cash");
  });
  router.post('/withdraw', validBalance, async (req, res) => {
    const isDosited = await withdrawBalance(req.body);
    if (isDosited && typeof isDosited === 'string') res.status(StatusCodes.NOT_ACCEPTABLE).json(isDosited);
    else if (isDosited) res.status(StatusCodes.OK).json("Cash withdrawed");
    else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("an error ocurre while withdraw cash");
  });
  router.post('/transfer', validBalance, async (req, res) => {
    const isDosited = await transferBalance(req.body);
    if (isDosited && typeof isDosited === 'string') res.status(StatusCodes.NOT_ACCEPTABLE).json(isDosited);
    else if (isDosited) res.status(StatusCodes.OK).json("Balance have been transfer successfull");
    else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("an error ocurre while transfer cash");
  });
  return router;
}