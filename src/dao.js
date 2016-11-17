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

  getCreative(resolve, reject, id) {
    this.connection.query('SELECT * FROM ad where id=' + id, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  }

  getCreatives(resolve, reject) {
    this.connection.query('SELECT * FROM ad', (err, rows) => {  // removed ,fields
      if (err) reject(err);
      resolve(rows);
    });
  }

  saveCreative(resolve, reject, creative, brandId) {
    this.connection.query('INSERT INTO ad SET ?', {creative, ad_brand_id: brandId}, (err, result) => {
      if (err) reject(err);
      resolve(result.insertId);
    });
  }

  disconnect() {
    this.connection.end();
  }
}
