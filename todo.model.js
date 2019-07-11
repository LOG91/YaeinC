const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
});
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
    nation: {
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

module.exports = mongoose.model('Todo', Todo);
module.exports = mongoose.model('Leader', Leader);