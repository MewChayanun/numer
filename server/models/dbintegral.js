
const mongoose = require('mongoose')
const equationSchema = new mongoose.Schema({
  methodType: { type: String, required: true },
  equation: { type: String, required: true },
  a: { type: Number, required: true },
  b: { type: Number, required: true },
  n: { type: Number, required: true},
  answer1: { type: Number, required: true },
  answer2: { type: Number, required: true },
  err: { type: Number, required: true },

}, { collection: 'integral' });
const IntegralApi = mongoose.model('integral', equationSchema);
module.exports = IntegralApi;





