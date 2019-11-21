const express = require('express');
const router = express.Router();

const { Leader, Member, YouthAtt } = require('../members.model');


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

router.post('/reset', (req, res) => {
 // const { currentLocation } = req.body;
 Leader.updateMany({}, {$set: { mc: false, cc: false, yc: false } }, () => {
 })
 Member.updateMany({}, {$set: { mc: false, cc: false, yc: false } }, () => {
 })
 // console.log(currentLocation)
 res.send({});
})

router.get('/cells/:cells', async (req, res) => {
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

router.post('/youth/:id', (req, res) => {
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

router.put('/check/member/:id', (req, res) => {
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