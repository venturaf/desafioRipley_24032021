const historyHandler = require('./../handler/history.handler');
const { StatusCodes } = require("http-status-codes");
module.exports = (router, repository) => {
  const { findHistory } = historyHandler(repository);
  router.get('/findHistory/:rut', async (req, res) => {
    const history = await findHistory(req.params);
    if (history && Array.isArray(history)) res.status(StatusCodes.OK).json(history);
    else res.status(StatusCodes.NOT_FOUND).json(history);
  });
  return router;
}