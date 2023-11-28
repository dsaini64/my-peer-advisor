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
const swaggerSchemas = require("./routes/swagger_schemas");
const cors = require('cors');

// Setup swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// OpenAPI Object
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: "myPeerAdvisor API",
        version: '1.0.0',
        description: "API for managing professors, courses, reviews and tags"
    },
    servers: [{url: 'http://localhost:9080', description: 'Local Test Server'}],
    components: swaggerSchemas.components
};

const options = {
    swaggerDefinition,
    apis: [
        'server/routes/professors.js',
        'server/routes/courses.js',
        'server/routes/tags.js',
        'server/routes/reviews.js',
        'server/routes/swagger_schemas.js'
    ]
};

// Start swagger documentation
const swaggerSpec = swaggerJSDoc(options);

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/omega');
    console.log("Connection established!!");
}

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend to access the server
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent
}));

app.use(express.text());
app.use(express.json());
app.use(cookieParser());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/v1/professors", professorsRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/tags", tagsRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use((req, res) => {
    res.status(404).json({error: "not found", msg: "API route not found"});
});

main().catch(err => console.log(err));

app.listen(9080, () => {
    console.log('Server is listening on port 9080...');
})

