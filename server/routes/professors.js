const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Professor = require('../../data/models/professor_schema');
const Review = require('../../data/models/review_schema');

// User should be able to search professors (MVP feature)
router.get("/", async (req, res) => {
    console.log(req.query);
    const searchName = req.query.search;
    try {
        const result = await Professor.find({ professorName: {$regex: searchName, $options:'i'} },
                                            'professorName department ratingCount rating').exec();
        if (Object.keys(result).length === 0) {
            res.status(404).send('<h2>No professor matches your search</h2>');
        } else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// User should be able to see user reviews about professors (MVP feature)
router.get("/:id/reviews", async (req, res) => {
    console.log(req.params);
    const searchID = req.params.id;
    try {
        const professorProfile = await Professor.findById(searchID).exec();
        if (professorProfile === null) {
            res.status(404).send('<h2>Professor ID not found</h2>');
        } else {
            const professorReviews = await Review.find({
                professorID: searchID,
                reviewType: 'professor'
            }).exec();

            const result = { professor: professorProfile, reviews: professorReviews };
            res.json(result);
        }
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

module.exports = router;

