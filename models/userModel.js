const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    jwt: String,
    resetTokenForPassword: {
        type: String,
        default: ""
    },
    resetTokenTime: {
        type: Date,
        default: ""
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User