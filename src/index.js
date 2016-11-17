/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-template */
/* eslint-disable newline-after-import */
import express from 'express';
import routes from './routes';

const app = express();

app.use('/', routes);

// TODO put these in error.js or something
app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

// custom 500 page
app.use((err, req, res, next) => {
//console.error((err.stack, req, res, next));
  const args = Array.prototype.slice.call(arguments);
  console.log('Internal server error: ' + args.join(' | '));
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(process.env.PORT || '3000', () => {
  console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});
