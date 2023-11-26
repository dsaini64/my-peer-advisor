const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../../data/models/review_schema');
const {validateID} = require('./validators');

/**
 * @swagger
 * /api/v1/reviews/{id}/like:
 *   patch:
 *     summary: Like a review
 *     description: Allows a user to like a specific review. Users can only like a review once.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the review to like.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully liked the review.
 *       400:
 *         description: Invalid review ID.
 *       403:
 *         description: You already liked this review.
 *       500:
 *         description: Internal server error.
 */
// User should be able to like a review (High priority feature)
router.patch("/:id/like", async (req, res) => {
    const reviewIdentifier = req.params.id;

    // Check in case user has already liked this review
    if (req.cookies[`liked_${reviewIdentifier}`]) {
        return res.status(403).json({error: "forbidden error", msg: "You already liked this review"});
    }
    
    try {
        // Validate that the review exists
        const isReviewValid = await validateID(Review, reviewIdentifier);
        if (!isReviewValid) {
            return res.status(400).send({error: "validation error", msg: "Invalid review ID"});
        }

        // Perform the like
        const review = await Review.findById(reviewIdentifier);
        review.likes += 1;
        await review.save();

        // Set a cookie
        res.cookie(`liked_${reviewIdentifier}`, true, {maxAge: 2592000, httpOnly: true});
        return res.status(200).json({status: "like success", msg: "Successfully liked the review"});
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/reviews/{id}/dislike:
 *   patch:
 *     summary: Dislike a review
 *     description: Allows a user to dislike a specific review. Users can only dislike a review once.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the review to dislike.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully disliked the review.
 *       400:
 *         description: Invalid review ID.
 *       403:
 *         description: You already disliked this review.
 *       500:
 *         description: Internal server error.
 */
// User should be able to dislike a review (High priority feature)
router.patch("/:id/dislike", async (req, res) => {
    const reviewIdentifier = req.params.id;

    // Check in case user has already disliked this review
    if (req.cookies[`disliked_${reviewIdentifier}`]) {
        return res.status(403).json({error: "forbidden error", msg: "You already disliked this review"});
    }
    
    try {
        // Validate that the review exists
        const isReviewValid = await validateID(Review, reviewIdentifier);
        if (!isReviewValid) {
            return res.status(400).send({error: "validation error", msg: "Invalid review ID"});
        }

        // Perform the dislike
        const review = await Review.findById(reviewIdentifier);
        review.dislikes += 1;
        await review.save();

        // Set a cookie
        res.cookie(`disliked_${reviewIdentifier}`, true, {maxAge: 2592000, httpOnly: true});
        return res.status(200).json({status: "dislike success", msg: "Successfully disliked the review"});
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

module.exports = router;

