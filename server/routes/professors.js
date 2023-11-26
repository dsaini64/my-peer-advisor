const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Professor = require('../../data/models/professor_schema');
const Review = require('../../data/models/review_schema');
const Course = require('../../data/models/course_schema');
const Tag = require('../../data/models/tag_schema');
const {validateTextLen, validateRating, validateID, validateDocs} = require('./validators');

/**
 * @swagger
 * /api/v1/professors/{id}/reviews:
 *   get:
 *     summary: Retrieve professor profile and reviews for a specific professor
 *     description: Fetches all the professor fields, as well as reviews associated with 
 *                  the given professor by its ID.
 *     tags:
 *       - Professors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the professor.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An object "professor" with all the profesor fields and 
 *                      an object "reviews" with the list of reviews for the specified professor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 professor:
 *                   $ref: '#/components/schemas/Professor'
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Professor ID not found.
 *       500:
 *         description: Internal server error.
 */
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
            return res.status(404).json({error: "not found", msg: "Professor ID not found"});
        } else {
            const professorReviews = await Review.find({
                professorID: searchID,
                reviewType: 'professor'})
                .populate('courseID', 'classCode')
                .populate('tags', 'tagName')
                .exec();
            const result = { professor: professorProfile, reviews: professorReviews };
            return res.status(200).json(result);
        }
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/professors/{id}/reviews:
 *   post:
 *     summary: Submit a review for a specific professor
 *     description: Allows users to post a review for a professor, including rating, associated course, and any relevant tags.
 *     tags:
 *       - Professors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the professor to be reviewed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseIdentifier:
 *                 type: string
 *                 description: ID of the course associated with the review.
 *               professorRating:
 *                 type: number
 *                 format: double
 *                 description: Numeric rating for the professor.
 *               professorTags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tag IDs relevant to the review.
 *               professorReview:
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
            return res.status(400).json({error: "validation error", msg: "Invalid Professor or Course ID"});
        }

        if (!isRatingValid || !isTextValid) {
            return res.status(400).json({error: "validation error", msg: "Rating or text box out of bounds"});
        }

        if (professorTags.length > 3) {
            return res.status(400).json({error: "validation error", msg: "Number of tags exceeded"});
        }

        for (const tagID of professorTags) {
            const isTagIdValid = await validateID(Tag, tagID);
            if (!isTagIdValid) {
                return res.status(400).json({error: "validation error", msg: "Invalid tag ID"});
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

        return res.status(201).json({status: "post success", msg: "Review successfully submitted"});

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/professors/names:
 *   get:
 *     summary: Retrieve a list of all professor names
 *     description: Provides a list of names of all professors in the database.
 *     tags:
 *       - Professors
 *     responses:
 *       200:
 *         description: A list of professor names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the professor.   
 *                   professorName:
 *                     type: string
 *                     description: Name of the professor.
 *       500:
 *         description: Internal server error.
 */
// Provides an endpoint that serves all professor codes
router.get("/names", async (req, res) => {
    try {
        const result = await Professor.find({}, 'professorName').exec();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/professors:
 *   get:
 *     summary: Search for professors
 *     description: Allows searching for professors by name and/or tags.
 *     tags:
 *       - Professors
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: The search string. Can include professor names and tags prefixed with 'tag:'.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of professors matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   professorName:
 *                     type: string
 *                   department:
 *                     type: string
 *                   ratingCount:
 *                     type: number
 *                   rating:
 *                     type: number
 *       404:
 *         description: Please enter a valid search term |
 *                      Please enter valid tag names |
 *                      No professor matches your search
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
        // Since the tags property of a Professor document stores a list of tag IDs instead
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
        if (searchName) {
            searchQuery['professorName'] = {$regex: searchName, $options: 'i'};
        }
        if (searchIDS.length > 0) {
            searchQuery['tags'] = {$all: searchIDS};
        }

        const result = await Professor.find(searchQuery,
                                            'professorName department ratingCount rating').exec();
        if (Object.keys(result).length === 0) {
            return res.status(404).json({error: "not found", msg: "No professor matches your search"});
        } else {
            return res.status(200).json(result);
        }
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

module.exports = router;

