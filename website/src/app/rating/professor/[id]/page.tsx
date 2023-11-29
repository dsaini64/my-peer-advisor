"use client"

import React from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState, useEffect, useContext, createContext } from 'react'
import { RateProfessor, ReviewBox, SelectClass, SelectProfessorTags } from '../../rateComponents';
import { on } from 'events';


export default function RatingPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)
  const [tags, setTags] = useState<null | any>(null)
  const [courseIdentifier, setCourseIdentifier] = useState<null | any>(null)
  const [professorRating, setProfessorRating] = useState<null | any>(null)
  const [professorReview, setProfessorReview] = useState<null | any>(null)

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

  function passCourseIdentifier (courseIdentifier: any) {
    setCourseIdentifier(courseIdentifier)
  }

  function passProfessorRating (professorRating: any) {
    setProfessorRating(professorRating)
  }

  function passProfessorReview (professorReview: any) {
    setProfessorReview(professorReview)
  }

  const onSubmit = () => {
    console.log(courseIdentifier)
    console.log(tags)
  }

  return (
    <div>
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
        <div>Rate: {data.professor.professorName}</div>
        <div>Select class code
          <span className='red-text'>*</span>
          <SelectClass callback={passCourseIdentifier}/>
        </div>
      </div>


      <div>Rate your professor
        <span className='red-text'>*</span>
        <RateProfessor />
      </div>

      <div>Select Tags
        <SelectProfessorTags callback={passTags}/>
      </div>

      <div>Write a review
        <span className='red-text'>*</span>
        <ReviewBox />
      </div>

      <div className='search-bar-2'>
        <button onClick={onSubmit}>Submit</button>
      </div>

    </div>
  );
}

function SubmitButton() {
  const router = useRouter();
  //const courseIdentifier[]


}


function SearchBar2() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
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
  );
}

