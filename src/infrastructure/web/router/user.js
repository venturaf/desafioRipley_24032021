const userHandler = require('./../handler/user.handler');
const { OK } = require("http-status-codes");

const COUNT_SUCCESS = "La cuenta a sido creada con exito";

module.exports = (router, repository) => {
  const { saveUser, login } = userHandler(repository);
  router.post('/', async (req, res) => {
    if (await saveUser(req.body)) res.status(OK).json(COUNT_SUCCESS)
    else res.status(OK).json("Parece que ya estas registrado")
  });
  router.post('/login', async (req, res) => {
    const user = await login(req.body);
    if (user && user._id) res.status(OK).json(user);
    else res.status(OK).json("Datos incorrectos");
  });
  return router;
};