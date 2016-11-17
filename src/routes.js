import express from 'express';

const router = express.Router();
// Arrow functions
router.get('/hi', (req, res) => {
  console.log('hi hit');
  res.send({ message: 'Hello World!!' });
});

/*  '/contacts/:id'
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */
router.get('/adcreative/:id', (req, res) => {
  const id = req.params.id;   // TODO express guarantees that this is non-null. We should check it's an int.
  console.log('/adcreative hit for ID ' + id);
  const { adId, creative } = Dao.getAdCreative();

  if (!adId) {
    res.status(404).send('Ad Creative ID ' + id + ' not found');
    return;
  }

  console.log('/adcreative returned ID ' + adId);

  res.send({ID:adId, Creative: creative});
});

router.put('/adcreative', (req, res) => {
  console.log('/adcreative hit');
  const adId = Dao.insertAdCreative();
  console.log('/adcreative returned ID ' + adId);

  res.send({ID:adId});  // no need to send creative back but perhaps if it was sanitized?
});

// Exporting an object as the default import for this module
export default router;
