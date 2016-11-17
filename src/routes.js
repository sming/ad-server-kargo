import express from 'express';
import Dao from './dao';

const router = express.Router();

/*  '/contacts/:id'
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */
router.get('/adcreative/:id', (req, res) => {
  const id = req.params.id;   // TODO express guarantees that this is non-null. We should check it's an int.
  console.log('/adcreative hit for ID ' + id);

  const dao = new Dao();  // TODO should have callback for DB connection success/failure

  const p = new Promise((resolve, reject) => {
    dao.getCreative(resolve, reject, id);
  });

  p.then((adId) => { 
    console.log('fulfilled: ', adId); 
    if (!adId) {
      res.status(404).send('Ad Creative ID ' + id + ' not found');
    } else {
      // console.log('Fields: ' + JSON.stringify(fields));
      // console.log('Rows: ' + JSON.stringify(rows));
      // console.log('The solution is: ', rows[0].name);
      console.log('/adcreative returned ID ' + adId);
      res.send({ID:adId});
    }
  }).catch((err) => { 
    console.log('rejected:', err); 
    throw err; 
  });
});

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

router.put('/adcreative', (req, res) => {
  const {creative, brand} = req.query;   // TODO check for nulls
  console.log('PUT /adcreative hit for ' + brand);

  if (!creative || !brand) {
    res.status(400).send('Creative and Brand params must be non-null');
    return;
  } 

  const dao = new Dao();  // TODO should have callback for DB connection success/failure

  const p = new Promise((resolve, reject) => {
    dao.saveCreative(resolve, reject, creative, brand);  // TODO too many params perhaps
  });

  p.then((adId) => { 
    console.log('saved ID: ', adId); 
    if (!adId) {
      res.status(500).send('Ad Creative not created');
    } else {
      console.log('/adcreative created: ID ' + adId);
      res.send({ID:adId});
    }
  }).catch((err) => { 
    console.log('rejected:', err); 
    throw err; 
  });
});

// Exporting an object as the default import for this module
export default router;
