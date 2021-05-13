const{ Schema, model } = require('mongoose')

const schema = new Schema({
    user_name: {
        type: String,
        required: true
    },first_name: {
        type: String,
        required: true
    },last_name: {
        type: String,
        required: true
    },birth_date: {
        type: String,
        required: true
    },email: {
        type: String,
        required: true
    },photo: {
        type: String,
        required: true
    },password: {
        type: String,
        required: true
    }
})

module.exports = model('User', schema)