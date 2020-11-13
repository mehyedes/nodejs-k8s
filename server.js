'use strict';

const express = require('express');
const mysql = require('mysql');

const dbHost     = process.env['DB_HOST'] || 'localhost';
const dbUser     = process.env['DB_USER'] || 'root';
const dbPassword = process.env['DB_PASSWORD'] || 'dummy';
const dbName     = process.env['DB_NAME'] || 'nodejs';
const namespace  = process.env['NAMESPACE'] || 'kubernetes';

var connection = mysql.createConnection({
  host     : dbHost,
  user     : dbUser,
  password : dbPassword,
  database : dbName
});

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// Health endpoint
app.use('/healthcheck', require('express-healthcheck')());

// Endpoint for checking the readiness of the app
// Makes sure that we can establish a connection to the database
app.get('/status', (req, res) => {
    connection.query('SELECT 1 from greeting', function (error, results, fields) {
        if (error) {
            console.error(error.code);
            res.status(500).send({ fatal: "Looks like we have an issue :( Please try again later." })
        }
        else{
            res.send('OK!');
        }
    });
});

app.get('/', (req, res) => {
    var msg;
    connection.query('SELECT message from greeting LIMIT 1', function (error, results, fields) {
        if (error) {
            console.error(error.code);
            res.status(500).send({ fatal: "Looks like we have an issue :( Please try again later." })
        }
        else {
            msg = results[0].message + `</br> From the <b>${namespace}</b> namespace `;
            console.log(msg);
            res.send(msg);
        }
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
