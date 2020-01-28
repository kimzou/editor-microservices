const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mimoSchema = new Schema({
  title: String,
  description: String
});

const Mimo = mongoose.model('Mimo', mimoSchema, 'mimo'); 

module.exports = Mimo;