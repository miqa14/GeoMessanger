const{ Schema, model } = require('mongoose')

const schema = new Schema({
    lobbyId:{
        type: String,
        required: true
    },MessageOwner:{
        type: String,
        required: true
    },photo:{
        type: String,
        required: true
    },msg:{
        type: String,
        required: true
    }
})

module.exports = model('Message', schema)