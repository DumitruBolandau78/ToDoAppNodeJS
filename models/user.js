const {model, Schema} = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    goals: [
        {
            goal: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }
    ]
});

module.exports = model('User', userSchema);