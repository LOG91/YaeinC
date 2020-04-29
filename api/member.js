const express = require('express');
const router = express.Router();
const { addCounter } = require('./fn');

const { Leader, YouthAtt, Counters } = require('../model');
const addYouthAtt = () => ({ att: { empty: 'no' } });

const addLeader = (
  {
    seq, name, gender, age, attached, isNetworkLeader, isLeader,
    section, cellName, cellNameKr, dawn = 0, word = 0, cc = false, mc = false, yc = false, youth, cell
  },
) => ({
  seq,
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
  youth,
  cell
});

router.post('/leader', async (req, res, next) => {
  const { name, age, gender, attached, cellName, cellNameKr, section, members, cellId } = req.body;
  const youth = new YouthAtt(addYouthAtt());
  const seq = await Counters.findOneAndUpdate({ "_id": 'leader' }, { $inc: { seq: 1 } }).then(counter => {
    if (counter) return counter.seq;
    addCounter({ name: 'leader' });
    return 0;
  });
  youth.save((err, y) => {
    if (err) return console.error(err);
  })
  const lead = new Leader(addLeader({ seq, name, age, gender, attached, isNetworkLeader: false, isLeader: true, cellName, cellNameKr, section, members, youth: youth._id, cell: cellId }));
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
        youth: youth._id,
        cell: cellId
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

router.post('/leader/seq', (req, res) => {
  const { seq } = req.body;
  const idList = JSON.parse(seq);
  idList.forEach((id, idx) => {
    Leader.findOneAndUpdate({ _id: id }, { $set: { seq: idx } }, { new: true }, (err, resD) => {
    })
  })
  res.send({})
})

router.put('/check/leader/:id', (req, res) => {
  const { id, kind } = req.body;
  Leader.findOne({ _id: id }, (err, leader) => {
    if (err) {
      console.error(err);
    } else {
      Leader.update({ _id: id }, { $set: { [kind]: !leader[kind] } }, () => {
        res.json({ consol: 'log' })
      })
    }
  });
});

router.delete('/member/:id', (req, res) => {
  const { id } = req.params;
  Leader.deleteOne({ _id: id }).then(deleted => {
    res.send(deleted);
  })
});

router.post('/member', async (req, res) => {
  const { name, age, gender, attached, cellName, cellNameKr, section, members, leader_id } = req.body;
  const youth = new YouthAtt(addYouthAtt());
  const seq = await Counters.findOneAndUpdate({ "_id": 'leader' }, { $inc: { seq: 1 } }).then(counter => {
    if (counter) return counter.seq;
    addCounter({ name: 'leader' });
    return 0;
  });

  youth.save((err, y) => {
    if (err) return console.error(err);
  })
  const lead = new Leader(addLeader({ seq, name, age, gender, attached, isNetworkLeader: false, isLeader: false, cellName, cellNameKr, section, members, youth: youth._id }));
  lead.save((err, leader) => {
    Leader.findOneAndUpdate({ _id: leader_id }, { $push: { members: leader._id } }).then(response => res.send(response));
    if (err) return console.error(err);
  });
})


router.get('/members', (req, res) => {
  Leader.find({})
    .populate('youth')
    .exec((err, leader) => {
      if (err) {
        console.log(err);
      } else {
        res.json(leader);
      }
    })
})

router.get('/members/age/', (req, res) => {
  const { gte, lte } = req.query;
  console.log(req.query);
  if (!gte && !lte) {
    Leader.find({})
      .populate('youth')
      .exec((err, leader) => {
        if (err) {
          console.log(err);
        } else {
          res.json(leader);
        }
      })
  } else if (lte === 'null') {
    Leader.find()
      .where('age')
      .gte(gte)
      .populate('youth')
      .exec((err, leader) => {
        if (err) {
          console.log(err);
        } else {
          res.json(leader);
        }
      })
  }
  else {
    Leader.find()
      .where('age')
      .gte(gte)
      .lte(lte)
      .populate('youth')
      .exec((err, leader) => {
        if (err) {
          console.log(err);
        } else {
          res.json(leader);
        }
      })
  }
})

router.get('/members/gender/', (req, res) => {
  const { gender } = req.query;
  if (!gender) {
    Leader.find({})
      .populate('youth')
      .exec((err, leader) => {
        if (err) {
          console.log(err);
        } else {
          res.json(leader);
        }
      })
  } else {
    Leader.find({ gender })
      .populate('youth')
      .exec((err, leader) => {
        if (err) {
          console.log(err);
        } else {
          res.json(leader);
        }
      })
  }
})

router.post('/change/:id', (req, res) => {
  const { changedName } = req.body;
  Leader.update({ _id: req.params.id }, { $set: { name: changedName } }, () => {
  })
  res.send({});
});

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


router.put('/count/:id', (req, res) => {
  const { id, kind, count } = req.body;
  Leader.findOne({ _id: id }, (err, leader) => {
    if (err) {
      console.log(err);
    } else {
      Leader.update({ _id: id }, { $set: { [kind]: count } }, (leader) => {
        res.json(leader);
      })
    }
  });
})

module.exports = router;