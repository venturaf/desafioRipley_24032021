const { USER_COLLECTION, BALANCE_COLLECTION } = process.env;
module.exports = (repository) => {
    const { UserRepository, BalanceRepository, model } = repository;
    const User = model(USER_COLLECTION, UserRepository.userSchema);
    const Balance = model(BALANCE_COLLECTION, BalanceRepository.balanceSchema);
    const createCount = async (rut) => {
        const balance = new Balance({ balance: 0, rut });
        return await balance.save().then(async (r) => true)
            .catch((e) => { console.log(e); return false });
    }
    return {
        saveUser: async ({ name, password, rut, email }) => {
            const user = new User({ name, password, rut, email });
            return await user.save()
                .then(async (r) => createCount(rut))
                .catch((e) => { console.log(e); return false })
        },
        login: async ({ password, rut }) => {
            return await User.findOne({ password, rut }).exec()
                .then((r) =>r)
                .catch((e) => { console.log(e); return false });
        },
    };
};