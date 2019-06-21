
  const DataStore = require('@google-cloud/datastore');
  const config = require('./../config');

  const kind = "Customer";
  const key = "custId";

  // /*
  // only required to run this code locally
  // */
  // const datastore = new DataStore({
  //   projectId: config.projectId,
  //   keyFilename: config.keyFilename
  // });
  const datastore = new DataStore();
  
  /*
    Method to query the List of Customer(s)
  */
  function getAllCustomers(pageSize,startIndex,callback) {
    console.log('In get all Customer');
    var query = datastore.createQuery([kind]).limit(pageSize).order(key).start(startIndex);
    datastore.runQuery(query, (err, customers, info) => { 
      if (err) {
        callback(err);
        return;
      }
      const hasMore = info.moreResults !== DataStore.NO_MORE_RESULTS ? info.endCursor : false;
      callback(null, customers, hasMore);
    });
  }
    
  /*
    Method to query the customer by customer Id
  */
  function getCustomer(custId,callback){
    console.log("In get customer");
    var query = datastore.createQuery(kind).filter(key, '=', custId);
    datastore.runQuery(query, (err, customers) => {
      if (err) {
        callback(err);
        return;
      }
      customers.map(addKey);
      callback(null, customers);
    });
    
  }

  /*
    Function to add Key into Object
  */
  function addKey(obj) {
    obj.id = obj[DataStore.KEY].id;
    return obj;
  }


  /*
    Method to create customer record
  */
  function createCustomer(custId, firstName, lastName, telephoneNo, callback) {
    console.log('In create customer');
    var customer = {
      key: datastore.key(kind),
      data: {
        custId: custId,
        firstName: firstName,
        lastName: lastName,
        telephoneNo: telephoneNo
      }
    };
    datastore.save(customer, (err, customer) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, customer);
    });
  }

  /*
    Function to update Customer Record found with CustId , it will end up deleteting all matching records
  */
 function updateCustomer(custId, firstName, lastName, telephoneNo, callback) {
  //retrieve customer record
  var query = datastore.createQuery(kind).filter(key, '=', parseInt(custId));
  datastore.runQuery(query, (err, customers) => {
    if (err) {
      callback(err);
      return;
    }
    var updatedCust = {
      key:  customers[0][DataStore.KEY],
      data: customers[0]
    };    

  //console.log(updatedCust);
  datastore.update(updatedCust, callback);
  });
 }


  /*
    Function to delete Customer Record found with CustId , it will end up deleteting all matching records
  */
  function deleteCustomer(custId, callback) {
    //retrieve customer record
    var query = datastore.createQuery(kind).filter(key, '=', parseInt(custId));
    datastore.runQuery(query, (err, customers) => {
      if (err) {
        callback(err);
        return;
      }
      
      //retrieve the Key to delete the Object
      const custKey = customers[0][DataStore.KEY];
      datastore.delete(custKey, callback);
    });
  }

  
    module.exports = {
      getCustomer,
      getAllCustomers,
      createCustomer,
      updateCustomer,
      deleteCustomer
    };