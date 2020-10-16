const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    pseudo: {
        type: String,
        min: 2,
        required: true,

    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        min: 6,
        required: true,
    },
    zipCode: {
        type: String,
        min: 6,
        required: true,
    },
    investment: {
        type: String,
        enum: ["Ordinaire", "Empathique", "Bienfaiteur", "Protecteur", "Ange Gardien"],
        default: "Ordinaire",
    },
    role: {
        type: String,
        enum: ["admin", "moderator", "user"],
        default: "user",
    }
});

// userSchema.plugin(uniqueValidator);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;