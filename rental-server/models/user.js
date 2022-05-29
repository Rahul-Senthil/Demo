const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email_id: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
