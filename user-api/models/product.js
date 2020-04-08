const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    mimoId: {
        type: String,
        required: true
    },
    price: Number
});

module.exports = [ProductSchema, mongoose.model('Product', ProductSchema)];