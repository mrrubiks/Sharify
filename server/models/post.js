const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imgURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    upVotes: {
        type: Number,
        default: 0
    },
});

postSchema.methods.upVote = function () {
    this.upVotes += 1;
    return this.save();
}

exports.Post = mongoose.model('Post', postSchema);

