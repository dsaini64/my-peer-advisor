"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'
import { RateProfessor, ReviewBox, SelectClass, SelectProfessorTags } from '../../rateComponents';
import { SearchBar2 } from '../../../searchPage/page'
import router from 'next/router';

export default function ProfessorRatingPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [courseIdentifier, setCourseIdentifier] = useState<null | string>(null)
  const [professorRating, setProfessorRating] = useState<null | any>(null)
  const [professorReview, setProfessorReview] = useState<null | string>(null)

  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${params.id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (data === null) return <p>Failed to load</p>

  function passTags (tags: any) {
    setTags(tags)
  }

  function passCourseIdentifier(courseIdentifier: any) {
    setCourseIdentifier(courseIdentifier);
  }

  function passProfessorRating(professorRating: any) {
    setProfessorRating(professorRating);
  }

  function passProfessorReview(professorReview: any) {
    setProfessorReview(professorReview);
  }

  const onSubmit = () => {
    if (courseIdentifier === null || professorRating === null || professorReview === null) {
      alert("Please fill out all required fields");
    } else {
      console.log(courseIdentifier);
      console.log(professorRating);
      console.log(tags);
      console.log(professorReview);
      const body = {
        courseIdentifier: courseIdentifier,
        professorRating: Number(professorRating),
        professorTags: tags,
        professorReview: professorReview
      };

      console.log(body);

      fetch(`http://localhost:9080/api/v1/professors/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.status === 201) {
          alert("Review submitted successfully");
          router.push('/professor/' + params.id);
        } else {
          alert("Failed to submit review");
        }
      });
    }
  };

  return (
    <div className="MPAFormLayout">
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
      <div className="formLayout">
       Rate: <span className="profReviewText">{data.professor.professorName}</span>
          <div>Select class code
            <span className='red-text'>*</span>
            <SelectClass callback={passCourseIdentifier}/>
          </div>
        

        <div>
          Rate your professor
          <span className='red-text'>*
          <RateProfessor callback={passProfessorRating}/></span>
        </div>

        <div className="selectTags">
          Select Tags
        </div>
          <SelectProfessorTags callback={passTags}/>

        <div>Write a review
          <span className='red-text'>*</span>
          <ReviewBox callback={passProfessorReview}/>
        </div>

        <div className='search-bar-2'>
          <button onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>

  );
}

