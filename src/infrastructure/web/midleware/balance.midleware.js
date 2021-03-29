const { INTERNAL_SERVER_ERROR } = require("http-status-codes");

const validBalance = (req, res, next) => {
    const { balance } = req.body;

    if (!balance || isNaN(balance) || balance == undefined) return res.status(OK).send("Monto no ingresado");

    next();

}

module.exports = {
    validBalance
}