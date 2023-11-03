const mongoose = require('mongoose');
const express = require('express');
const Professor = require('../data/models/professor_schema');
const Course = require('../data/models/course_schema');
const Review = require('../data/models/review_schema');
const professorsRouter = require("./routes/professors");
const coursesRouter = require("./routes/courses");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/beta');
    console.log("Connection established!!");
}

const app = express();
app.use(express.json());
app.use("/api/v1/professors", professorsRouter);
app.use("/api/v1/courses", coursesRouter);

main().catch(err => console.log(err));

app.get('/index', (req, res) => {
    res.send("Test, this is the homepage");
});

app.listen(9500, () => {
    console.log('Server is listening on port 9500...');
})

