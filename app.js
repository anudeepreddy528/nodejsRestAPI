'use strict';

const path = require('path');
const express = require('express');
const config = require('./config');

const app = express();

app.set('trust proxy', true);

// Customers
app.use('/api/customers', require('./customers/api'));

// Redirect root to /books
app.get('/', (req, res) => {
  res.redirect('/api/customer');
});

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res) => {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Bad Server. No Donut for you today!');
});

if (module === require.main) {
  // Start the server
  const server = app.listen(config.PORT, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
