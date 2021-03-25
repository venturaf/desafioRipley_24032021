module.exports = (Schema) => {
    return {
        historySchema: new Schema({
            date: { type: Date,  required: true, index: true, },
            rut: { type: String, required: true, },
            action: { type: String, required: true, },
            balance: { type: String, required: true, },
            to: { type: String, required: true, },
        })
    }
};