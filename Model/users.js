//init
const mongoose = require('mongoose');

//Schema
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    registrationDate : {
        type : Date,
        default : Date.now()
    },
    notes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'notes'
    }]
});

//Module Export
module.exports = mongoose.model('users', userSchema);