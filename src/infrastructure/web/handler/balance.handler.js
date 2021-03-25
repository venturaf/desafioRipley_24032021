const { BALANCE_COLLECTION } = process.env;
const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");
const historyHandler = require('./../handler/history.handler');

module.exports = (repository) => {
    const { saveHistory } = historyHandler(repository);
    const { BalanceRepository } = repository;
    const Balance = BalanceRepository.model(BALANCE_COLLECTION, BalanceRepository.balanceSchema);

    const balanceCero = async (rut) => await Balance.save({ balance: 0, rut }).exec();
    const findCurrentBalance = async (rut) => await Balance.findOne({ rut }).exec();
    const discount = async (balance, currentBalance) => {
        return currentBalance.balance < balance ? res.status(OK).json("Insufficient balance ") : currentBalance.balance = currentBalance.balance - parseInt(balance);
    }

    return {

        

        currentBalance: async (req, res) => {
            const { rut } = req.body;
            await findCurrentBalance(rut)
                .then((r) => res.status(OK).json(r))
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
        },

        depositBalance: async (req, res) => {

            const { balance, rut } = req.body;

            let currentBalance = await findCurrentBalance(rut);

            if (!currentBalance || currentBalance == undefined) {
                currentBalance = balanceCero(rut );
            } else {
                currentBalance.balance = currentBalance.balance + parseInt(balance);
            }

            Balance.update({ _id: currentBalance._id }, currentBalance, { upsert: true, setDefaultsOnInsert: true })
                .then((r) => {
                    saveHistory(req = { rut: rut, balance: balance, to: rut, action: "deposit"})
                    res.status(OK).json("Balance have been deposited successfull")
                })
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));

        },

        withdrawBalance: async (req, res) => {
            const { balance, rut } = req.body;
            let currentBalance = await findCurrentBalance(rut);
            currentBalance.balance = discount(balance, currentBalance.balance)
            Balance.update({ _id: currentBalance._id }, currentBalance, { upsert: true, setDefaultsOnInsert: true })
                .then((r) => {
                    saveHistory(req = { rut: rut, balance: balance, to: rut, action: "deposit"})
                    res.status(OK).json(`Balance have been withdraw successfull`)})
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
            // let currentBalance = await findCurrentBalance(rut);

            // if (currentBalance.balance < balance) {
            //     res.status(OK).json("Insufficient balance ");
            // } else {
            //     currentBalance.balance = currentBalance.balance - parseInt(balance);
            // }

            // Balance.update({ _id: currentBalance._id }, currentBalance, { upsert: true, setDefaultsOnInsert: true })
            //     .then((r) => res.status(OK).json(`Balance have been withdraw successfull`))
            //     .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
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
                        saveHistory(req = { rut: rut, balance: balance, to: accountBalance.rut, action: "transferOut"})
                        Balance.update({ _id: accountBalance._id }, accountBalance, { upsert: true, setDefaultsOnInsert: true })
                        .then((r) => {
                            saveHistory(req = { rut: accountBalance.rut, balance: balance, to: rut, action: "transferIn"})
                            res.status(OK).json(`Balance have been transfer successfull`)})
                        .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
                    })
                    .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
            }
        },

    };
};
