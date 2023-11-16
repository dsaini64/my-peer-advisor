import { useState, useEffect } from "react";

export default function ProfilePage() {
  // call backend for data
  let profName = "Michael Stravinsky"
  let profDesc = "Background: Phd in Computer Science. Expert in Machine Learning and Artificial Intelligence. Worked for NASA."
  let tags = "Caring, Inspirational, Funny"
  let degree  = "Computer Science"
  return (
    <div className="card">
        <div className="card-body">
            <ProfileBody profName={profName} profDesc={profDesc} tags={tags} degree={degree}/>
            <Rating profName={profName}/>
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

type profNameProp = {
  profName: string
}

function Rating(profName: profNameProp){
  // call backend function for rating
  return (
    <div>
      <div>
        Rating
      </div>
      <div>
        7.8  {/* computed average */}
        <p> computed number of user reviews</p>
      </div>
      <div>Rate {profName.profName}</div>
    </div>
  );
}