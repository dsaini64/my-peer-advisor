const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../data/models/course_schema');
const Professor = require('../../data/models/professor_schema');
const Review = require('../../data/models/review_schema');
const Tag = require('../../data/models/tag_schema');
const {validateTextLen, validateRating, validateID, validateDocs} = require('./validators');

/**
 * @swagger
 * /api/v1/courses/{id}/reviews:
 *   get:
 *     summary: Retrieve course profile and reviews for a specific course
 *     description: Fetches all the course fields, as well as reviews associated with
 *                  the given course by its ID.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the course.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An object "course" with all the course fields and 
 *                      an object "reviews" with the list of reviews for the specified course.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Course ID not found.
 *       500:
 *         description: Internal server error.
 */
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
            return res.status(404).json({error: "not found", msg: "Course ID not found"});
        } else {
            const courseReviews = await Review.find({
                courseID: searchID,
                reviewType: 'course'})
                .populate('professorID', 'professorName')
                .populate('tags', 'tagName')
                .exec();
            const result = { course: courseProfile, reviews: courseReviews };
            res.status(200).json(result);
        }
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/courses/{id}/reviews:
 *   post:
 *     summary: Submit a review for a specific course
 *     description: Allows users to post a review for a course, including rating, associated professor, and any relevant tags.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the course to be reviewed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               professorIdentifier:
 *                 type: string
 *                 description: ID of the professor teaching the course.
 *               courseRating:
 *                 type: number
 *                 format: double
 *                 description: Numeric rating for the course.
 *               courseTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tag IDs relevant to the review.
 *               courseReview:
 *                 type: string
 *                 description: Detailed text of the review.
 *     responses:
 *       201:
 *         description: Review successfully submitted.
 *       400:
 *         description: Invalid Professor or Course ID |
 *                      Rating or text box out of bounds |
 *                      Number of tags exceeded |
 *                      Invalid tag ID   
 *       500:
 *         description: Internal server error.
 */
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
            return res.status(400).json({error: "validation error", msg: "Invalid Professor or Course ID"});
        }

        if (!isRatingValid || !isTextValid) {
            return res.status(400).json({error: "validation error", msg: "Rating or text box out of bounds"});
        }

        if (courseTags.length > 3) {
            return res.status(400).json({error: "validation error", msg: "Number of tags exceeded"});
        }

        for (const tagID of courseTags) {
            const isTagIdValid = await validateID(Tag, tagID);
            if (!isTagIdValid) {
                return res.status(400).json({error: "validation error", msg: "Invalid tag ID"});
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

        return res.status(201).json({status: "post success", msg: "Review successfully submitted"});

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/courses/codes:
 *   get:
 *     summary: Retrieve a list of all class codes
 *     description: Provides a list of class codes for all courses in the database.
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: A list of class codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the course
 *                   classCode:
 *                     type: string
 *                     description: Class code of the course.
 *       500:
 *         description: Internal server error.
 */
// Provides an endpoint that serves all class codes
router.get("/codes", async (req, res) => {
    try {
        const result = await Course.find({}, 'classCode').exec();
        res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Search for courses
 *     description: Allows searching for courses by name and/or tags.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: The search string. Can include course names and tags prefixed with 'tag:'.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of courses matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   courseName:
 *                     type: string
 *                   classCode:
 *                     type: string
 *                   ratingCount:
 *                     type: number
 *                   rating:
 *                     type: number
 *       404:
 *         description: Please enter a valid search term |
 *                      Please enter valid tag names |
 *                      No course matches your search
 *       500:
 *         description: Internal server error.
 */
// User should be able to search courses (MVP feature)
router.get("/", async (req, res) => {
    console.log(req.query);
    const searchString = req.query.search || '';
    const searchParts = searchString.split(/tag:/i);
    const searchName = searchParts[0].trim();
    const searchTags = searchParts.slice(1).map(tag => tag.trim().toLowerCase());

    if (!searchName && searchTags.length === 0) {
        return res.status(404).json({error: "not found", msg: "Please enter a valid search term"});
    }

    try {
        // Since the tags property of a Course document stores a list of tag IDs instead
        // of a list of tag names, we need to convert the tag names to their respective tag IDs
        let searchIDS = [];
        if (searchTags.length > 0) {
            const matchIDS = await Tag.find( {tagName: {$in: searchTags}}).select('_id').exec();
            searchIDS = matchIDS.map(tag => tag.id);

            if (searchIDS.length === 0 || searchIDS.length !== searchTags.length) {
                return res.status(404).json({error: "not found", msg: "Please enter valid tag names"});
            }
        }

        // Construct the search query
        let searchQuery = {};
        if(searchName) {
            searchQuery['courseName'] = {$regex: searchName, $options: 'i'};
        }
        if (searchIDS.length > 0) {
            searchQuery['tags'] = {$all: searchIDS};
        }

        const result = await Course.find(searchQuery,
                                            'courseName classCode ratingCount rating').exec();
        if(Object.keys(result).length === 0) {
            return res.status(404).json({error: "not found", msg: "No course matches your search"});
        } else {
            return res.status(200).json(result);
        }
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

module.exports = router;

