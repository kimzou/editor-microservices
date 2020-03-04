const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    },
});

module.exports = mongoose.model('User', UserSchema);