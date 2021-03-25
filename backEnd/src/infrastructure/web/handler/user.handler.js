const { USER_COLLECTION } = process.env;
const { BALANCE_COLLECTION } = process.env;
const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const balanceHandler = require('./balance.handler');

module.exports = (repository) => {

    const { UserRepository } = repository;
    const User = UserRepository.model(USER_COLLECTION, UserRepository.userSchema);
    const { BalanceRepository } = repository;
    const Balance = BalanceRepository.model(BALANCE_COLLECTION, BalanceRepository.balanceSchema);
    const { balanceCero } = balanceHandler(repository);
    

    return {
        saveUser: async (req, res) => {
            const { name, password, rut, email } = req.body;
            const user = new User({ name, password, rut, email });
            const balance = new Balance({ balance: 0, rut });
            await balance.save();

            await user.save()
            .then((r) => res.status(OK).json(r))
            .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));

        },
        login: async (req, res) => {
            const { password, rut } = req.body;

            await User.findOne({ password, rut }).exec()
                .then((r) => res.status(OK).json(r))
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e))

        },
    };
};