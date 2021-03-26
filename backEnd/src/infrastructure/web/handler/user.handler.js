const { BALANCE_COLLECTION, USER_COLLECTION } = process.env;
const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

module.exports = (repository) => {

    const { UserRepository, BalanceRepository } = repository;
    const User = UserRepository.model(USER_COLLECTION, UserRepository.userSchema);
    const Balance = BalanceRepository.model(BALANCE_COLLECTION, BalanceRepository.balanceSchema);
    
    return {
        saveUser: async (req, res) => {
            const { name, password, rut, email } = req.body;
            const user = new User({ name, password, rut, email });
            await user.save()
            .then((r) => {
                Balance.save({ balance: 0, rut })
                res.status(OK).json(r)})
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