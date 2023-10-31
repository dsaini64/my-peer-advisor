// Defines the schema for the Professors Collection
// Tags and Rating fields are empty by default
// Everything else is required

const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    professorName: {type: String, required: true},
    department: {type: String, required: true},
    background: {type: String, required: true},
    tags: {type: [String], default: []},
    rating: {type: Number, min: 0, max: 10, default: null}
});

module.exports = mongoose.model("Professor", professorSchema);

