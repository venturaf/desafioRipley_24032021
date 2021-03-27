const { HISTORY_COLLECTION } = process.env;
module.exports = (repository) => {
    const { HistoryRepository, model } = repository;
    const History = model(HISTORY_COLLECTION, HistoryRepository.historySchema);
    return {
        findHistory: async ({ rut }) => {
            return await History.find({ rut }).exec()
                .then((r) => r)
                .catch((e) => console.log(e));
        },
    };
};