'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const customerModel = require('./customer-datastore');

var router = express.Router();
var pageSize = 10;

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * GET /api/customers
 *
 * Retrieve All customers customers.
 */
router.get('/', (req, res, next) => {

  pageSize = req.query.pageSize || 10;
  startIndex = req.query.startIndex || 0;
  console.log("Searching Customers." + "PageSize = "+pageSize+". StartIndex="+startIndex);
  customerModel.getAllCustomers(parseInt(pageSize), parseInt(req.query.startIndex), (err, customers, nextPageAvailable) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: customers,
      nextPage: nextPageAvailable
    });
  });
});

/* GET /api/customer/:custId
 *
 * Retrieve a customer.
 */
router.get('/:custId', (req, res, next) => {
  customerModel.getCustomer(parseInt(req.params.custId), (err , customer) => {
    if (err) {
      next(err);
      return;
    }
    res.json(customer);
  });
});

/**
 * POST /api/customer
 *
 * Create a new customer.
 */
router.post('/', (req, res, next) => {
  customerModel.createCustomer(req.body.custId,req.body.firstName, req.body.lastName, req.body.telephoneNo, (err, customer) => {
    if (err) {
      next(err);
      return;
    }
    res.json(customer);
  });
});

 
/**
 * PUT /api/customer/:id
 *
 * Update a customer.
 */
router.put('/:custId', (req, res, next) => {
  customerModel.updateCustomer(req.body.custId,req.body.firstName, req.body.lastName, req.body.telephoneNo, (err, customer) => {
    if (err) {
      next(err);
      return;
    }
    res.json(customer);
  });
});

/**
 * DELETE /api/customers/:id
 *
 * Delete a customer.
 */
router.delete('/:custId', (req, res, next) => {
  customerModel.deleteCustomer(req.params.custId, err => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).send('OK');
  });
});

/**
 * Errors on "/api/customers/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code,
  };
  next(err);
});

module.exports = router;
