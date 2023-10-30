// Defines the schema for the Courses collection
// professorID, quarterAvailability, tags and rating are empty by default
// Everything else is required

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {type: String, required: true},
    classCode: {type: String, required: true},
    professorID: {type: mongoose.Schema.Types.ObjectId, ref: 'Professor', default: null},
    quarterAvailability: {type: [String], default: []},
    tags: {type: [String], default: []},
    rating: {type: Number, default: null}
});

module.exports = mongoose.model('Course', courseSchema);

