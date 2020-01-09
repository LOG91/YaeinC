const express = require('express');
const router = express.Router();

const { Leader, YouthAtt, Church, Sheet, NetworkCell } = require('../members.model');


const addLeader = ({ name, gender, age, attached, isNetworkLeader, isLeader,
  section, cellName, cellNameKr, dawn = 0, word = 0, cc = false, mc = false, yc = false, youth
}) => {
  return (
    {
      name,
      age,
      gender,
      attached,
      isNetworkLeader,
      isLeader,
      section,
      cellName,
      cellNameKr,
      dawn,
      word,
      cc,
      mc,
      yc,
      youth
    }
  )
};

const addSheet = ({ name, section, attached, cells = [] }) => {
  return (
    {
      name,
      section,
      attached,
      cells
    }
  )
};

const addYouthAtt = () => ({ att: { empty: 'no' } });

router.post('/reset', (req, res) => {
  Leader.updateMany({}, { $set: { mc: false, cc: false, yc: false } }, () => {
  })
  res.send({});
});

router.post('/sheet', (req, res) => {
  const { name, section, attached } = req.params;
  const sheet = new Sheet(addSheet({ name, section, attached }));
  sheet.save((err, s) => {
    if (err) console.log(err);
    res.send(s);
  })

});

router.get('/cells/:cells', async (req, res) => {
  const cellNames = JSON.parse(req.params.cells);
  const obj = {};
  cellNames.forEach((v, i) => {
    obj[v] = i;
  })
  const data = await Leader.find({ isLeader: true })
    .populate('youth')
    .populate({
      path: 'members',
      populate: {
        path: 'youth'
      }
    })
    .then(lead => {
      const reduced = lead.reduce((acc, cv) => {
        if (!acc[obj[cv.cellNameKr]]) acc[obj[cv.cellNameKr]] = [cv];
        else acc[obj[cv.cellNameKr]].push(cv);
        return acc;
      }, [])
      return reduced;
    });
  res.send(data);
})

router.post('/youth/:id', (req, res) => {
  const { id, date } = req.body;
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

router.get('/oneCell/:oneCell', async (req, res) => {
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

router.get('/gender/:gender', (req, res) => {
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

router.post('/leader', (req, res, next) => {
  const { name, age, gender, attached, cellName, cellNameKr, section, members } = req.body;
  const youth = new YouthAtt(addYouthAtt());
  youth.save((err, y) => {
    if (err) return console.error(err);
  })
  const lead = new Leader(addLeader({ name, age, gender, attached, isNetworkLeader: false, isLeader: true, cellName, cellNameKr, section, members, youth: youth._id }));
  if (!members.length) {
    lead.save((err, leader) => {
      if (err) return console.error(err);
    });
  }

  members.forEach((member, idx) => {
    const youth = new YouthAtt(addYouthAtt());
    youth.save((err, y) => {
      if (err) return console.error(err);
    })
    const memb =
      new Leader(addLeader({
        name: member.name,
        age: member.age,
        gender,
        sec: idx,
        attached,
        isNetworkLeader: false,
        isLeader: false,
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

router.put('/check/leader/:id', (req, res) => {
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

router.put('/count/:id', (req, res) => {
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

module.exports = router;