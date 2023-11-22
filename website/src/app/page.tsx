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
import { Button, Typography, } from "antd";

const { Paragraph } = Typography

export default function ProfilePage() {
  // call backend for data
  let profName = "Michael Stravinsky"
  let profDesc = "Background: Phd in Computer Science. Expert in Machine Learning and Artificial Intelligence. Worked for NASA."
  let tags = "Caring, Inspirational, Funny"
  let degree  = "Computer Science"
  let ratings = "32"
  let ratingNum = "7.8"
  let studentRatingNum = 5
  let userRatingNum = ["9.0", "6.5", "8.3", "7.3"]
  let userCourseName = "CSCI 187"
  let userDesc = "Umm Kulthum’s rise to fame was a very interesting journey. She was born on December 31st 1898, and was raised in a very small village in Egypt. Her family was very poor so she never had much growing up. The one thing she did had, which is also the thing that would carry her to fame, was her incredible voice. During the years Kulthum was growing up as a young women, most of the contemporary Arabic singers at the time were male. In fact, most of the singers she looked up to were male as well. Women played mostly a secondary role in regards to music, but things were much different for Kulthum. Her incredible voice made her stand out substantially from not only female singers but males singers as well. Many people who have heard Kulthum’s voice live, have commented on its beauty and fullness. Although gender roles were very much prominent during the years she was alive, it didn’t really seem to apply to her. Many people loved Umm Kulthum and her music."
  let userTags = "ready for class, lots of reading, caring, wants you to learn"
  return (
    <div className="profilePageLayout" >
      <ProfCard tags={tags} degree={degree} profDesc={profDesc} profName={profName} ratings={ratings} ratingNum={ratingNum} />
      <div className="numOfUserReviews">{studentRatingNum} User Reviews</div>
      <div>
        <UserCard userCourseName={userCourseName} userDesc={userDesc} userTags={userTags} ratingNum={userRatingNum[0]} />
        <UserCard userCourseName={userCourseName} userDesc={userDesc} userTags={userTags} ratingNum={userRatingNum[1]} />
        <UserCard userCourseName={userCourseName} userDesc={userDesc} userTags={userTags} ratingNum={userRatingNum[2]} />
        <UserCard userCourseName={userCourseName} userDesc={userDesc} userTags={userTags} ratingNum={userRatingNum[3]} />
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
      <Button type="link" className="align-self-end">Rate {profName}</Button>
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

type userRatingProps = {
  ratingNum: string
}

function UserRating({ratingNum}: userRatingProps) {
  return (
      <div className="userRatingLayout">
       <div className="userRatingHeader">
          <div className="userRatingText">
            Rating
          </div>
          <div className="userRatingNumberText">
            {ratingNum}
          </div>
        </div>
    </div>)
}

type userBodyProps = {
  userDesc: string,
  userTags: string,
  userCourseName: string
}

function UserBody({userDesc, userTags, userCourseName}:userBodyProps) {
  return (
    <div className="userProfileBody">
      <div><h1>{userCourseName}</h1></div>
      <div><p>{userDesc}</p></div>
      <div>Top Tags: {userTags}</div>
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
  return (
    <div className="card">
    <div className="card-body profileCardLayout">
        <Rating profName={profName} reviewNum={ratings} ratingNum={ratingNum}/>
        <ProfileBody profName={profName} profDesc={profDesc} tags={tags} degree={degree}/>
    </div>
</div>
  )
}

type UserCardProps = {
  userCourseName: string,
  userDesc: string,
  userTags: string,
  ratingNum: string
}

function UserCard({userCourseName, userDesc, userTags, ratingNum}: UserCardProps){
  return (
    <div className="card">
      <div className="card-body profileCardLayout">
        <UserRating ratingNum={ratingNum}/>
        <UserBody userCourseName={userCourseName} userDesc={userDesc} userTags={userTags}/>
      </div>
    </div>
  )
}

// need to resolve routing issue