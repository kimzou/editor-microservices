const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: { type: String, required: true },
    verifiedAccount: { type: Boolean, default: false },
    emailConfirmToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    roles: {
        type: String,
        enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    },
    google: {
        id: String,
        lastName: String,
        firstName: String,
        token: String,
    },
    facebook: {
        id: String,
        lastName: String,
        firstName: String,
        token: String,
    },
    linkedin: {
        id: String,
        lastName: String,
        firstName: String,
        token: String,
    },
    twitter: {
        id: String,
        lastName: String,
        firstName: String,
        token: String,
    }
});

module.exports = mongoose.model('User', UserSchema);