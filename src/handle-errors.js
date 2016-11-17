/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/* eslint-disable prefer-template */
/* eslint-disable newline-after-import */
/* eslint-disable prefer-rest-params */
export default function (app) {
  // custom 500 page
  app.use((err, req, res, next) => {
    //console.error((err.stack, req, res, next));
    const args = Array.prototype.slice.call(arguments);
    console.log('Internal server error: ' + args.join(' | '));
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
  });

  app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });
}
