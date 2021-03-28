const { BALANCE_COLLECTION, HISTORY_COLLECTION } = process.env;
const DEPOSIT = "deposit";
const WITHDRAW = "withdraw";
const INSUFFICENT_BALANCE = "Insufficient balance ";
const COUNT_NOT_EXISTS = "Account to transfer does not exist";
const TRASNFER_OUT = "transferOut";
const TRANSFER_IN = "transferIn";
module.exports = (repository) => {
    const { BalanceRepository, model, HistoryRepository } = repository;
    const Balance = model(BALANCE_COLLECTION, BalanceRepository.balanceSchema);
    const History = model(HISTORY_COLLECTION, HistoryRepository.historySchema);
    const findCurrentBalance = async (rut) => await Balance.findOne({ rut }).exec();
    const saveHistory = async (itemAdit) => {
        const { from, action, balance, to } = itemAdit;
        const history = new History({ createdAt: Date(), rut: from, action, balance, to, date: Date() });
        return await history.save()
            .then((r) => true)
            .catch((e) => { console.log(e); return false });
    };
    return {
        currentBalance: async ({ rut }) => {
            return await findCurrentBalance(rut)
                .then((r) => r)
                .catch((e) => e);
        },
        depositBalance: async ({ balance, rut }) => {
            let currentBalance = await findCurrentBalance(rut);
            currentBalance.balance = currentBalance.balance + parseInt(balance);
            return await Balance.updateOne({ _id: currentBalance._id }, currentBalance)
                .then(async (r) => await saveHistory({ from: rut, balance, to: rut, action: DEPOSIT }))
                .catch((e) => { console.log(e); return false; });
        },
        withdrawBalance: async ({ balance, rut }) => {
            let currentBalance = await findCurrentBalance(rut);
            if (currentBalance.balance <= 0 || currentBalance.balance < balance) {
                return INSUFFICENT_BALANCE;
            }
            currentBalance.balance = currentBalance.balance - parseInt(balance);
            return await Balance.updateOne({ _id: currentBalance._id }, currentBalance)
                .then(async (r) => await saveHistory({ from: rut, balance, to: rut, action: WITHDRAW }))
                .catch((e) => { console.log(e); return false; });
        },
        transferBalance: async ({ rut, balance, account }) => {
            let currentBalance = await findCurrentBalance(rut);
            let accountBalance = await findCurrentBalance(account);
            if (!accountBalance) {
                return COUNT_NOT_EXISTS;
            }
            if (currentBalance.balance <= 0 || currentBalance.balance < balance) {
                return INSUFFICENT_BALANCE;
            }
            currentBalance.balance = currentBalance.balance - parseInt(balance);
            let transferOperation = await Balance.updateOne({ _id: currentBalance._id }, currentBalance)
                .then(async (r) => {
                    return await saveHistory({ from: rut, balance, to: account, action: TRASNFER_OUT })
                })
                .catch((e) => { console.log(e); return false; });
            accountBalance.balance = accountBalance.balance + parseInt(balance);
            transferOperation = await Balance.updateOne({ _id: accountBalance._id }, accountBalance)
                .then(async (r) => {
                    return await saveHistory({ from: rut, balance, to: account, action: TRANSFER_IN })
                })
                .catch((e) => { console.log(e); return false; });
            return transferOperation;
        },
    }
};