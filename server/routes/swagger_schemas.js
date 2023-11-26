module.exports = {
    components: {
        schemas: {
            Course: {
                type: "object",
                properties: {
                    courseName: { type: "string" },
                    classCode: { type: "string" },
                    description: { type: "string" },
                    professors: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Professor" }
                    },
                    ratingCount: { type: "number" },
                    ratingTotal: { type: "number" },
                    quarterAvailability: {
                        type: "array",
                        items: { type: "string" }
                    },
                    tags: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Tag" }
                    },
                    rating: { type: "number" }
                }
            },
            Professor: {
                type: "object",
                properties: {
                    professorName: { type: "string" },
                    department: { type: "string" },
                    background: { type: "string" },
                    courses: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Course" }
                    },
                    ratingCount: { type: "number" },
                    ratingTotal: { type: "number" },
                    tags: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Tag" }
                    },
                    rating: { type: "number" }
                }
            },
            Review: {
                type: "object",
                properties: {
                    professorID: { $ref: "#/components/schemas/Professor" },
                    courseID: { $ref: "#/components/schemas/Course" },
                    rating: { type: "number" },
                    reviewType: { type: "string" },
                    likes: { type: "number" },
                    dislikes: { type: "number" },
                    comment: { type: "string" },
                    tags: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Tag" }
                    },
                    date: { type: "string", format: "date-time" }
                }
            },
            Tag: {
                type: "object",
                properties: {
                    tagName: { type: "string" },
                    tagType: { type: "string" }
                }
            }
        }
    }
};