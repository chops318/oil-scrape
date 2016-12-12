'use strict';

// Node modules
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio')
// Data
const Well = require('../model/oilWell');


// Events
const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter();


ee.on('scrape', (parish, number) => {
  let oilWells = JSON.parse(fs.readFileSync(`./lib/wells/${parish}.json`));
  let i = number
  let options = {
    'url': `http://192.241.222.60:8080/${parish}/${parish}-${i}.html`,
  };
  request(options, (err, response, html) => {
    let $ = cheerio.load(html);
    let wellObj = new Well();
    $('table').eq(3).addClass('coordinates');
    $('table').eq(10).addClass('production');
    $('table').eq(4).addClass('bottom');
    $('table').eq(7).addClass('perforations')
    let gasProduction = $('.production td').eq(7).text();
    let oilProduction = $('.production td').eq(6).text();
    let openingStock = $('.production td').eq(5).text();
    let closingStock = $('.production td').eq(9).text();
    let wellCount = $('.production td').eq(4).text();
    let reportDate = $('.production td').eq(0).text();
    let long = parseFloat($('.coordinates td').eq(2).text());
    let lat = parseFloat($('.coordinates td').eq(3).text());
    if (isNaN(long) === false || isNaN(lat) === false) {
      wellObj.loc.lat = lat;
      wellObj.loc.lng = long;
    }
    wellObj.wellNum = $('table td').eq(2).text();
    wellObj.wellName = $('table td').eq(1).text();
    wellObj.serial = $('table td').eq(0).text();
    wellObj.secTwnRge = $('table td').eq(7).text() + '-' + $('table td').eq(8).text() + '-' + $('table td').eq(9).text();
    wellObj.field = $('table td').eq(4).text();
    wellObj.parish = $('table td').eq(5).text();
    wellObj.status = $('table td').eq(15).text();
    wellObj.apiNum = $('table td').eq(11).text();

    wellObj.effectiveDate = $('.bottom td').eq(0).text();
    wellObj.endDate = $('.bottom td').eq(1).text();
    wellObj.measuredDepth = $('.bottom td').eq(4).text();
    wellObj.upperPerf = $('.perforations td').eq(2).text();
    wellObj.lowerPerf = $('.perforations td').eq(3).text();
    wellObj.sands = $('.perforations td').eq(4).text();
    wellObj.parish = `${parish}`;
    wellObj.orgId = $('table td').eq(3).text();
    wellObj.fieldName = oilWells[i].field;
    debugger;
    wellObj.save( function(err) {
      if (err) console.log(err);
    })
    if (i <= oilWells.length) {
      setTimeout(() => {
        console.log(i)
        ee.emit('scrape', parish, ++i)
      }, 500)
    }
  })
})

ee.on('production', (parish, number) => {
  let oilWells = JSON.parse(fs.readFileSync(`./lib/wells/${parish}.json`));
  let i = number
  let options = {
    'url': `http://192.241.222.60:8080/${parish}/${parish}-${i}.html`,
  };
  request(options, (err, response, html) => {
    let $ = cheerio.load(html);
    let wellSerial = $('table td').eq(0).text();
    Well.findOne({
      serial: wellSerial
    })
    .then(well => {
      debugger;
      $('table').eq(10).addClass('production');
      let production = $('.production tr td');
      let productionObject = {};
      let productionArray = [];
      let j = 0;
      let more = true;
      do {
        if (production.eq(j).text() !== '') {
          productionObject.reportDate = production.eq(j).text();
          productionObject.luwCode = production.eq(j+1).text();
          productionObject.wellCount = production.eq(j+4).text();
          productionObject.openingStock = production.eq(j+5).text();
          productionObject.oilProduction = production.eq(j+6).text();
          productionObject.gasProduction = production.eq(j+7).text();
          productionObject.dispositon = production.eq(j+8).text();
          productionObject.closingStock = production.eq(j+9).text();
          productionObject.oilWell = well._id;
          productionObject.parish = well.parish;
          productionArray.push(productionObject);
          productionObject = {};
          j += 11;
        } else if (production.eq(j).text() === '') {
          return well.addReports(productionArray)
          .then(reports => {
            let productionId = reports.map((id) => {
              return id._id.toString();
            })
            let id = reports[0].oilWell.toString();
            debugger;
            console.log(reports[0].oilWell)
            Well.update({
              _id: id
            }, {
              $push: { productionReports: { $each: reports}}
            })
            .then(() => {

            })
          })
          .catch(err => {
            debugger;
          })
        }
      } while (more === true);
    })
  })
  if (number < oilWells.length) {
    setTimeout(() => {
      console.log(i)
      ee.emit('production', parish, ++number)
    }, 750)
  }
});


module.exports = ee;
