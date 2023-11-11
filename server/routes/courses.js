const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../data/models/course_schema');
const Professor = require('../../data/models/professor_schema');
const Review = require('../../data/models/review_schema');
const Tag = require('../../data/models/tag_schema');
const {validateTextLen, validateRating, validateID, validateDocs} = require('./validators');

// User should be able to see user reviews about courses (MVP feature)
router.get("/:id/reviews", async (req, res) => {
    console.log(req.params);
    const searchID = req.params.id;
    try {
        const courseProfile = await Course.findById(searchID)
                                                .populate('professors', 'professorName')
                                                .populate('tags', 'tagName')
                                                .exec();
        if (courseProfile === null) {
            res.status(404).send('<h2>Course ID not found</h2>');
        } else {
            const courseReviews = await Review.find({
                courseID: searchID,
                reviewType: 'course'})
                .populate('professorID', 'professorName')
                .populate('tags', 'tagName')
                .exec();
            const result = { course: courseProfile, reviews: courseReviews };
            res.json(result);
        }
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// User should be able to leave a review for a course (MVP feature)
router.post("/:id/reviews", async (req, res) => {
    const courseIdentifier = req.params.id;
    const {professorIdentifier, courseRating, courseTags, courseReview} = req.body;

    try {
        // Validate data received from the frontend
        const isProfessorValid = await validateID(Professor, professorIdentifier);
        const isCourseValid = await validateID(Course, courseIdentifier);
        const isRatingValid = validateRating(courseRating);
        const isTextValid = validateTextLen(courseReview);

        if (!isProfessorValid || !isCourseValid) {
            return res.status(400).send('<h2>Database Validation Error</h2>');
        }

        if (!isRatingValid || !isTextValid) {
            return res.status(400).send('<h2>Rating or Text Box Validation Error</h2>');
        }

        if (courseTags.length > 3) {
            return res.status(400).send('<h2>Number of tags exceeded</h2>');
        }

        for (const tagID of courseTags) {
            const isTagIdValid = await validateID(Tag, tagID);
            if (!isTagIdValid) {
                return res.status(400).send('<h2>Database Validation Error</h2>');
            }
        }

        // Create and submit the new review to the db
        const addReview = new Review({
            professorID: professorIdentifier,
            courseID: courseIdentifier,
            rating: courseRating,
            reviewType: 'course',
            likes: 0,
            dislikes: 0,
            comment: courseReview,
            tags: courseTags,
        });
        await addReview.save();

        // Update the course properties in the db
        const course = await Course.findById(courseIdentifier);

        if(!course.professors.map(id => id.toString()).includes(professorIdentifier.toString())) {
            course.professors.push(professorIdentifier);
        }

        course.ratingCount += 1;
        course.ratingTotal += courseRating;
        course.rating = course.ratingTotal / course.ratingCount;

        for (const tagID of courseTags) {
            if(!course.tags.map(id => id.toString()).includes(tagID.toString())) {
                course.tags.push(tagID);
            }
        }

        await course.save();

        // Update the professor properties in the db
        const professor = await Professor.findById(professorIdentifier);

        if(!professor.courses.map(id => id.toString()).includes(courseIdentifier.toString())) {
            professor.courses.push(courseIdentifier);
        }

        await professor.save();

        return res.status(201).json("Success!! Review has been submited");

    } catch (err) {
        console.log(err)
        return res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// Provides an endpoint that serves all class codes
router.get("/codes", async (req, res) => {
    try {
        const result = await Course.find({}, 'classCode').exec();
        res.json(result);
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// User should be able to search courses (MVP feature)
router.get("/", async (req, res) => {
    console.log(req.query);
    const searchName = req.query.search;

    if(!searchName || searchName.trim() === '') {
        return res.status(404).send('<h2>Please enter a valid search term</h2>');
    }

    try {
        const result = await Course.find({ courseName: {$regex: searchName, $options:'i'} },
                                            'courseName classCode ratingCount rating').exec();
        if(Object.keys(result).length === 0) {
            return res.status(200).send('<h2>No course matches your search</h2>');
        } else {
            return res.json(result);
        }
    } catch (err) {
        return res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

module.exports = router;

