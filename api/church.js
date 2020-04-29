const express = require('express');
const router = express.Router();

const { Church, Counters } = require('../model');
const { addCounter } = require('./fn');


router.post('/', async (req, res) => {
  const { name, attached } = req.body;
  const seq = await Counters.findOneAndUpdate({ "_id": 'churches' }, { $inc: { seq: 1 } }).then((counter) => {
    if (counter !== null) {
      return counter.seq;
    }
    addCounter({ name: 'churches' });
    return 0;
  });

  const church = new Church({ seq, name, attached });
  church.save((err, church) => {
    if (err) console.error(err);
    res.send(church);
  })
});

router.get('/all', (req, res) => {
  Church.find({}).sort({ seq: 1 }).then(church => {
    res.send(church);
  });
});

router.post('/seq', async (req, res) => {
  const { seq } = req.body;
  const idList = JSON.parse(seq);
  idList.forEach((id, idx) => {
    Church.findOneAndUpdate({ _id: id }, { $set: { seq: idx } }, { new: true }, (err, resD) => {
    })
  })
  const churchList = await Church.find().sort({ seq: 1 });
  res.send(churchList);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Church.deleteOne({ _id: id }, (err, response) => {
    console.log(response);
    res.send(response);
  });
})

router.put('/', async (req, res) => {
  const { id, changedName } = req.body;
  Church.findOneAndUpdate({ _id: id }, { $set: { name: changedName } }, { new: true }, (err, resD) => {
    console.log(resD);
  });
  const churchList = await Church.find().sort({ seq: 1 });
  res.send(churchList);
});

module.exports = router;