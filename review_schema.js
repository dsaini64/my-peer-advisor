// Defines the schema for the Reviews collection
// Creation date is generated automatically and cannot be changed
// All the other fields are required

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    professorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true},
    courseID: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    rating: {type: Number, required: true},
    comment: {type: String, required: true},
    date: {type: Date, immutable: true, default: () => Date.now()}
});

module.exports = mongoose.model('Review', reviewSchema);

