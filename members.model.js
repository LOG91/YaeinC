const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Member = new Schema({
    name: {
        type: String
    },
    section: {
        type: String
    },
    nation: {
        type: String
    },
    cc: {
        type: Boolean
    },
    mc: {
        type: Boolean
    },
    yc: {
        type: Boolean
    }
})

let Leader = new Schema({
    name: {
        type: String
    },
    section: {
        type: String
    },
    cellName: {
        type: String
    },
    cellNameKr: {
        type: String
    },
    age: {
        type: Number
    },
    cc: {
        type: Boolean
    },
    mc: {
        type: Boolean
    },
    yc: {
        type: Boolean
    },
    members: [Member],

    

})


module.exports = mongoose.model('Leader', Leader);