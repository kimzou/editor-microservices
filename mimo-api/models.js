const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mimoSchema = new Schema({
  title: String,
  description: String
});

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  mimos: [{
    type: Schema.Types.ObjectId,
    ref: "mimo"
  }]
});

const Mimo = mongoose.model('Mimo', mimoSchema, 'mimo'); 
const Course = mongoose.model("Course", courseSchema, 'course');

module.exports = { Mimo, Course };