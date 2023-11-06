// Defines the schema for the Reviews collection
// Creation date is generated automatically and cannot be changed

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    professorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true},
    courseID: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    rating: {type: Number, min: 0, max: 10, required: true},
    reviewType: {type: String, enum: ['professor', 'course'], required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    comment: {type: String, required: true},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    date: {type: Date, immutable: true, default: () => Date.now()}
});

module.exports = mongoose.model('Review', reviewSchema);

