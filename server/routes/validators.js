const mongoose = require('mongoose');
// const Professor = require('../../data/models/professor_schema');
// const Review = require('../../data/models/review_schema');
// const Course = require('../../data/models/course_schema');
// const Tag = require('../../data/models/tag_schema');

// async function main() {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/alpha');
//         console.log("Connection established!!");

//         const isValid01 = await validateID(Professor, "6548e41f883b86108147bda0");
//         const isValid02 = await validateID(Professor, "6548e41f883b06108147bda0");

//         console.log(isValid01);  
//         console.log(isValid02);

//         const isValid03 = await validateDocs(Professor, 'professorName', 'Jane Doe');
//         const isValid04 = await validateDocs(Professor, 'professorName', 'abc');

//         console.log(isValid03);  
//         console.log(isValid04);

//     } catch (err) {
//         console.log(err);
//     }
// }

function validateTextLen(textBox) {
    const maxChars = 450;
    const isText = typeof(textBox) === 'string';
    const inBoundaries = textBox.length <= maxChars;
    return isText && inBoundaries;
}

function validateRating(rating) {
    const isNumber = typeof(rating) === 'number';
    const inBoundaries = (rating >= 0 && rating <= 10);
    return isNumber && inBoundaries;
}

async function validateID(model, objectID) {
    try {
        if (!mongoose.Types.ObjectId.isValid(objectID)) {
            console.log("validateID() Failure: Not a valid MongoDB Id");
            return false;
        }

        const result = await model.findById(objectID).exec();
        if (result === null) {
            console.log("validateID() Failure: Id doesn't exist");
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function validateDocs(model, key, searchString) {
    try {
        let query = {};
        query[key] = searchString;

        const result = await model.find(query).exec();
        if (Object.keys(result).length === 0) {
            console.log("validateDocs() Failure: No documents found");
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

//main();

module.exports = {
    validateTextLen,
    validateRating,
    validateID,
    validateDocs
};

