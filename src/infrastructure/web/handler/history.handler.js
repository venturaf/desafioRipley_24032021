const { HISTORY_COLLECTION } = process.env;
const { OK, INTERNAL_SERVER_ERROR } = require("http-status-codes");

module.exports = (repository) => {

    const { HistoryRepository } = repository;
    const History = HistoryRepository.model(HISTORY_COLLECTION, HistoryRepository.historySchema);
    return {
        saveHistory: async (req, res) => {
            if (req.body) req = req.body; 

            const { rut, action, balance, to } = req;
            let now= new Date();
            const history = new History({ date: Date(), rut, action, balance, to });
            await history.save()
            .then((r) => res.status(OK).json(r))
            .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e));
        },
        findHistory: async (req, res) => {
            const { rut } = req.body;
            await History.find({ rut }).exec()
                .then((r) => res.status(OK).json(r))
                .catch((e) => res.status(INTERNAL_SERVER_ERROR).send(e))

        },
    };
};