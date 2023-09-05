const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./players.db', (err) => {
  if (err) {
    console.error('Error opening the database', err);
  } else {
    console.log('Database connected!');
  }
});

// Create tables if they don't exist
const games = ['Cup Pong', 'Darts', 'Billiards'];
games.forEach((game) => {
  db.run(`CREATE TABLE IF NOT EXISTS "${game}" (player_id INTEGER PRIMARY KEY, name TEXT, score INTEGER)`);
});

// Routes for API
app.get('/api/getPlayers/:game', (req, res) => {
  const { game } = req.params;
  db.all(`SELECT * FROM "${game}"`, [], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.delete('/api/deletePlayer/:game/:playerId', (req, res) => {
  const { game, playerId } = req.params;
  db.run(`DELETE FROM "${game}" WHERE player_id = ?`, [playerId], (err) => {
    if (err) throw err;
    res.json({ status: 'success' });
  });
});

app.post('/api/addPlayer/:game', (req, res) => {
  const { game } = req.params;
  const { name, score } = req.body;
  db.run(`INSERT INTO "${game}" (name, score) VALUES (?, ?)`, [name, score], (err) => {
    if (err) throw err;
    res.json({ status: 'success' });
  });
});

app.put('/api/updatePlayerScore/:game/:playerId', (req, res) => {
  const { game, playerId } = req.params;
  const { score } = req.body;
  db.run(`UPDATE "${game}" SET score = ? WHERE player_id = ?`, [score, playerId], (err) => {
    if (err) throw err;
    res.json({ status: 'success' });
  });
});


// Route for serving HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/qr.png', (req, res) => {
  const imagePath = path.join(__dirname, 'qr.png');
  res.sendFile(imagePath);
});

// Route for serving JS
app.get('/script2.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script2.js'));
});

// Route for serving CSS
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
