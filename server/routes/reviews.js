const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../../data/models/review_schema');
const {validateID} = require('./validators');

// User should be able to like a review (High priority feature)
router.patch("/:id/like", async (req, res) => {
    const reviewIdentifier = req.params.id;

    // Check in case user has already liked this review
    if (req.cookies[`liked_${reviewIdentifier}`]) {
        return res.status(403).json("You already liked this review!!!");
    }
    
    try {
        // Validate that the review exists
        const isReviewValid = await validateID(Review, reviewIdentifier);
        if (!isReviewValid) {
            return res.status(400).send('<h2>Review not found</h2>');
        }

        // Perform the like
        const review = await Review.findById(reviewIdentifier);
        review.likes += 1;
        await review.save();

        // Set a cookie
        res.cookie(`liked_${reviewIdentifier}`, true, {maxAge: 2592000, httpOnly: true});
        return res.status(200).json("Like successful!!");
    } catch (err) {
        console.log(err)
        return res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

// User should be able to dislike a review (High priority feature)
router.patch("/:id/dislike", async (req, res) => {
    const reviewIdentifier = req.params.id;

    // Check in case user has already disliked this review
    if (req.cookies[`disliked_${reviewIdentifier}`]) {
        return res.status(403).json("You already disliked this review!!!");
    }
    
    try {
        // Validate that the review exists
        const isReviewValid = await validateID(Review, reviewIdentifier);
        if (!isReviewValid) {
            return res.status(400).send('<h2>Review not found</h2>');
        }

        // Perform the dislike
        const review = await Review.findById(reviewIdentifier);
        review.dislikes += 1;
        await review.save();

        // Set a cookie
        res.cookie(`disliked_${reviewIdentifier}`, true, {maxAge: 2592000, httpOnly: true});
        return res.status(200).json("Dislike successful!!");
    } catch (err) {
        console.log(err)
        return res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

module.exports = router;

