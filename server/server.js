const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');

const users = [
  { id: uuid.v4(), name: 'dude1' },
  { id: uuid.v4(), name: 'dude2' },
  { id: uuid.v4(), name: 'dude3' }
];

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/users', (req, res) => {
  res.send({ users });
});

app.post('/users', (req, res) => {
  const newUser = req.body.name && { id: uuid.v4(), name: req.body.name };
  if (newUser) {
    users.push(newUser);
    res.send({ users });
  }
  else {
    res.send({ 'error': 'please provide a name.' });
  }
});

app.get('/users/:id', (req, res) => {
  for (let i = 0, len = users.length; i < len; i++) {
    if (users[i].id === req.params.id) return res.send(users[i]);
  }
  return res.send({ 'error': 'User not found!' });
});

app.get('/search', (req, res) => {
  const term = req.query.name && req.query.name.toLowerCase();
  let results = [];
  
  if (term) {
    users.forEach(user => {
      if (user.name.toLowerCase().indexOf(term) !== -1) results.push(user);
    });
  }
  res.send(results.length > 0 ? { users: results } : { error: 'No users found!' });
});

app.delete('/users/:id', (req, res) => {
  users.forEach((user, index) => {
    if (user.id === req.params.id) {
      users.splice(index, 1);
    }
  });
  res.send({ users });
});

app.listen(5000, () => {
  console.log('Server listening on port 5000.');
});