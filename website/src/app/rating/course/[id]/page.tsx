"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import { Select } from 'antd';
import type { SelectProps } from 'antd';


export default function CourseRatingPage({ params }: { params: { id: string } }) {

    const [data, setData] = useState<null | any>(null)
    const [isLoading, setLoading] = useState(true)
    const [tags, setTags] = useState<null | any>(null)
    const [professorIdentifier, setProfessorIdentifier] = useState<null | any>(null)
    const [courseRating, setCourseRating] = useState<null | any>(null)
    const [courseReview, setCourseReview] = useState<null | any>(null)

    const router = useRouter();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(`http://localhost:9080/api/v1/courses/${params.id}/reviews`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            fetch(`http://localhost:9080/api/v1/courses/codes`)
            .then(res => res.json())
            .then(data => {
                const codes: string[] = data?.map((item: { _id: string; classCode: string }) => item.classCode);
                const codesMap: Map<string, string> = new Map();
                data?.forEach((item: { _id: string; classCode: string }) => {
                    codesMap.set(item.classCode, item._id);
                });
                setClassCodes(codes);
                setCodesToId(codesMap);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (data === null) return <p>Failed to load</p>

    const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
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
                        filterOption={filterOption}
                        //options={data}
                    />
                </div>
            </div>

            <div>Rate the course
                <span className='red-text'>*</span>
                {/* <RateProfessor /> */}
            </div>

            <div>Select Tags
                {/* <SelectProfessorTags /> */}
            </div>

            <div>Write a review
                <span className='red-text'>*</span>
                {/* <ReviewBox /> */}
            </div>

            <div className='search-bar-2'>
                {/* <button onClick={onSubmit}>Submit</button> */}
            </div>

        </div>
    );
}