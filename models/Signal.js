const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const signalSchema = new Schema({
    id_sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    pseudo: {
        type: String,
        ref: "User"
    },
    object: {
        type: String,
        min: 2,
        required: true
    },
    text: {
        type: String,
        min: 2,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const SignalModel = mongoose.model("Signal", signalSchema);

module.exports = SignalModel;