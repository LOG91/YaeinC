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

const addChurch = ({ seq, name, attached }) => {
  return (
    {
      seq,
      name,
      attached
    }
  )
};

const addSheet = ({ seq, name, section, attachedId, cells = [] }) => {
  return (
    {
      seq,
      name,
      section,
      attachedId,
      cells
    }
  )
};

const addNetworkCell = ({ seq, name, networkLeaderName, gender, attached, sheetId }) => {
  return (
    {
      seq,
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


function addCounter({ name }) {
  const counter = new Counters({ "_id": name, seq: 0 });
  counter.save((err, count) => {
    if (err) console.error(err);
  })
}

router.post('/church', async (req, res) => {
  const { name, attached } = req.body;
  const seq = await Counters.findOneAndUpdate({ "_id": 'churches' }, { $inc: { seq: 1 } }).then((counter) => {
    if (counter !== null) {
      return counter.seq;
    }
    addCounter({ name: 'churches' });
    return 0;
  });

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

router.post('/church/seq', async (req, res) => {
  const { seq } = req.body;
  const idList = JSON.parse(seq);
  idList.forEach((id, idx) => {
    Church.findOneAndUpdate({ _id: id }, { $set: { seq: idx } }, { new: true }, (err, resD) => {
    })
  })
  const churchList = await Church.find().sort({ seq: 1 });
  res.send(churchList);
});

router.delete('/church/:id', (req, res) => {
  const { id } = req.params;
  Church.deleteOne({ _id: id }, (err, response) => {
    console.log(response);
    res.send(response);
  });
})

router.put('/church', async (req, res) => {
  const { id, changedName } = req.body;
  Church.findOneAndUpdate({ _id: id }, { $set: { name: changedName } }, { new: true }, (err, resD) => {
    console.log(resD);
  });
  const churchList = await Church.find().sort({ seq: 1 });
  res.send(churchList);
});


router.get('/networkCell/:sheetId', (req, res) => {
  const sheetId = req.params.sheetId;
  NetworkCell.find({ sheetId }).sort({ seq: 1 }).then(networkCells => {
    res.send(networkCells);
  });
});

router.post('/networkCell', async (req, res) => {
  const { name, networkLeaderName, gender, attached, sheetId } = req.body;
  const seq = await Counters.findOneAndUpdate({ "_id": 'networkcell' }, { $inc: { seq: 1 } }).then(counter => {
    if (counter) return counter.seq;
    addCounter({ name: 'networkCell' });
    return 0;
  });
  const networkCell = new NetworkCell(addNetworkCell({ seq, name, networkLeaderName, gender, attached, sheetId }));
  networkCell.save((err, networkCell) => {
    if (err) console.error(err);
    res.send(networkCell);
  })
})

router.put('/networkCell/seq', async (req, res) => {
  const { seq, sheetId } = req.body;
  const idList = JSON.parse(seq);
  idList.forEach((id, idx) => {
    NetworkCell.findOneAndUpdate({ _id: id }, { $set: { seq: idx } }, { new: true }, (err, resD) => {
      if (err) console.error(err);
    });
  })

  const networkCellList = await NetworkCell.find({ sheetId }).sort({ seq: 1 });
  res.send(networkCellList);
});

router.delete('/networkCell/:id', (req, res) => {
  const { id } = req.params;
  NetworkCell.deleteOne({ _id: id }).then(response => res.send(response));
})

router.post('/sheet', async (req, res) => {
  const { name, section, attachedId } = req.body;
  const seq = await Counters.findOneAndUpdate({ "_id": 'sheet' }, { $inc: { seq: 1 } }).then(counter => {
    if (counter) return counter.seq;
    addCounter({ name: 'sheet' });
    return 0;
  });
  const sheet = new Sheet(addSheet({ seq, name, section, attachedId }));
  sheet.save((err, sheet) => {
    if (err) console.error(err);
    res.send(sheet);
  })
});

router.get('/sheet/:attachedId', (req, res) => {
  const attachedId = req.params.attachedId;
  Sheet.find({ attachedId }).sort({ seq: 1 }).then(sheet => {
    res.send(sheet);
  });
});

router.delete(`/sheet/:id`, (req, res) => {
  const { id } = req.params;
  Sheet.deleteOne({ _id: id }).then(response => res.send(response));
});

router.post('/sheet/seq', async (req, res) => {
  const { attached, seq } = req.body;
  const idList = JSON.parse(seq);
  idList.forEach((id, idx) => {
    Sheet.findOneAndUpdate({ _id: id }, { $set: { seq: idx } }, { new: true }, (err, resD) => {
    })
  })
  const sheetList = await Sheet.find({ attached }).sort({ seq: 1 });
  res.send(sheetList)
});

router.post('/sheet/edit', (req, res) => {
  const { id, name } = req.body;
  Sheet.findOneAndUpdate({ _id: id }, { $set: { name } }, { new: true }, (err, sheet) => {
    if (err) console.error(err);
    res.send(sheet);
  })
})

router.get('/test', ({ query }, res) => {
  res.send({ a: 1 });
});

router.get('/cells/', async (req, res) => {
  const cells = JSON.parse(req.query.cells);
  if (cells.length === 0) res.send([]);
  const mapped = await Promise.all(cells.map(async (cell, i) => {
    const added = await Leader.find({ isLeader: true, cell: cell._id }).sort({ seq: 1 })
      .populate('youth')
      .populate({
        path: 'members',
        populate: {
          path: 'youth'
        }
      }).then();
    return { ...cell, leaders: added }
  }));
  res.send(mapped);
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
  // const sheetList = await Leader.find({ attached }).sort({ seq: 1 });
  res.send({})
})

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
  console.log(gender);
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

module.exports = router;
