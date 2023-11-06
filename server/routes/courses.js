const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../data/models/course_schema');

// User should be able to search courses (MVP feature)
router.get("/", async (req, res) => {
    console.log(req.query);
    const searchName = req.query.search;
    try {
        const result = await Course.find({ courseName: {$regex: searchName, $options:'i'} },
                                            'courseName classCode ratingCount rating').exec();
        if(Object.keys(result).length === 0) {
            res.status(200).send('<h2>No course matches your search</h2>');
        } else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

module.exports = router;

