const express = require('express');
const router = express.Router();
const { addCounter } = require('./fn');
const { Sheet, Counters } = require('../model');


router.post('/', async (req, res) => {
  const { name, section, attachedId } = req.body;
  const seq = await Counters.findOneAndUpdate({ "_id": 'sheet' }, { $inc: { seq: 1 } }).then(counter => {
    if (counter) return counter.seq;
    addCounter({ name: 'sheet' });
    return 0;
  });
  console.log('chch');
  const sheet = new Sheet({ seq, name, section, attachedId, cells: [] });
  sheet.save((err, sheet) => {
    if (err) console.error(err);
    res.send(sheet);
  })
});

router.get('/:attachedId', (req, res) => {
  const attachedId = req.params.attachedId;
  Sheet.find({ attachedId }).sort({ seq: 1 }).then(sheet => {
    res.send(sheet);
  });
});

router.delete(`/:id`, (req, res) => {
  const { id } = req.params;
  Sheet.deleteOne({ _id: id }).then(response => res.send(response));
});

router.post('/seq', async (req, res) => {
  const { attached, seq } = req.body;
  const idList = JSON.parse(seq);
  idList.forEach((id, idx) => {
    Sheet.findOneAndUpdate({ _id: id }, { $set: { seq: idx } }, { new: true }, (err, resD) => {
    })
  })
  const sheetList = await Sheet.find({ attached }).sort({ seq: 1 });
  res.send(sheetList)
});

router.post('/edit', (req, res) => {
  const { id, name } = req.body;
  Sheet.findOneAndUpdate({ _id: id }, { $set: { name } }, { new: true }, (err, sheet) => {
    if (err) console.error(err);
    res.send(sheet);
  })
})

module.exports = router;