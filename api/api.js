const express = require('express');
const router = express.Router();
const { addCounter } = require('./fn');

const { Leader, NetworkCell, Counters } = require('../model');


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

router.post('/reset', (req, res) => {
  Leader.updateMany({}, { $set: { dawn: 0, word: 0, mc: false, cc: false, yc: false } }, () => {
  })
  res.send({});
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


module.exports = router;
