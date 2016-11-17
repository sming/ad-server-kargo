/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-template */
/* eslint-disable newline-after-import */
/* eslint-disable comma-dangle */
/* eslint-disable key-spacing */
/* eslint-disable no-multi-spaces */
import express from 'express';
import routes from './routes';
import he from './handle-errors';

console.log('HI');


const app = express();

// Set up 'known' routes i.e. good routes
app.use('/', routes);

// Set up handling everything else
he(app);

app.listen(process.env.PORT || '3000', () => {
  console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});
