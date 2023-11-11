const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const Professor = require('../data/models/professor_schema');
const Course = require('../data/models/course_schema');
const Review = require('../data/models/review_schema');
const Tag = require('../data/models/tag_schema');
const professorsRouter = require("./routes/professors");
const coursesRouter = require("./routes/courses");
const tagsRouter = require("./routes/tags");
const reviewsRouter = require("./routes/reviews");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/epsilon');
    console.log("Connection established!!");
}

const app = express();
app.use(express.text());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/professors", professorsRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/tags", tagsRouter);
app.use("/api/v1/reviews", reviewsRouter);

main().catch(err => console.log(err));

app.get('/index', (req, res) => {
    res.send("Test, this is the homepage");
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080...');
})

