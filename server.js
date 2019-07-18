const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');
const {Leader, Member} = require('./members.model');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const addLeader = ({ name, section, cellName, cellNameKr, age, dawn = 0, word = 0, cc = false, mc = false, yc = false }) => {
  return (
    {
      name,
      section,
      cellName,
      cellNameKr,
      age,
      dawn,
      word,
      cc,
      mc,
      yc,
    }
  )
}

const addMember = ({ leaderId, sec, name, section, cellName, cellNameKr, cc = false, mc = false, yc = false }) => {
  return (
    {
      leaderId,
      sec,
      name,
      section,
      cellName,
      cellNameKr,
      cc,
      mc,
      yc,
    }
  )
}

app.get('/api/section/:section', (req, res) => {
  const cellName = req.params.section;
  Leader.find({ cellName: cellName })
        .populate('members')
        .exec((err, user) =>{
    res.send(user);
  })
})


// just kidding
app.get('/api/jjp', (req, res) => {
  console.log('This is JJP page');
  res.send(`
    <div>
      <h2 style="text-align:center">정재필 홈페이지</h2>
      <img 
        style="display: block; margin: 0 auto;"
        src="https://post-phinf.pstatic.net/MjAxODAxMzBfMjI1/MDAxNTE3MjY5MzA3NTgz.V6faZ0lf5APcXPXCLchR5XUHOdzz5MQRNOA5Y7dL-iog.COU5qG5ACVgPJNgV3PpXr-oVVmpCxqbrYSzaRDtbnoYg.JPEG/2.jpg?type=w1200"></img>
    </div>
  `);
});

app.post('/api/member', (req, res) => {
  const { _id: leaderId, cellName, cellNameKr, section, members } = req.body;
  members.forEach((memberName, idx) => {
    const memb = new Member(addMember({ name: memberName, sec: idx, cellName, cellNameKr, section, leaderId }));
    memb.save((err, member) => {
      if (err) return console.error(err);
    })
  })
  res.send({1:2});
})

app.post('/api/leader', (req, res, next) => {
  const { name, age, cellName, cellNameKr, section, members } = req.body;
  const lead = new Leader(addLeader({ name, age, cellName, cellNameKr, section, members }));
  if (!members.length) {
    lead.save((err, book) => {
      if (err) return console.error(err);
    });
    // res.send({ a: 1, b: 2, c: 3, d: 4 });
  }
  members.forEach((memberName, idx) => {
    const memb = new Member(addMember({ name: memberName, sec: idx, cellName, cellNameKr, section, leaderId: lead._id }));
    console.log(`i'm out${idx}`)
    memb.save((err, member) => {
    })
    lead.members.push(memb._id);
      if (idx === members.length - 1) {
        console.log('saved');
        lead.save((err, book) => {
        if (err) return console.error(err);
      }
    )}
  });
  res.send({ a: 1, b: 2, c: 3, d: 4 });
});

app.put('/api/check/:id', (req, res) => {
  const { id, kind, memberName } = req.body;
  Leader.findOne({ _id: id }, (err, leader) => {
    if (err) {
      console.log(err);
    } else {
      Leader.update({ _id: id }, { $set: { [kind]: !leader[kind] } }, () => {
        res.json({ consol: 'log' })
      })
    }
  });
});
app.put('/api/count/:id', (req, res) => {
  const { id, kind, count } = req.body;
  Leader.findOne({ _id: id }, (err, leader) => {
    if (err) {
      console.log(err);
    } else {
      Leader.update({ _id: id }, { $set: { [kind]: count } }, () => {
        res.json({ consol: 'log' })
      })
    }
  });
})


mongoose.connect('mongodb://127.0.0.1:27017/members', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})

// API calls
app.get('/api/hello', (req, res) => {
  console.log('hello World!!');
  res.send({ express: 'API Server connected :)' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `검색어: ${req.body.post}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'front/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'front/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
