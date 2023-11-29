"use client"

import React from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import { RateProfessor, ReviewBox, SelectClass, SelectProfessorTags } from '../../rateComponents';


export default function RatingPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)
  const id = "6563b27ff48eb1400c9f7219"

  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (data === null) return <p>Failed to load</p>

  //const pathname = useParams()
  //console.log(pathname)


  return (
    <div>
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
        <div>Rate: {data.professor.professorName}</div>
        <div>Select class code
          <span className='red-text'>*</span>
          <SelectClass />
        </div>
      </div>


      <div>Rate your professor
        <span className='red-text'>*</span>
        <RateProfessor />
      </div>

      <div>Select Tags
        <SelectProfessorTags />
      </div>

      <div>Write a review
        <span className='red-text'>*</span>
        <ReviewBox />
      </div>

      <div>
        <div className='search-bar-2'>Submit</div>
      </div>

    </div>
  );
}

function SubmitButton() {
  const router = useRouter();
  //const []


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

