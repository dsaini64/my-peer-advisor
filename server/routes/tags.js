const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tag = require('../../data/models/tag_schema');

// Provides an endpoint that servers all professor tags
router.get("/professors", async (req, res) => {
    try {
        const result = await Tag.find({tagType: 'professor'}, 'tagName').exec();
        res.json(result);
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

// Provides an endpoint that servers all courses tags
router.get("/courses", async (req, res) => {
    try {
        const result = await Tag.find({tagType: 'course'}, 'tagName').exec();
        res.json(result);
    } catch (err) {
        return res.status(500).json({error: "server error", msg: "Internal server error"});
    }
});

module.exports = router;

