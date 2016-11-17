//const mysql      = require('mysql');

import * as mysql from 'mysql';

export default class {
  constructor() {
    this.connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'kargopass',
      database : 'kargo',
      port     : 3306,
    });

    this.connection.connect();
  }

  doTestQuery() {
    this.connection.query('SELECT * FROM ad_server', (err, rows, fields) => {
      if (err) throw err;

      console.log('Fields: ' + JSON.stringify(fields));
      console.log('The solution is: ', rows[0].name);
    });
  }

  disconnect() {
    this.connection.end();
  }
}
