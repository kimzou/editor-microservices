const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    roles: {
        type: String,
        enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    },
});

module.exports = mongoose.model('User', UserSchema);