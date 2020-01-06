const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Member = new Schema({
    name: {
        type: String
    },
    gender: {
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
    youth: {
        type: Schema.Types.ObjectId,
        ref: 'YouthAtt'
    }
})

let Leader = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    attached: {
        type: String
    },
    isNetworkLeader: {
        type: Boolean
    },
    isLeader: {
        type: Boolean
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
        ref: 'Leader'
    }],
    youth: {
        type: Schema.Types.ObjectId,
        ref: 'YouthAtt'
    }
});

const YouthAtt = new Schema({
    att: {
        type: Object, default: {}
    }
}, { minimize: false })


module.exports = {
    Member: mongoose.model('Member', Member),
    Leader: mongoose.model('Leader', Leader),
    YouthAtt: mongoose.model('YouthAtt', YouthAtt)
}