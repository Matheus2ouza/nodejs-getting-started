const express = require('express');
const path = require('path');
const cool = require('cool-ascii-faces');
require('dotenv').config();
const mysql = require('mysql2/promise'); // Biblioteca para MariaDB/MySQL

const port = process.env.PORT || 5006;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexão com JawsDB
const pool = mysql.createPool(process.env.JAWSDB_MARIA_URL);

// Rotas
app.get('/', (req, res) => {
  console.log(`Rendering 'pages/index' for route '/'`);
  res.render('pages/index');
});

app.get('/cool', (req, res) => {
  console.log(`Rendering a cool ascii face for route '/cool'`);
  res.send(cool());
});

app.get('/times', (req, res) => {
  const times = process.env.TIMES || 5;
  console.log(`Rendering a count from 1 to ${times} for route '/times'`);
  let result = '';
  for (let i = 1; i <= times; i++) {
    result += i + ' ';
  }
  res.send(result);
});

// Exemplo rota de banco
app.get('/db', async (req, res) => {
  console.log(`Rendering the results of a database query for route '/db'`);
  try {
    const [rows] = await pool.query('SELECT * FROM test_table');
    res.render('pages/db', {
      results: rows
    });
  } catch (err) {
    console.error(err);
    res.send('Error ' + err);
  }
});

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: gracefully shutting down');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
    });
  }
});
