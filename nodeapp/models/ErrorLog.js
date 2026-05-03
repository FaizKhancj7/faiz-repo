const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    stack: {
        type: String
    },
    statusCode: {
        type: Number,
        default: 500
    },
    path: {
        type: String
    },
    method: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
