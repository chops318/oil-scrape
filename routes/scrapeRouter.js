'use strict';
const Router = require('express').Router;
const Well    = require('../models/oilWell');

const eventScraper = require('../lib/eventScraper');
const router = module.exports = exports = Router();


router.get('/:parish/:number', (req, res) => {
  eventScraper.emit('scrape', req.params.parish, req.params.number, res)
})

router.get('/productionScrape/:parish/:wellNum', (req, res, next) => {
  eventScraper.emit('production', req.params.parish, req.params.wellNum, res)
})

module.exports = router;
