'use strict';

const express      = require('express');
const mongoose     = require('mongoose');
const scrapeRoutes = require('./route/scrapeRoutes');
const wellRoutes   = require('./route/wellRoutes');
const morgan       = require('morgan');
const app          = express();
const PORT         = process.env.PORT || 3000;

const LOCAL_DB = 'mongodb://localhost/oilwells_dev';
const DB_SERVER = process.env.DB_SERVER || LOCAL_DB;

mongoose.connect(DB_SERVER);
app.use(morgan('dev'));

app.use('/api/scrape', scrapeRoutes);
app.use('/api/wells', wellRoutes);

app.use('*', (req, res, next) => {
  res.json('Not found');
});

const server = app.listen(PORT, () => console.log('server up'));
