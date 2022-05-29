const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    author_id: {
        type: String,
    },
    imgUrl: {
        type: Array
    },
    address: {
        type: String,
    },
    mobile: {
        type: String,
    },
    rent: {
        type: String,
    },
    description: {
        type: String
    },
    date: {
        type: String
    }
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;