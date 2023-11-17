// import Image from 'next/image'
// import React from 'react';

// export default function Homepage() {
//   return (
//     <div>
//       <div className='MyPeerAdvisorHeader'>
//         <h1 >My Peer Advisor</h1>
//       </div>
//       <SearchBar />
//     </div>
//   );
// }

// function SearchBar() {
//   return (
//     <div className="search-bar">
//       <input type="text" placeholder="Search for class/professor.." />
//       <button>Search</button>
//       <a href='./profilePage.tsx'> Profile page</a>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function ProfilePage() {
  // call backend for data
  let profName = "Michael Stravinsky"
  let profDesc = "Background: Phd in Computer Science. Expert in Machine Learning and Artificial Intelligence. Worked for NASA."
  let tags = "Caring, Inspirational, Funny"
  let degree  = "Computer Science"
  let ratings = 32
  return (
    <div className="card">
        <div className="card-body profileCardLayout">
          
            <Rating profName={profName} reviewNum={ratings}/>
            <ProfileBody profName={profName} profDesc={profDesc} tags={tags} degree={degree}/>
        </div>
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
    <div>
      <div><h1>{content.profName}</h1></div>
      <div>{content.degree}</div>
      <div><p>{content.profDesc}</p></div>
      <div>Top Tags: {content.tags}</div>
    </div>
  )
}

type profInfoProp = {
  profName: string
  reviewNum: number
}

function Rating(profInfo: profInfoProp){
  // call backend function for rating
  return (
    <div className="rating">
      <div className="ratingHeader">
      <div>
        Rating
      </div>
      <div>
        7.8  {/* computed average */}
      </div>
    </div>
      <p> {profInfo.reviewNum} ratings</p> 
      <div>Rate {profInfo.profName}</div>
      {/* basically rating footer should maybe add more components to make it more clear what each thing does */}
    </div>
  );
}