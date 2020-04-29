const { Counters } = require('../model');

function addCounter({ name }) {
  const counter = new Counters({ "_id": name, seq: 0 });
  counter.save((err, count) => {
    if (err) console.error(err);
  })
}

module.exports = { addCounter }