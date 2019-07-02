const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'API Server connected :)' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `검색어: ${req.body.post}`,
  );
});
console.log(process.env.NODE_ENV, 111111);
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'front/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
