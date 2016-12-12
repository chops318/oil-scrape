'use strict';
const express = require('express');
const router = express.Router();
const Well = require('../models/oilWell');
const createError = require('http-errors');
const xl = require('excel4node');
const excelWriter = require('../lib/excelWrite');

router.get('/', (req, res, next) => {
  Well.find()
  .select('-productionReports')
  .then((wells) => {
    debugger;
    excelWriter.generateWorkbook(wells)
    .then(wb => {
      wb.write('Excel.xlsx', (err, stats) => {
        console.log('Excel.xlsx has written');
        res.download('Excel.xlsx', 'oilWells.xlsx')
      })
    })
  })
  .catch(err => console.log(err))
})

router.get('/parish/:parish', (req, res, next) => {
  Well.find({
    parish: req.params.parish,
    serial: { $gt: 150000}
  })
  .populate('productionReports')
  .then(wells => res.json(wells))
})

router.get('/well/:serial', (req, res, next) => {
  Well.find({
    _id: req.params.serial
  })
  .populate('productionReports')
  .then(well => res.json(well))
})

router.get('/test', (req, res, next) => {
  Well.find()
  .then(wells => {
    res.send(wells.length)
  })
})

module.exports = exports = router;
