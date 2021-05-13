const{ Schema, model } = require('mongoose')

const schema = new Schema({
    lobby: {
        type: String,
        required: true
    },lobby_owner: {
        type: String,
        required: true
    }
})

module.exports = model('Lobby', schema)