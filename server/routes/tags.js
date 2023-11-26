const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tag = require('../../data/models/tag_schema');

/**
 * @swagger
 * /api/v1/tags/professors:
 *   get:
 *     summary: Retrieve all professor tags
 *     description: Provides a list of all tags associated with professors.
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: A list of tags for professors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the tag
 *                   tagName:
 *                     type: string
 *                     description: Name of the tag associated with professors.
 *       500:
 *         description: Internal server error.
 */
// Provides an endpoint that servers all professor tags
router.get("/professors", async (req, res) => {
    try {
        const result = await Tag.find({tagType: 'professor'}, 'tagName').exec();
        res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

/**
 * @swagger
 * /api/v1/tags/courses:
 *   get:
 *     summary: Retrieve all course tags
 *     description: Provides a list of all tags associated with courses.
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: A list of tags for courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the tag
 *                   tagName:
 *                     type: string
 *                     description: Name of the tag associated with courses.
 *       500:
 *         description: Internal server error.
 */
// Provides an endpoint that servers all courses tags
router.get("/courses", async (req, res) => {
    try {
        const result = await Tag.find({tagType: 'course'}, 'tagName').exec();
        res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

module.exports = router;

