const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

let newBook = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        
    },
    comments:{
        type:[String]
    },
    commentcount:{
        type: Number,
        default:0
        
    }

});

module.exports = mongoose.model('books', newBook);