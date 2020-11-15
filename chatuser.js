let mongoose = require('./mongoose');
let schemaChatUser = new mongoose.Schema({
    firstname: { type: String, required: true, unique: false },
    lastname: { type: String, required: true, unique: false },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    age: {
        type: Number,
        required: true,
        unique: false,
        min: 18,
        max: 70
    },
});
let ChatUser = mongoose.model("ChatUser", schemaChatUser);
module.exports = ChatUser;