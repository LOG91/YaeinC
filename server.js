const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');
const { Leader, Member, YouthAtt } = require('./members.model');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const addLeader = ({ name, gender, section, cellName, cellNameKr, age, dawn = 0, word = 0, cc = false, mc = false, yc = false, youth
 }) => {
  return (
    {
      name,
      gender,
      section,
      cellName,
      cellNameKr,
      age,
      dawn,
      word,
      cc,
      mc,
      yc,
      youth
    }
  )
}

const addMember = ({ leaderId, gender, sec, name, section, cellName, cellNameKr, cc = false, mc = false, yc = false, youth }) => {
  return (
    {
      leaderId,
      gender,
      sec,
      name,
      section,
      cellName,
      cellNameKr,
      cc,
      mc,
      yc,
      youth
    }
  )
}

const addYouthAtt = () => ({ att: { empty: 'no' } });

app.post('/api/reset', (req, res) => {
  // const { currentLocation } = req.body;
  Leader.updateMany({}, {$set: { mc: false, cc: false, yc: false } }, () => {
  })
  Member.updateMany({}, {$set: { mc: false, cc: false, yc: false } }, () => {
  })
  // console.log(currentLocation)
  res.send({});
})

app.get('/api/cells/:cells', async (req, res) => {
  const cellNames = JSON.parse(req.params.cells);
  const obj = {};
  cellNames.forEach((v, i) => {
    obj[v] = i;
  })
  const data = await Leader.find({})
    .populate('youth')
    .populate({
      path: 'members',
      populate: {
        path: 'youth'
      }
    })
    .then(lead => {
      const reduced = lead.reduce((acc, cv) => {
        if (!acc[obj[cv.cellName]]) acc[obj[cv.cellName]] = [cv];
        else acc[obj[cv.cellName]].push(cv);
        return acc;
      }, [])
      return reduced;
    });
  res.send(data);
})

app.post('/api/youth/:id', (req, res) => {
  console.log('heell')
  const { id, date } = req.body;
  console.log(id, date);
  YouthAtt.findOne({ _id: id }, (err, member) => {
    if (err) {
      console.log(err);
    } else {
      YouthAtt.update({ _id: id }, { $set: { [`att.${date}`]: !member.att[date] } }, () => {
        res.json({ consol: 'log' })
      })
    }
  });
})

app.get('/api/oneCell/:oneCell', async (req, res) => {
  const cellName = req.params.oneCell;
  const data = await Leader.find({ cellName: cellName })
    .populate('youth')
    .populate({
      path: 'members',
      populate: {
        path: 'youth'
      }
    })
    .then();
  res.send(data);
})

app.get('/api/gender/:gender', (req, res) => {
  const gender = req.params.gender;
  Leader.find({ gender: gender })
    .populate('youth')
    .populate({
      path: 'members',
      populate: {
        path: 'youth'
      }
    })
    .exec((err, user) => {
      res.send(user);
    })
})

app.post('/api/leader', (req, res, next) => {
  const { name, age, gender, cellName, cellNameKr, section, members } = req.body;
  const youth = new YouthAtt(addYouthAtt());
  youth.save((err, y) => {
    if (err) return console.error(err);
  })
  const lead = new Leader(addLeader({ name, age, gender, cellName, cellNameKr, section, members, youth: youth._id }));
  if (!members.length) {
    lead.save((err, leader) => {
      if (err) return console.error(err);
    });
    // res.send({ a: 1, b: 2, c: 3, d: 4 });
  }
  members.forEach((memberName, idx) => {
    const youth = new YouthAtt(addYouthAtt());
    youth.save((err, y) => {
      if (err) return console.error(err);
    })
    const memb =
      new Member(addMember({
        name: memberName,
        gender,
        sec: idx,
        cellName,
        cellNameKr,
        section,
        leaderId: lead._id,
        youth: youth._id
      }));
    memb.save((err, member) => {
    })
    lead.members.push(memb._id);
    if (idx === members.length - 1) {
      lead.save((err, book) => {
        if (err) return console.error(err);
      }
      )
    }
  });

  res.send(lead);
});

app.put('/api/check/leader/:id', (req, res) => {
  const { id, kind } = req.body;
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

app.put('/api/check/member/:id', (req, res) => {
  const { id, kind } = req.body;
  Member.findOne({ _id: id }, (err, member) => {
    if (err) {
      console.log(err);
    } else {
      Member.update({ _id: id }, { $set: { [kind]: !member[kind] } }, () => {
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
