const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
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