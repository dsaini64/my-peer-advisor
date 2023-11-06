// Defines the schema for the Courses collection

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {type: String, required: true},
    classCode: {type: String, required: true},
    description: {type: String, required: true},
    professors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Professor'}],
    ratingCount: {type: Number, default: 0, required: true},
    ratingTotal: {type: Number, default: 0, required: true},
    quarterAvailability: {type: [String], enum: ['winter', 'spring', 'summer', 'fall'], default: []},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    rating: {type: Number, min: 0, max: 10, default: null}
});

module.exports = mongoose.model('Course', courseSchema);

