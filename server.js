const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const app = express();
const port = process.env.PORT || 7000;

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/members', { useNewUrlParser: true });
const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});
const UserSchema = mongoose.Schema({
  user_id: String,
  password: String,
});
const User = mongoose.model('user', UserSchema);
const url = require('url');


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


// app.get('/signin', (req, res, next) => {
//   if (req.session.logined) {
//     res.render('logout', { id: req.session.user_id });
//   } else {
//     res.render('login');
//   }
// });

app.get('/api/signin/register', (req, res) => {
  res.render('register');
});

app.post('/api/signin/register', (req, res) => {
  let uid = req.body.user_id;
  let upwd = req.body.password;
  duplicate({ req, res, uid, upwd });
});

app.post('/api/signin', (req, res) => {      // 2
  console.log('Hello!!!');
  let uid = req.body.id;
  let upwd = req.body.pwd;
  duplicate({ req, res, uid, upwd });
  console.log(1234234);
});
app.post('/api/signin/logout', (req, res) => {      // 3
  req.session.destroy();
  res.redirect('/hello');
});

app.listen(port, () => console.log(`Listening on port ${1000000}`));


function duplicate({ req, res, uid, upwd }) {
  // console.log('유알엘', url);
  // console.log('알이큐', req);
  let parseUrl = url.parse(req.url);
  let resource = parseUrl.pathname;
  console.log(`리소스 = ${resource}`);
  if (resource == '/api/signin/register') {
    User.findOne({ "user_id": uid }, (err, user) => {
      if (err) return res.json(err);

      if (user) {
        console.log('user id duplicate');
        res.send(`
                  <a href="/signin">Back</a>
                  <h1>User id duplicate</h1>
              `);
      } else {
        User.create({ "user_id": uid, "password": upwd }, (err) => {
          if (err) return res.json(err);
          console.log('Success');
          res.redirect('/admin');
        })
      }
    })
  } else {
    User.findOne({ "user_id": uid }, (err, user) => {
      console.log(err, user, uid);
      if (err) return res.json(err);

      if (user) {
        User.findOne({ "password": upwd })
          .exec((err, user) => {
            if (err) return res.json(err);

            if (!user) {
              console.log('different password');
              res.send(`
                      <a href="/signin">Back</a>
                      <h1>Different password</h1>
                  `);
            } else {
              console.log('Welcome 21');
              req.session.user_id = uid;
              req.session.logined = true;
              res.send({ ok: true, uid });
            }
          })
      } else {
        console.log('Cannot find user');
        res.send(`
                  <a href="/signin">Back</a>
                  <h1>Cannot find user</h1>
              `);
      }
    })
  }
}