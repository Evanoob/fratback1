const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actuSchema = new Schema({
    subject: {
        type: String,
    },
    message: {
        type: String,
    },
    date: { type: Date, default: Date.now }
});

const ActuModel = mongoose.model("Actu", actuSchema);
module.exports = ActuModel;