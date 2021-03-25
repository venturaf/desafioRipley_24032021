const userHandler = require('./../handler/user.handler');

module.exports = (router, repository) => {
  const { saveUser, login } = userHandler(repository);

  router.post('/save', saveUser);
  router.post('/login', login);

  return router;
}