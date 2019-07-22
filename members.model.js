const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Member = new Schema({
    name: {
        type: String
    },
    sec: {
        type: Number
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
    cc: {
        type: Boolean
    },
    mc: {
        type: Boolean
    },
    yc: {
        type: Boolean
    },
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
    dawn: {
        type: Number
    },
    word: {
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
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Member' 
    }],
    youth: {
        type: Schema.Types.ObjectId,
        ref: 'YouthAtt'
    }
});

const YouthAtt = new Schema({
    att: {
        type: Object
    }
})


module.exports = {
    Member: mongoose.model('Member', Member),
    Leader: mongoose.model('Leader', Leader),
    YouthAtt: mongoose.model('YouthAtt', YouthAtt)
}