const express = require('express');

const router = express.Router();

const {
  Leader,
  YouthAtt,
  Church,
  Sheet,
  NetworkCell,
  Counters
} = require('../model');

const addLeader = (
  {
    seq, name, gender, age, attached, isNetworkLeader, isLeader,
    section, cellName, cellNameKr, dawn = 0, word = 0, cc = false, mc = false, yc = false, youth,
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
});

const addChurch = ({ seq, name, attached }) => {
  return (
    {
      seq,
      name,
      attached
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

const addNetworkCell = ({ name, networkLeaderName, gender, attached, sheetId }) => {
  return (
    {
      name,
      networkLeaderName,
      gender,
      attached,
      sheetId
    }
  )
}

const addYouthAtt = () => ({ att: { empty: 'no' } });

router.post('/reset', (req, res) => {
  Leader.updateMany({}, { $set: { dawn: 0, word: 0, mc: false, cc: false, yc: false } }, () => {
  })
  res.send({});
});

router.post('/change/:id', (req, res) => {
  const { changedName } = req.body;
  Leader.update({ _id: req.params.id }, { $set: { name: changedName } }, () => {
  })
  res.send({});
});

router.delete('/member/:id', (req, res) => {
  const { id } = req.params;
  Leader.deleteOne({ _id: id }).then(deleted => {
    console.log(deleted);
    res.send(deleted);
  })
});

router.post('/church', async (req, res) => {
  const { name, attached } = req.body;
  const { seq } = await Counters.findOneAndUpdate({ "_id": 'churches' }, { $inc: { seq: 1 } }).then();
  const church = new Church(addChurch({ seq, name, attached }));
  church.save((err, church) => {
    if (err) console.error(err);
    res.send(church);
  })
});

router.get('/church/all', (req, res) => {
  Church.find({}).sort({ seq: 1 }).then(church => {
    res.send(church);
  });
});

router.post('/church/seq', (req, res) => {
  const { _id, seq } = req.body;
  Church.findOneAndUpdate({ _id }, { $set: { seq } }, { new: true }, (err, resD) => {
    if (!err) res.send(resD);
  })
});

router.delete('/church/:id', (req, res) => {
  const { id } = req.params;
  Church.deleteOne({ _id: id }, (err, response) => {
    console.log(response);
    res.send(response);
  });
})


router.get('/networkCell/:sheetId', (req, res) => {
  const sheetId = req.params.sheetId;
  NetworkCell.find({ sheetId }).then(networkCells => {
    res.send(networkCells);
  });
});

router.post('/networkCell', (req, res) => {
  const { name, networkLeaderName, gender, attached, sheetId } = req.body;
  const networkCell = new NetworkCell(addNetworkCell({ name, networkLeaderName, gender, attached, sheetId }));
  networkCell.save((err, networkCell) => {
    if (err) console.error(err);
    res.send(networkCell);
  })
})

router.post('/sheet', (req, res) => {
  const { name, section, attached } = req.body;
  const sheet = new Sheet(addSheet({ name, section, attached }));
  sheet.save((err, sheet) => {
    if (err) console.error(err);
    res.send(sheet);
  })
});

router.get('/sheet/:attached', (req, res) => {
  const attached = req.params.attached;
  Sheet.find({ attached }).then(sheet => {
    res.send(sheet);
  });
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

router.post('/leader', async (req, res, next) => {
  const { name, age, gender, attached, cellName, cellNameKr, section, members } = req.body;
  const youth = new YouthAtt(addYouthAtt());
  const { seq } = await Counters.findOneAndUpdate({ "_id": 'leader' }, { $inc: { seq: 1 } }).then();

  youth.save((err, y) => {
    if (err) return console.error(err);
  })
  const lead = new Leader(addLeader({ seq, name, age, gender, attached, isNetworkLeader: false, isLeader: true, cellName, cellNameKr, section, members, youth: youth._id }));
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

router.get('/update', (req, res) => {
  // Counters.findOneAndUpdate({_}, { $inc: { seq: 1 } }).then(res => console.log(res));
  // res.send({});
  // console.log(num);
  // res.send(num);
})

function getNextSequence(name) {
  // Counters.find({id: 'seokki'}).then(res=> console.log(res));
  Counters.findOneAndUpdate({}, { $inc: { seq: 1 } }).then(res => console.log(res));
  return ret.seq;
}

module.exports = router;
