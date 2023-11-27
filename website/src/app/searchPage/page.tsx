"use client"


import Image from 'next/image'
import React from 'react';
//import { Button, Typography, } from "antd";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function SearchPage() {
    return (
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
        <ResultList />
      </div>
    );
}

type profileBodyProps = {
    profName: string,
    profDesc: string,
    degree: string,
    tags: string
}
  
function ProfileBody(content: profileBodyProps) {
    return (
      <div className="profileBody">
        <div><h1>{content.profName}</h1></div>
        <div>{content.degree}</div>
        <div><p>{content.profDesc}</p></div>
        <div>Top Tags: {content.tags}</div>
      </div>
    )
}

type profInfoProp = {
    profName: string,
    reviewNum: string,
    ratingNum: string
  }
  
function Rating({profName, reviewNum, ratingNum}: profInfoProp){
    // call backend function for rating
    return (
      <div className="ratingLayout">
        <RatingHeader reviewNum={reviewNum} ratingNum={ratingNum}/>
        <div className="ratingFooter">
            
            {/* basically rating footer, should maybe add more components to make it more clear what each thing does */}
        </div>
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
          {ratingNum}
        </div>
        <div className="reviewNumText"> {reviewNum} ratings</div> 
      </div>
    )
}

type ProfCardProps = {
    profName: string,
    profDesc: string,
    tags: string,
    degree: string,
    ratings: string,
    ratingNum: string
}
  
function ProfCard({profName, ratings, ratingNum, degree, tags, profDesc}:ProfCardProps) {
    const router = useRouter();

    return (
        <div   
            onClick={() => {
                router.push('/profilePage?id=123'); // should be variable later on based on prof id from database
            }}
            className="card">
            <div className="card-body profileCardLayout">
                <Rating profName={profName} reviewNum={ratings} ratingNum={ratingNum}/>
                <ProfileBody profName={profName} profDesc={profDesc} tags={tags} degree={degree}/>
            </div>
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
            placeholder="Search..." />
        <button
            onClick={() => {
                router.push('/searchPage?q=' + search);
            }}
        >Search</button>
      </div>
    );
}

function ResultList() {
    // need to get from database
    let profName = "Michael Stravinsky"
    let profDesc = "Background: Phd in Computer Science. Expert in Machine Learning and Artificial Intelligence. Worked for NASA."
    let tags = "Caring, Inspirational, Funny"
    let degree  = "Computer Science"
    let ratings = "32"
    let ratingNum = "7.8"

    return (
        <div>
            <ProfCard tags={tags} degree={degree} profDesc={profDesc} profName={profName} ratings={ratings} ratingNum={ratingNum} />
            <ProfCard tags={"Unfunny"} degree={"Computer Engineering"} profDesc={"Background: None"} profName={"Freddy Fazbear"} ratings={"9"} ratingNum={"9.9"} />
        </div>
    )
}