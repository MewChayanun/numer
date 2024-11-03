
const mongoose = require('mongoose')
const equationSchema = new mongoose.Schema({
  methodType: { type: String, required: true },
  result: { type: Number, required: true },
  regressionEquation: { type: String, required: true },
  points: { type: Array, required: true },
  plotData: { type: Array, required: true},
  X1target: { type: Number, required: true },
  X2target: { type: Number, required: true },

}, { collection: 'Regression' });
const RegressionApi = mongoose.model('Regression', equationSchema);
module.exports = RegressionApi;





