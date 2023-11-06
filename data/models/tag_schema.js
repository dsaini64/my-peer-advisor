// Defines the schema for the Tags collection

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tagName: {type: String, required: true},
    tagType: {type: String, enum: ['professor', 'course'], required: true},
});

module.exports = mongoose.model('Tag', tagSchema);

