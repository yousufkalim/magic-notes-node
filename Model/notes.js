//init
const mongoose = require('mongoose');


//Model Schema
const notesSchema = mongoose.Schema({
    title: String,
    note : String,
    important : {
        type : Boolean,
        default : false
    },
    dateCreated : {
        type : Date,
        default : Date.now()
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    }
});

//Module exported and required in /controllers/notes.js
module.exports = mongoose.model('notes', notesSchema);