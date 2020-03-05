const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
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

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);