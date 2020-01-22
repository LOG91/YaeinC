const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

let Church = new Schema({
    name: {
        type: String
    },
    attached: {
        type: String
    }
});

let Sheet = new Schema({
    name: {
        type: String
    },
    section: {
        type: String
    },
    attached: {
        type: String
    },
    cells: [{
        type: Schema.Types.ObjectId,
        ref: 'NetworkCell'
    }]
});

let NetworkCell = new Schema({
    name: {
        type: String
    },
    networkLeaderName: {
        type: String
    },
    gender: {
        type: String
    },
    attached: {
        type: String
    },
    sheetId: {
        type: Schema.Types.ObjectId,
        ref: 'Sheet'
    }
});


const YouthAtt = new Schema({
    att: {
        type: Object, default: {}
    }
}, { minimize: false })


module.exports = {
    Leader: mongoose.model('Leader', Leader),
    YouthAtt: mongoose.model('YouthAtt', YouthAtt),
    Church: mongoose.model('Church', Church),
    Sheet: mongoose.model('Sheet', Sheet),
    NetworkCell: mongoose.model('NetworkCell', NetworkCell)
}