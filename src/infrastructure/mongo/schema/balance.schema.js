
module.exports = (Schema) => {
    return {
        balanceSchema: new Schema({
            rut: { type: String, required: true, unique: true, },
            balance: { type: Number, required: true,},
        })
    }
};