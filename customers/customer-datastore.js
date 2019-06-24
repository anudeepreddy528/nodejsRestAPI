
  const DataStore = require('@google-cloud/datastore');
  const config = require('./../config');

  const kind = "Customer";
  const key = "custId";
  const abc = "for checking";

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
  function getAllCustomers(pageSize,pageToken,callback) {
    console.log('In get all Customer');
    var query = datastore.createQuery([kind]).limit(pageSize).order(key).start(pageToken);
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
      console.log("query to fetch the customer gave error");
      callback(err);
      return;
    }
    
    //get key from the searched record
    //TODO: empty and duplicate check
    var key=customers[0][DataStore.KEY];
    var keykind=datastore.key([kind,parseInt(key.id)]);
    console.log("key ="+JSON.stringify(key));
    console.log("var keykind"+JSON.stringify(keykind));

    //update the data fields
    //TODO: can be done in some generic way
    customers[0].firstName = firstName;
    customers[0].lastName = lastName;
    customers[0].telephoneNo = telephoneNo;
    
    var updatedCust = {
      key: keykind,
      data: customers[0]
    };    

    console.log("updated Cust"+ JSON.stringify(updatedCust));

    datastore.save(updatedCust,(err,data) => {
      if (err) {
        console.log("update call failed "+err);
        callback(err);
        return;
      }
      callback(null,data);
    });
    
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
    
    //TODO: check for duplicate
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