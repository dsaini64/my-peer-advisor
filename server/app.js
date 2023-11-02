const mongoose = require('mongoose');
const Professor = require('../data/models/professor_schema');
const Course = require('../data/models/course_schema');
const Review = require('../data/models/review_schema');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/beta');
    console.log("Connection established!!");
}

main().catch(err => console.log(err));

