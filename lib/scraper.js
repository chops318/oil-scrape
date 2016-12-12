'use strict';
const cheerio = require('cheerio');
const request = require('request');
const fs      = require('fs');
const Well = require('../models/oilWell');
const ip = require('./proxy.js');
const Agent = require('socks5-http-client/lib/Agent');
const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter();


// wellname/no orgid, well serial no, well status no, permit date, sec-town,rng, field, field name, parish, permit data, upper perfs, lower perfs, sand
const scraper = {};

let randomUserAgentString = function() {
  return Math.round((Math.random() * 5) * 1);
};

let randomProxy = function() {
  return Math.round((Math.random() * 59) * 1);
};


let userAgentString = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.8 (KHTML, like Gecko) Version/9.1.3 Safari/601.7.8',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
];

scraper.slowScrape = (req) => {
  let parish = req.params.parish;
  let oilWells = fs.readFileSync('claiborne.json');
  oilWells = JSON.parse(oilWells);
  var i = 3963;
  let options = {
    'url': 'http://sonlite.dnr.state.la.us/sundown/cart_prod/cart_con_wellinfo2?p_wsn=' + oilWells[i].serial,
    'headers': {
      'User-Agent': userAgentString[randomUserAgentString()]
    },
    agentClass: Agent,
    agentOptions: {
      socksHost: 'localhost',
      socksPort: 9050
    }
  };
  let slowLoop = () => {
    setTimeout(function() {
      request(options, (err, response, html) => {
        let $ = cheerio.load(html);
        let wellObj = new Well();
        $('table').eq(3).addClass('coordinates');
        $('table').eq(10).addClass('production');
        let gasProduction = $('.production td').eq(7).text();
        let oilProduction = $('.production td').eq(6).text();
        let openingStock = $('.production td').eq(5).text();
        let closingStock = $('.production td').eq(9).text();
        let wellCount = $('.production td').eq(4).text();
        let reportDate = $('.production td').eq(0).text();
        let long = parseFloat($('.coordinates td').eq(2).text());
        let lat = parseFloat($('.coordinates td').eq(3).text());
        if (isNaN(long) === false || isNaN(lat) === false ) {
          wellObj.loc.lat = lat;
          wellObj.loc.lng = long;
        }
        wellObj.production.push({
          reportDate: reportDate,
          gasProduction: gasProduction,
          oilProduction: oilProduction,
          openingStock: openingStock,
          closingStock, closingStock,
          wellCount, wellCount
        })
        debugger;
        wellObj.wellNum = $('table td').eq(2).text();
        wellObj.wellName = $('table td').eq(1).text();
        wellObj.serial = $('table td').eq(0).text();
        wellObj.secTwnRge = $('table td').eq(7).text() + $('table td').eq(8).text() + $('table td').eq(9).text();
        wellObj.field = $('table td').eq(4).text();
        wellObj.parish = $('table td').eq(5).text();
        wellObj.status = $('table td').eq(14).text();
        $('b:contains("PERFORATIONS")').next('table').addClass('test');
        wellObj.upperPerf = $('.test td').eq(2).text();
        wellObj.lowerPerf = $('.test td').eq(3).text();
        wellObj.sands  = $('.test td').eq(4).text();
        wellObj.parish = 'Claiborne';
        wellObj.fieldName = oilWells[i].field;
        i++;
        wellObj.save((err) => {
          if (err) console.log(err);
        });
        if (i < oilWells.length && (response.statusCode > 199 && response.statusCode < 299)) {
          console.log(oilWells[i]);
          console.log(i);
          slowLoop();
        }
      });

    }, 60000);
  };
  if (i === 3963) slowLoop();
};
scraper.getWells = (req, res) => {
  request('http://localhost:8080/ouachita.html', (err, response, html) => {
    let $ = cheerio.load(html);
    let wellNumArray = [];
    let num = 0;
    for (let i = 3; i < 60000; i += 11) {
      if ($('table td').eq(i).text() === '30' || $('table td').eq(i).text() === '10') {
        wellNumArray.push({serial: $('table td').eq(i+1).text(), field: $('table td').eq(i+8).text()});
        console.log(num++);
      }
    }
    fs.writeFile('ouachita.json', JSON.stringify(wellNumArray, null, 2), (err) => {
      if (err) {
        throw err;
      }
      console.log('done');
    });
  });
};

scraper.slowScrapeTest = () => {
  let options = {
    url: 'http://localhost:8000',
    headers: {
      'User-Agent': userAgentString[randomUserAgentString()]
    },
    proxy: ip[randomProxy()]
  };
  request(options, function(err, response, html) {
    console.log(response);
  });
};

