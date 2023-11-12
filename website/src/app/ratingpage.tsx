
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

const ClassPage: React.FC<ClassPageProps> = ({ class: classProp }) => {
    return (
        <div>
            <h1>{classProp.name}</h1>
            <h2>Instructor: {classProp.professor?.name}</h2>
            <p>{classProp.description}</p>
        </div>
    );
};

export default ClassPage;
