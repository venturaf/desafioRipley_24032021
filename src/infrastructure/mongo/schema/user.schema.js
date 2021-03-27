module.exports = (Schema) => {
    return {
        userSchema: new Schema({
            rut: { type: String, required: true, unique: true, index: true, },
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true, index: true, },
            password: { type: String, required: true },
        })
    }
};