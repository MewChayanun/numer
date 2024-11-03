
const mongoose = require('mongoose')
const equationSchema = new mongoose.Schema({
  methodType: { type: String, required: true },
  equation: { type: Array, required: true },
  size: { type: Number, required: true },
  answer: { type: Array, required: true },
  err: { type: Number,  },
  table:{type: Array},

}, { collection: 'gauss' });
const GaussApi = mongoose.model('gauss', equationSchema);
module.exports = GaussApi;





