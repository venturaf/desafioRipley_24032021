const userHandler = require('./../handler/user.handler');
const { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("http-status-codes");
module.exports = (router, repository) => {
  const { saveUser, login } = userHandler(repository);
  router.post('/', async (req, res) => {
    if (await saveUser(req.body)) res.status(OK).json("User Created successfull")
    else res.status(INTERNAL_SERVER_ERROR).json("An error ocurre while creating a user")
  });
  router.post('/login', async (req, res) => {
    const user = await login(req.body);
    if (user && user._id) res.status(OK).json(user);
    else res.status(NOT_FOUND).json(user);
  });
  return router;
};