
import React from 'react';

interface Class {
    name: string;
    department: string;
    professor: Professor;
    description: string;
}

interface Professor {
    name: string;
    department: string;
    description: string;
}

interface ClassPageProps {
    class: Class;
}

const ClassPage: React.FC<ClassPageProps> = ({ class }) => {
    return (
        <div>
            <h1>{class.name}</h1>
            <h2>Instructor: {class.instructor}</h2>
            <p>{class.description}</p>
            <p>Schedule: {class.schedule}</p>
        </div>
    );
};

export default ClassPage;
