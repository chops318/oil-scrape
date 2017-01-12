'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');

const ReportSchema = mongoose.Schema({
  reportDate: { type: Date },
  luwCode: { type: String},
  serialNumber: { type: String},
  productionType: { type: String},
  wellCount: { type: String },
  openingStock: { type: String },
  oilProduction: { type: String },
  gasProduction: { type: String },
  dispositon: { type: String },
  closingStock: { type: String },
  oilWell: { type: mongoose.Schema.Types.ObjectId, ref: 'Well'},
  parish: { type: String}
});

module.exports = mongoose.model('Report', ReportSchema);
