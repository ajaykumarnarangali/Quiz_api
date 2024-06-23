const mongoose = require('mongoose');


const responseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    response: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            selectedOption: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Response', responseSchema);
