'use strict';
const mongoose = require('mongoose');
const Report = require('./report');

let WellSchema = mongoose.Schema({
  wellNum: {type: String},
  wellName: {type: String},
  serial: {type: Number},
  orgId: {type: String},
  productionType: {type: String},
  effectiveDate: {type: String},
  measuredDepth: {type: String},
  endDate: {type: String},
  apiNum: {type: Number},
  permitDate: {type: String},
  secTwnRge: {type: String},
  field: {type: String},
  parish: {type: String},
  status: {type: String},
  upperPerf: {type: String},
  lowerPerf: {type: String},
  sands: {type: String},
  fieldName: { type: String},
  loc: { lng: Number, lat: Number}, //Long/Lat
  productionReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report'}]
});
WellSchema.index({loc:  '2dsphere'});

WellSchema.methods.addReports = function(productionData) {
  return Report.insertMany(productionData)
}

module.exports = exports = mongoose.model('Well', WellSchema);
