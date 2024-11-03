
const mongoose = require('mongoose')
const equationSchema = new mongoose.Schema({
  methodType: { type: String, required: true },
  points: { type: Array, required: true },
  xTarget: { type: Number, required: true },
  answer: { type: Number, required: true },
  n: { type: Number, required: true},
  chart: { type: Array,  },

}, { collection: 'Interpolation' });
const InterpolationApi = mongoose.model('Interpolation', equationSchema);
module.exports = InterpolationApi;





