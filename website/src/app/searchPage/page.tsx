"use client"

import Image from 'next/image'
import React from 'react';
//import { Button, Typography, } from "antd";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  //console.log(query)
  const searchparams = useSearchParams();
  const query = searchparams.get('q');
  const router = useRouter();
    return (
      <div>
        <h1
          onClick={() => {
            router.push('/'); // should be variable later on based on prof id from database
          }}
        >My Peer Advisor</h1>
        <SearchBar2 />
        <div className="result-columns">
          <div className="professor-list">
            <ResultListProf querystring={query}/>
          </div>
          <div className="course-list">
            <ResultListCourse querystring={query} />
          </div>
        </div>
      </div>
    );
}

type profileBodyProps = {
    profName: string,
    department: string,
}
  
function ProfileBody(content: profileBodyProps) {
    return (
      <div className="profileBody">
        <div><h1>{content.profName}</h1></div>
        <div><p>{content.department}</p></div>
      </div>
    )
}

type profInfoProp = {
    profName: string,
    reviewNum: string,
    ratingNum: string
  }
  
function Rating({profName, reviewNum, ratingNum}: profInfoProp){
    return (
      <div className="ratingLayout">
        <RatingHeader reviewNum={reviewNum} ratingNum={ratingNum}/>
      </div>
    );
}

type ratingHeaderProps = {
    reviewNum: string,
    ratingNum: string
}
  
function RatingHeader({reviewNum, ratingNum}:ratingHeaderProps){
    return (
      <div className="ratingHeader">
        <div className="ratingText">
          Rating
        </div>
        <div className="ratingNumberText">
          {ratingNum=== null? 
            <div>N/A</div>
            :
            <div>{(parseFloat(ratingNum)).toFixed(1)}</div>
          }
        </div>
        <div className="reviewNumText"> {reviewNum} ratings</div> 
      </div>
    )
}

type ProfCardProps = {
    profName: string,
    department: string,
    ratings: string,
    ratingNum: string,
    id: string
}
  
function ProfCard({profName, ratings, ratingNum, department, id}:ProfCardProps) {
    const router = useRouter();

    return (
        <div   
            onClick={() => {
                router.push('/profilePage/' + id); // should be variable later on based on prof id from database
            }}
            className="card">
            <div className="card-body profileCardLayout">
                <Rating profName={profName} reviewNum={ratings} ratingNum={ratingNum}/>
                <ProfileBody profName={profName} department={department}/>
            </div>
        </div>
    )
}

function ResultListProf({querystring}: Query) {
    //fetch('http://localhost:9080/api/v1/professors?search=' + search)
    const [data, setData] = useState<null | any>(null)
    const [isLoading, setLoading] = useState(true)
  
    useEffect(() => {
      setLoading(true);
      fetch(`http://localhost:9080/api/v1/professors?search=` + querystring)
        .then(res => res.json())
        .then(data => {
          setData(data)
          setLoading(false)
        });
    }, [querystring])
  
    //console.log(data)
    if (isLoading) return <p>Loading...</p>
    if (data === null) return <p>Failed to load</p>
  
    /*
    for (const element of data) {
      console.log(element);
    }
    */

    if (!(data.constructor === Array)) {
      return <div>
        <h1>Professors</h1>
        <p>No results</p>
      </div>
    }
  
    return (
        <div>
          <h1>Professors</h1>
          {data.map((object: { professorName: string; department: string; ratingCount: string; rating: string; _id: string; }, index: React.Key | null | undefined) => (
            <ProfCard profName={object.professorName} department={object.department} ratings={object.ratingCount} ratingNum={object.rating} id={object._id} />
          ))}
        </div>
    )
}

type courseBodyProps = {
  courseName: string,
  classCode: string
}

function CourseBody(content: courseBodyProps) {
  return (
    <div className="profileBody">
      <div><h1>{content.courseName}</h1></div>
      <div><p>{content.classCode}</p></div>
    </div>
  )
}

type CourseCardProps = {
  courseName: string,
  classCode: string,
  id: string,
  ratings: string,
  ratingNum: string
}

function CourseCard({courseName, ratings, ratingNum, id, classCode}:CourseCardProps) {
  const router = useRouter();

  return (
      <div   
          onClick={() => {
              router.push('/profilePage/' + id); // should be variable later on based on prof id from database
          }}
          className="card">
          <div className="card-body profileCardLayout">
              <Rating profName={courseName} reviewNum={ratings} ratingNum={ratingNum}/>
              <CourseBody courseName={courseName} classCode={classCode}/>
          </div>
      </div>
  )
}

type Query = {
  querystring: string | null
}

function ResultListCourse({querystring}: Query) {
  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:9080/api/v1/courses/?search=` + querystring)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      });
  }, [querystring])

  //console.log(data)
  if (isLoading) return <p>Loading...</p>
  if (data === null) return <p>Failed to load</p>

  /*
  for (const element of data) {
    console.log(element);
  }
  */
  console.log(typeof data)

  if (!(data.constructor === Array)) {
    return <div>
      <h1>Courses</h1>
      <p>No results</p>
    </div>
  }

  //used for testing
  //const obj1 = data[0]
  //obj1.rating = "4"

  return (
      <div>
        <h1>Courses</h1>
        {data.map((object: { classCode: string; courseName: string; ratingCount: string; rating: string; _id: string; }) => (
            <CourseCard classCode={object.classCode} courseName={object.courseName} ratings={object.ratingCount} ratingNum={object.rating} id={object._id} />
        ))}
      </div>
  )
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
        placeholder='Search for class/professor...'/>
      <button
        onClick={() => {
          if (search == "") {
            return;
          }
          else 
          {
          router.push('/searchPage?q=' + search);
          }
        }}
      >Search</button>
    </div>
  );
}