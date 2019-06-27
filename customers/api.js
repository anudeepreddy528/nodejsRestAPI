'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const customerModel = require('./customer-datastore');
const Joi = require('@hapi/joi');
var router = express.Router();
var pageSize = 10;
var nextPageToken = 0;

// Automatically parse request body as JSON
router.use(bodyParser.json());
const schema={
  custId : Joi.number().required(),
  firstName:Joi.string().min(3).max(20).required(),
  lastName:Joi.string().min(2).max(10).required(),
  telephoneNo:Joi.string().min(10).max(10).required()
};
/**
 * GET /api/customers
 *
 * Retrieve All customers customers.
 */
router.get('/all', (req, res, next) => {
  pageSize = req.query.pageSize || 10;
  console.log("Searching Customers." + "PageSize = "+pageSize+". StartIndex="+nextPageToken);
  customerModel.getAllCustomers(pageSize, req.query.nextPageToken, (err, customers, hasMore) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      items: customers,
      hasMore: hasMore
    });
  });
});

/* GET /api/customer/:custId
 *
 * Retrieve a customer.
 */
// router.get('/:custId', (req, res, next) => {
 router.get('/', (req, res, next) => {
  const result=Joi.validate(req.query.custId,schema.custId);
  if(result.error){
    res.status(400).json(result.error.details[0].message);
    return;
  }
  customerModel.getCustomer(parseInt(req.query.custId), (err , customer) => {
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
  const result=Joi.validate(req.body,schema);
    if(result.error){
      res.status(400).json(result.error.details[0].message);
      return;
    }
    console.log(result);
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
// router.put('/:custId', (req, res, next) => {
 router.put('/', (req, res, next) => {
  const result=Joi.validate({custId:req.query.custId,firstName:req.body.firstName,lastName:req.body.lastName,telephoneNo:req.body.telephoneNo},schema);
  if(result.error){
    res.status(400).json(result.error.details[0].message);
    return;
  }
   console.log("Inside Update Customer {"+req.query.custId+","+req.body.firstName+","+req.body.lastName+","+req.body.telephoneNo);
  customerModel.updateCustomer(parseInt(req.query.custId),req.body.firstName, req.body.lastName, req.body.telephoneNo, (err, customer) => {
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
//router.delete('/:custId', (req, res, next) => {
router.delete('/', (req, res, next) => {
  const result=Joi.validate(req.query.custId,schema.custId);
  if(result.error){
    res.status(400).json(result.error.details[0].message+'Invalid valid Id');
    return;
  }
  customerModel.deleteCustomer(req.query.custId, err => {
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
  res.send(err);
  next(err);
});

module.exports = router;
