const { BALANCE_COLLECTION, HISTORY_COLLECTION } = process.env;
const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

module.exports = (repository) => {
    const { BalanceRepository, HistoryRepository } = repository;
    const Balance = BalanceRepository.model(BALANCE_COLLECTION, BalanceRepository.balanceSchema);
    const History = HistoryRepository.model(HISTORY_COLLECTION, HistoryRepository.historySchema);

    const findCurrentBalance = async (rut) => await Balance.findOne({ rut }).exec();

    return {

        currentBalance: async (req, res) => {
            const { rut } = req.params;
            await findCurrentBalance(rut)
                .then((r) => res.status(OK).json(r))
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
        },

        depositBalance: async (req, res) => {
            const { balance, rut } = req.body;
            let currentBalance = await findCurrentBalance(rut);
            currentBalance.balance = currentBalance.balance + parseInt(balance);
            Balance.update({ _id: currentBalance._id }, currentBalance, { upsert: true, setDefaultsOnInsert: true })
                .then((r) => {
                    const history = new History({ date:Date(), rut: rut, balance: balance, to: rut, action: "deposit"});
                    history.save()
                    res.status(OK).json("Balance have been deposited successfull")
                })
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
        },

        withdrawBalance: async (req, res) => {
            const { balance, rut } = req.body;
            let currentBalance = await findCurrentBalance(rut);
            if (currentBalance.balance < balance) {
                res.status(OK).json("Insufficient balance ");
            } else {
                currentBalance.balance = currentBalance.balance - parseInt(balance);
            }
            Balance.update({ _id: currentBalance._id }, currentBalance, { upsert: true, setDefaultsOnInsert: true })
                .then((r) => {
                    const history = new History({ date:Date(), rut: rut, balance: balance, to: rut, action: "withdraw"});
                    history.save()
                    res.status(OK).json(`Balance have been withdraw successfull`)
                })
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
        },

        transferBalance: async (req, res) => {
            const { balance, rut, account } = req.body;
            if(!await findCurrentBalance(account)){
                res.status(OK).json("Account to transfer does not exist");
            }else{
                let currentBalance = await findCurrentBalance(rut);
                let accountBalance = await findCurrentBalance(account);
                if (currentBalance.balance < balance) {
                    res.status(OK).json("Insufficient balance ");
                } else {
                    currentBalance.balance = currentBalance.balance - parseInt(balance);
                    accountBalance.balance = accountBalance.balance + parseInt(balance);
                }
                Balance.update({ _id: currentBalance._id }, currentBalance, { upsert: true, setDefaultsOnInsert: true })
                    .then((r) => {
                        const history = new History({ date:Date(), rut: rut, balance: balance, to: accountBalance.rut, action: "transferOut"});
                        history.save()
                        Balance.update({ _id: accountBalance._id }, accountBalance, { upsert: true, setDefaultsOnInsert: true })
                        .then((r) => {
                            const history = new History({ date:Date(), rut: accountBalance.rut, balance: balance, to: rut, action: "transferIn"});
                            history.save()
                            res.status(OK).json(`Balance have been transfer successfull`)})
                        .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
                    })
                    .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
            }
        },

    };
};
