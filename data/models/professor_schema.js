// Defines the schema for the Professors Collection

const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    professorName: {type: String, required: true},
    department: {type: String, required: true},
    background: {type: String, required: true},
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
    ratingCount: {type: Number, default: 0, required: true},
    ratingTotal: {type: Number, default: 0, required: true},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
    rating: {type: Number, min: 0, max: 10, default: null}
});

module.exports = mongoose.model("Professor", professorSchema);

