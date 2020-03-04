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
    googleID: String,
    facebookID: String,
});

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);