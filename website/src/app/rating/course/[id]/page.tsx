"use client"

import React, { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import { Select, Input, Space } from 'antd';
import type { SelectProps } from 'antd';
import TextArea from 'antd/es/input/TextArea';


export default function CourseRatingPage({ params }: { params: { id: string } }) {

    const [data, setData] = useState<null | any>(null)
    const [isLoading, setLoading] = useState(true)
    const [tags, setTags] = useState<string[]>([])
    const [courseRating, setCourseRating] = useState<null | any>(null)
    const [courseReview, setCourseReview] = useState<string>('')
    const [selectedProfessor, setSelectedProfessor] = useState<string>('');
    const [professors, setProfessors] = useState<{ label: string; value: string }[]>([]);

    const router = useRouter();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(`http://localhost:9080/api/v1/courses/${params.id}/reviews`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    useEffect(() => {
        fetch(`http://localhost:9080/api/v1/professors/names`)
            .then(res => res.json())
            .then(data => {
                const mappedProfessors = data?.map((item: { _id: string; professorName: string }) => ({
                    label: item.professorName,
                    value: item._id,
                })) || [];
                setProfessors(mappedProfessors);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleChangeProfessorChange = (value: string) => {
        setSelectedProfessor(value);
    };

    const handleRatingChange = (value: string) => {
        setCourseRating(value);
    };

    const handleTagsChange = (value: string[]) => {

        if (value.length <= 3) {
            setTags(value);
        } else {
            console.log('You can only select up to 3 items');
        }
    }

    const handleReviewChange = (value: ChangeEvent<HTMLTextAreaElement>) => {
        setCourseReview(value.target.value);
    };

    const tagOptions: SelectProps['options'] = [
        {
            label: "lots-of-homework",
            value: "6563b2c5b8e5ccb84c534c59"
        },
        {
            label: "hard-textbook",
            value: "6563b2c5b8e5ccb84c534c5a"
        },
        {
            label: "industry-oriented",
            value: "6563b2c5b8e5ccb84c534c5b"
        },
        {
            label: "ethics-learning",
            value: "6563b2c5b8e5ccb84c534c5c",
        },
        {
            label: "group-work",
            value: "6563b2c5b8e5ccb84c534c5d"
        }

    ];

    const onSubmit = () => {
        if (selectedProfessor === null || courseRating === null || courseReview === null) {
            alert("Please fill out all required fields");
        } else {
            console.log(selectedProfessor);
            console.log(courseRating);
            console.log(tags);
            console.log(courseReview);
            const body = {
                professorIdentifier: selectedProfessor,
                courseRating: Number(courseRating),
                courseTags: tags,
                courseReview: courseReview
            };

            console.log(body);

            fetch(`http://localhost:9080/api/v1/courses/${params.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then((res) => {
                if (res.status === 201) {
                    alert("Review submitted successfully");
                    router.push('/class/' + params.id);
                } else {
                    alert("Failed to submit review");
                }
            });
        }
    };

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {data === null && <p>Failed to load</p>}
            {!isLoading && data !== null && (
                <div>
                    <div>
                        <h1>My Peer Advisor</h1>
                        <div className="search-bar-2">
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                value={search}
                                placeholder="Search..." />
                            <button
                                onClick={() => {
                                    router.push('/searchPage?q=' + search);
                                }}
                            >Search</button>
                        </div>
                        <div>Rate: {data.course.classCode} | {data.course.courseName}</div>
                        <div>Select professor
                            <span className='red-text'>*</span>
                            <Select
                                showSearch
                                placeholder="Select a professor"
                                optionFilterProp=""
                                onChange={handleChangeProfessorChange}
                                value={selectedProfessor}
                                filterOption={filterOption}
                                options={professors}
                            />
                        </div>
                    </div>

                    <div>Rate the course
                        <span className='red-text'>*</span>
                        <Select
                            placeholder="Rate your professor"
                            onChange={handleRatingChange}
                            value={courseRating}
                            options={[
                                { label: '1', value: '1' },
                                { label: '2', value: '2' },
                                { label: '3', value: '3' },
                                { label: '4', value: '4' },
                                { label: '5', value: '5' },
                                { label: '6', value: '6' },
                                { label: '7', value: '7' },
                                { label: '8', value: '8' },
                                { label: '9', value: '9' },
                                { label: '10', value: '10' },

                            ]}
                        />
                    </div>

                    <div>Select Tags
                        <Space style={{ width: '100%' }} direction="vertical">
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}

                                value={tags}
                                onChange={handleTagsChange}
                                options={tagOptions}
                            />
                        </Space>
                    </div>

                    <div>Write a review
                        <span className='red-text'>*</span>
                        <>
                            <br />
                            <br />
                            <TextArea
                                rows={3}
                                placeholder="What would you like to say?"
                                maxLength={450}
                                onChange={handleReviewChange}
                                value={courseReview}
                            />
                        </>
                    </div>

                    <div className='search-bar-2'>
                        <button onClick={onSubmit}>Submit</button>
                    </div>

                </div>
            )}
        </div>


    );
}
