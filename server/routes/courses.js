const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../../data/models/course_schema');

router.get("/", async (req, res) => {
    console.log(req.query.search);
    const searchName = req.query.search;
    try {
        const result = await Course.find({ courseName: {$regex: searchName, $options:'i'} }).exec();
        if(Object.keys(result).length === 0) {
            res.status(404).send('<h2> No professor matches your search</h2>');
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(500).send('<h2>Internal Server Error</h2>');
    }
});

module.exports = router;

