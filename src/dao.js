const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'kargopass',
  database : 'kargo',
  port     : 3306,
});

connection.connect();

connection.query('SELECT * FROM ad_server', (err, rows, fields) => {
  if (err) throw err;

  console.log('Fields: ' + JSON.stringify(fields));
  console.log('The solution is: ', rows[0].name);
});

connection.end();
