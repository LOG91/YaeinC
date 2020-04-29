const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const app = express();
const port = process.env.PORT || 7000;

const mongoose = require('mongoose');

const churchApiRouter = require('./api/church');
const sheetApiRouter = require('./api/sheet');
const memberApiRouter = require('./api/member');

mongoose.connect('mongodb://127.0.0.1:27017/members', { useNewUrlParser: true });
const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});


app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/members',
    collection: 'sessions',
  }),
}));


app.use('/api', require('./api/api'));
app.use('/api/church', churchApiRouter);
app.use('/api/sheet', sheetApiRouter);
app.use('/api', memberApiRouter);


app.get('/api/getinfo', (req, res) => {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: "THERE IS NO LOGIN DATA",
      code: 1
    });
  }

  res.json({ info: req.session.loginInfo });
});


app.listen(port, () => console.log(`Listening on port ${1000000}`));