const mongoose = require('mongoose')
const equationSchema = new mongoose.Schema({
  methodType: { type: String, required: true },
  equation: { type: String, required: true },
  x: { type: Number, required: true },
  h: { type: Number, required: true },
  degree: { type: Number, required: true},
  answer1: { type: Number, required: true },
  answer2: { type: Number, required: true },
  err: { type: Number, required: true },

}, { collection: 'differential' });
const DiffApi = mongoose.model('differential', equationSchema);
module.exports = DiffApi;


