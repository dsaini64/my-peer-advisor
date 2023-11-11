const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Professor = require('../../data/models/professor_schema');
const Review = require('../../data/models/review_schema');
const Course = require('../../data/models/course_schema');
const Tag = require('../../data/models/tag_schema');
const {validateTextLen, validateRating, validateID, validateDocs} = require('./validators');

// User should be able to see user reviews about professors (MVP feature)
router.get("/:id/reviews", async (req, res) => {
    console.log(req.params);
    const searchID = req.params.id;
    try {
        const professorProfile = await Professor.findById(searchID)
                                                .populate('courses', 'classCode')
                                                .populate('tags', 'tagName')
                                                .exec();
        if (professorProfile === null) {
            res.status(404).send('<h2>Professor ID not found</h2>');
        } else {
            const professorReviews = await Review.find({
                professorID: searchID,
                reviewType: 'professor'})
                .populate('courseID', 'classCode')
                .populate('tags', 'tagName')
                .exec();
            const result = { professor: professorProfile, reviews: professorReviews };
            res.json(result);
        }
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// User should be able to leave a review for a professor (MVP feature)
router.post("/:id/reviews", async (req, res) => {
    const professorIdentifier  = req.params.id;
    const {courseIdentifier, professorRating, professorTags, professorReview} = req.body;

    try {
        // Validate data received from the frontend
        const isProfessorValid = await validateID(Professor, professorIdentifier);
        const isCourseValid = await validateID(Course, courseIdentifier);
        const isRatingValid = validateRating(professorRating);
        const isTextValid = validateTextLen(professorReview);

        if (!isProfessorValid || !isCourseValid) {
            return res.status(400).send('<h2>Database Validation Error</h2>');
        }

        if (!isRatingValid || !isTextValid) {
            return res.status(400).send('<h2>Rating or Text Box Validation Error</h2>');
        }

        if (professorTags.length > 3) {
            return res.status(400).send('<h2>Number of tags exceeded</h2>');
        }

        for (const tagID of professorTags) {
            const isTagIdValid = await validateID(Tag, tagID);
            if (!isTagIdValid) {
                return res.status(400).send('<h2>Database Validation Error</h2>');
            }
        }

        // Create and submit the new review to the db
        const addReview = new Review({
            professorID: professorIdentifier,
            courseID: courseIdentifier,
            rating: professorRating,
            reviewType: 'professor',
            likes: 0,
            dislikes: 0,
            comment: professorReview,
            tags: professorTags,
        });
        await addReview.save();

        // Update the professor properties in the db
        const professor = await Professor.findById(professorIdentifier);

        if(!professor.courses.map(id => id.toString()).includes(courseIdentifier.toString())) {
            professor.courses.push(courseIdentifier);
        }

        professor.ratingCount += 1;
        professor.ratingTotal += professorRating;
        professor.rating = professor.ratingTotal / professor.ratingCount;

        for (const tagID of professorTags) {
            if(!professor.tags.map(id => id.toString()).includes(tagID.toString())) {
                professor.tags.push(tagID);
            }
        }

        await professor.save();

        // Update the course properties in the db
        const course = await Course.findById(courseIdentifier);

        if(!course.professors.map(id => id.toString()).includes(professorIdentifier.toString())) {
            course.professors.push(professorIdentifier);
        }

        await course.save();

        return res.status(201).json("Success!! Review has been submited");

    } catch (err) {
        console.log(err)
        return res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// Provides an endpoint that serves all professor names
router.get("/names", async (req, res) => {
    try {
        const result = await Professor.find({}, 'professorName').exec();
        res.json(result);
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// User should be able to search professors (MVP feature)
router.get("/", async (req, res) => {
    console.log(req.query);
    const searchName = req.query.search;
    
    if(!searchName || searchName.trim() === '') {
        return res.status(404).send('<h2>Please enter a valid search term</h2>');
    }

    try {
        const result = await Professor.find({ professorName: {$regex: searchName, $options:'i'} },
                                            'professorName department ratingCount rating').exec();
        if (Object.keys(result).length === 0) {
            return res.status(404).send('<h2>No professor matches your search</h2>');
        } else {
            return res.json(result);
        }
    } catch (err) {
        return res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

module.exports = router;

