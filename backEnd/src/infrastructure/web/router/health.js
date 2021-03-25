const { OK } = require("http-status-codes");

module.exports = (router) => {

    router.get('/', function(req, res) {
      res.status(OK).json("I'M UP AND RUNING")
    });

    return router;
}