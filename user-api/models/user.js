const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = require("./product");

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    },
    products: ProductSchema,
    stripeId: String,
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