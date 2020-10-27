'use strict';

const express = require('express');
const mysql = require('mysql');

const dbHost     = process.env['DB_HOST'] || 'localhost';
const dbUser     = process.env['DB_USER'] || 'root';
const dbPassword = process.env['DB_PASSWORD'] || 'dummy';
const dbName     = process.env['DB_NAME'] || 'nodejs';

var connection = mysql.createConnection({
  host     : dbHost,
  user     : dbUser,
  password : dbPassword,
  database : dbName
});

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
    var msg;
    connection.query('SELECT message from greeting LIMIT 1', function (error, results, fields) {
        if (error) throw error;
        msg = results[0].message;
        console.log(msg);
        res.send(msg);
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
