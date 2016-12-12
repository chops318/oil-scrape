'use strict';

const express      = require('express');
const mongoose     = require('mongoose');
const scrapeRouter = require('./routes/scrapeRouter');
const wellRouter   = require('./routes/wellRouter');
const morgan       = require('morgan');
const app          = express();
const PORT         = process.env.PORT || 3000;

const LOCAL_DB = 'mongodb://localhost/oilwells_dev';
const DB_SERVER = process.env.DB_SERVER || LOCAL_DB;

mongoose.connect(DB_SERVER);
app.use(morgan('dev'));

app.use('/api/scrape', scrapeRouter);
app.use('/api/wells', wellRouter);

app.use('*', (req, res, next) => {
  res.json('Not found');
});

const server = app.listen(PORT, () => console.log('server up'));
