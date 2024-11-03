
const mongoose = require('mongoose')
const equationSchema = new mongoose.Schema({
  methodType: { type: String, required: true },
  equation: { type: String, required: true },
  xl: { type: Number, required: true },
  xr: { type: Number, required: true },
  table: { type: Array, required: true },
  epsilon: { type: Number, required: true },
  answer: { type: Number, required: true },

}, { collection: 'eqRoot1' });
const EqRoot1 = mongoose.model('eqRoot1', equationSchema);
module.exports = EqRoot1;





