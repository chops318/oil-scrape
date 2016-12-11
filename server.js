'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// App Constants
const PORT = process.env.PORT || 3000;

app.all('*', (req, res, next) => {
  res.json('Not found')
})

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
