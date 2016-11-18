import express from 'express';
import Dao from './dao';
import AdServer from './ad-server';

const router = express.Router();

/**
 * These are the routes that the REST API serves up. The impls should be moved into a new module to increase
 * clarity. We basically have Create and Get for creative and Serve Ad - which is the heart of the API.
 */

/*************************
 *  '/adcreative/:id'
 *    GET: find creative by id
 */
router.get('/adcreative/:id', (req, res) => {
  const id = req.params.id;   // TODO express guarantees that this is non-null. We should check it's an int.
  console.log('/adcreative hit for ID ' + id);

  const dao = new Dao();  // TODO should have callback for DB connection success/failure

  const p = new Promise((resolve, reject) => {
    dao.getCreative(resolve, reject, id);
  });

  p.then((reqId) => { 
    console.log('fulfilled: ', reqId); 
    if (!reqId) {
      res.status(404).send('Ad Creative ID ' + id + ' not found');
    } else {
      console.log('/adcreative returned ID ' + reqId);
      res.send({ID:reqId});
    }
  }).catch((err) => { 
    console.log('rejected:', err); 
    throw err; 
  });
});


/*************************
 *  '/adcreative'
 *    POST: create creative
 */
// TODO change request param from brandId to brand name.
// TODO parse request body for POST params instead of requiring them on command line.
router.post('/adcreative', (req, res) => {
  const {creative, brandId} = req.query;   // TODO check for nulls
  console.log('POST /adcreative hit for ' + brandId);

  if (!creative || !brandId) {
    res.status(400).send('creative and brandId params must be non-null');
    return;
  } 

  const dao = new Dao();  // TODO should have callback for DB connection success/failure

  const p = new Promise((resolve, reject) => {
    dao.saveCreative(resolve, reject, creative, brandId);  // TODO too many params perhaps
  });

  p.then((reqId) => { 
    console.log('saved ID: ', reqId); 
    if (!reqId) {
      res.status(500).send('Ad Creative not created');
    } else {
      res.send({ID:reqId});
    }
  }).catch((err) => { 
    console.log('rejected:', err); 
    throw err; 
  });
});

/*************************
 *  '/adcreative/'
 *    GET: get all creatives
 */
router.get('/adcreative', (req, res) => {
  console.log('/adcreative hit');

  const dao = new Dao();  // TODO should have callback for DB connection success/failure

  const p = new Promise((resolve, reject) => {
    dao.getCreatives(resolve, reject);
  });

  p.then((rows) => { 
    console.log('/adcreative returned OK');
    res.send(rows);   // TODO in production code would encapsulate rows in intermediate view model probably
  }).catch((err) => { 
    console.log('rejected:', err); 
    throw err; 
  });
});

// TODO put the serving code in a new module

/*************************
 *  '/adcreative/serveAd'
 *    GET: get all creatives
 *    It's a POST because conceptually it's a mutative operation - showing someone an ad and subtracting that impression from the brand's
 *    allotment.
 */
router.post('/adcreative/serveAd', (req, res) => {
  const {date, format} = req.query;   // TODO check for nulls
  console.log('POST /adcreative/serveAd hit for ' + format + date);

  if (!date || !format) {
    res.status(400).send('date and format params must be non-null');
    return;
  } 

  // TODO refactor this out with other INSERT-y methods - very similar
  const p = new Promise((resolve, reject) => {
    // TODO should really have callback for DB connection success/failure
    new Dao().saveServeRequest(resolve, reject, date, format);  // TODO too many params perhaps
  });

  p.then((reqId) => { 
    console.log('saved ID: ', reqId); 

    if (!reqId) {
      res.status(500).send('Ad Serve Request not created');
    } else {
      // TODO put this promise in new method
      const pr = new Promise((resolve, reject) => {
        // TODO should really have callback for DB connection success/failure
        new AdServer().serveAd(resolve, reject, date, format, res);
      });

      pr.then((creative) => { 
        console.log('saved ID: ', creative); 
        res.send({creative});
      }).catch((err) => { 
        console.log('rejected:', err); 
        res.status(500).send('Problem serving Ad: ' + err);
      });
    }
  }).catch((err) => { 
    console.log('rejected:', err); 
    throw err; 
  });
});
// Exporting an object as the default import for this module
export default router;
