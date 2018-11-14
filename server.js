'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data);
console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const { PORT } = require('./config');

const express = require('express');

const app = express();

const logger = require('./middleware/logger');


// ADD STATIC SERVER HERE
app.use(express.static('public'));
app.use(logger);

// app.get('/api/notes', (req, res) => {
//   const searchTerm = req.query.searchTerm;

//   if (searchTerm) {
//     return res.json(data.filter(note => note.title.includes(searchTerm)));
//   }
  
//   res.json(data);
// });

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  
  notes.find(id, (err, note) => {
    if (err) {
      return next(err);
    }
    res.json(note);
  });
  
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});