scraper.slowWrite = (req) => {
  let oilWells = JSON.parse(fs.readFileSync(`${req.params.parish}.json`));
  let parish = req.params.parish;
  let wellNumber = req.params.wellNum;
  debugger;
  let slowLoop = (wellNumber) => {
    setTimeout(function() {
      let options = {
        'url': 'http://sonlite.dnr.state.la.us/sundown/cart_prod/cart_con_wellinfo2?p_wsn=' + oilWells[wellNumber].serial,
        'headers': {
          'User-Agent': userAgentString[randomUserAgentString()]
        },
        agentClass: Agent,
        agentOptions: {
          socksHost: 'localhost',
          socksPort: 9050
        }
      };
      request(options, (err, response, html) => {
        if (err) slowLoop(++wellNumber);
        let $ = cheerio.load(html);
        debugger;
        fs.writeFile(`./wells/${parish}/${parish}-${wellNumber}.html`, html, (err) => {
          if (!err) {
            if(wellNumber < oilWells.length) {
              console.log(oilWells[wellNumber]);
              console.log(wellNumber);
              slowLoop(++wellNumber);
            }
          }
        });
      });
    }, 60000);
  };
  slowLoop(wellNumber);
};

scraper.fastScrape = (req, cb) => {
  let parish = req.params.parish
  let oilWells = JSON.parse(fs.readFileSync(`${parish}.json`));
  console.log(oilWells.length);
   var i = req.params.wellNum;
   ee.on('scrape', () => {
     let options = {
       'url': `http://104.131.148.203:8080/${parish}/${parish}-${i}.html`,
       'headers': {
         'User-Agent': userAgentString[randomUserAgentString()]
       }
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
       debugger;
       if (isNaN(long) === false || isNaN(lat) === false ) {
         wellObj.loc.lat = lat;
         wellObj.loc.lng = long;
       }
       wellObj.wellNum = $('table td').eq(2).text();
       wellObj.wellName = $('table td').eq(1).text();
       wellObj.serial = $('table td').eq(0).text();
       wellObj.secTwnRge = $('table td').eq(7).text() + '-' +  $('table td').eq(8).text() + '-' +  $('table td').eq(9).text();
       wellObj.field = $('table td').eq(4).text();
       wellObj.parish = $('table td').eq(5).text();
       wellObj.status = $('table td').eq(15).text();

       wellObj.effectiveDate = $('.bottom td').eq(0).text();
       wellObj.endDate = $('.bottom td').eq(1).text();
       wellObj.measuredDepth = $('.bottom td').eq(4).text();
       wellObj.upperPerf = $('.perforations td').eq(2).text();
       wellObj.lowerPerf = $('.perforations td').eq(3).text();
       wellObj.sands  = $('.perforations td').eq(4).text();
       wellObj.parish = `${parish}`;
       wellObj.orgId = $('table td').eq(3).text();
       wellObj.fieldName = oilWells[i].field;
       debugger;
     })
   })

  let slowLoop = () => {
    setTimeout(function() {
      let options = {
        'url': `http://104.131.148.203:8080/${parish}/${parish}-${i}.html`,
        'headers': {
          'User-Agent': userAgentString[randomUserAgentString()]
        }
      };
      console.log(options.url);
      request(options, (err, response, html) => {
        let $ = cheerio.load(html);
        let wellObj = new Well();
        $('table').eq(3).addClass('coordinates');
        $('table').eq(10).addClass('production');
        $('table').eq(4).addClass('bottom')
        let gasProduction = $('.production td').eq(7).text();
        let oilProduction = $('.production td').eq(6).text();
        let openingStock = $('.production td').eq(5).text();
        let closingStock = $('.production td').eq(9).text();
        let wellCount = $('.production td').eq(4).text();
        let reportDate = $('.production td').eq(0).text();
        let long = parseFloat($('.coordinates td').eq(2).text());
        let lat = parseFloat($('.coordinates td').eq(3).text());
        debugger;
        if (isNaN(long) === false || isNaN(lat) === false ) {
          wellObj.loc.lat = lat;
          wellObj.loc.lng = long;
        }
        debugger;
        wellObj.wellNum = $('table td').eq(2).text();
        wellObj.wellName = $('table td').eq(1).text();
        wellObj.serial = $('table td').eq(0).text();
        wellObj.secTwnRge = $('table td').eq(7).text() + '-' +  $('table td').eq(8).text() + '-' +  $('table td').eq(9).text();
        wellObj.field = $('table td').eq(4).text();
        wellObj.parish = $('table td').eq(5).text();
        wellObj.status = $('table td').eq(15).text();

        wellObj.effectiveDate = $('.bottom td').eq(0).text();
        wellObj.endDate = $('.bottom td').eq(1).text();
        wellObj.measuredDepth = $('.bottom td').eq(4).text();
        $('b:contains("PERFORATIONS")').next('table').addClass('perforation');
        wellObj.upperPerf = $('.perforation td').eq(2).text();
        wellObj.lowerPerf = $('.perforation td').eq(3).text();
        wellObj.sands  = $('.perforation td').eq(4).text();
        wellObj.parish = `${parish}`;
        wellObj.orgId = $('table td').eq(3).text();
        wellObj.fieldName = oilWells[i].field;
        i++;
        wellObj.save((err) => {
          if (err) console.log(err);
        });
        if (i < oilWells.length && (response.statusCode > 199 && response.statusCode < 299)) {
          console.log(oilWells[i]);
          console.log(i);
          slowLoop();
        }
        cb();
      });

    }, 1500);
  };
   slowLoop();
};

module.exports = scraper;
