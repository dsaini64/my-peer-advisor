"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";

type ProfilePageIdProps = {
  id: string
}


type ReviewType = {
  id: string
  professorID: string
  courseID: {
    id:string
    classCode: string
  }
  rating: number
  reviewType: string
  likes: number
  dislikes: number
  comment: string
  tags: [
    {
      id: string
      tagName: string
    }
  ]
  date: "string"
  __v: number
}
export default function ProfilePage({id}:ProfilePageIdProps) {
  // call backend for data
  
  const [data, setData] = useState<any | null>(null)
  
  let profTags = []
  let courses = []
  
  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${id}/reviews`)
    .then((response=> response.json()))
    .then(data => {
      setData(data)
      
    })
    .catch(err=>console.log(err))
  }, [])

  console.log(data)
  
  if(data === null) return <p>failed to load data</p>
  for (let i = 0; i < data.professor.tags.length; i++) {
    if (data.professor.tags[i] && data.professor.tags[i]["tagName"]) {
      profTags.push(data.professor.tags[i]["tagName"]);
    }
  }

  for (let i = 0; i < data.professor.courses.length; i++) {
    if (data.professor.courses[i] && data.professor.courses[i]["tagName"]) {
      courses.push(data.professor.courses[i]["tagName"]);
    }
  }
  console.log("profTags: ", profTags)
  let ratingCount = data.professor.ratingCount
  return (
    <div className="profilePageLayout">
      <ProfCard tags={profTags} department={data.professor.department} profDesc={data.professor.background} profName={data.professor.professorName} ratings={data.professor.ratingCount} ratingNum={data.professor.ratingTotal.toFixed(1)} />
      <div className="numOfUserReviews">{ratingCount} {ratingCount > 1?
        <>User Reviews</>
        :
        <>User Review</>
      } </div>
      <div>
          {data.reviews.map((key: ReviewType, i: number)=> 
            <UserCard key={i} userCourseName={key.courseID.classCode} userDesc={key.comment} userTags={key.tags} ratingNum={key.rating} />
            //<></>

          )}
       
      </div>
    </div>
  );  
}

type profileBodyProps = {
  profName: string,
  profDesc: string,
  department: string,
  tags: any[]
}

function ProfileBody(content: profileBodyProps) {
  return (
    <div className="profileBody">
      <h1>{content.profName}</h1>
      {content.department}
      <p>Profile: <a href={content.profDesc}> {content.profDesc}</a></p> {/* display other courses taught as well */}
      Top Tags: {content.tags.map(tag=> (
            <>{tag}</>
        ))}
        {/* tags is a list */}
    </div>
  )
}

type profInfoProp = {
  profName: string,
  reviewNum: number,
  ratingNum: number
}

function Rating({profName, reviewNum, ratingNum}: profInfoProp){
  return (
    <div className="ratingLayout">
      <RatingHeader reviewNum={reviewNum} ratingNum={ratingNum}/>
    <div className="ratingFooter">
      <Button type="link" className="align-self-end">Rate {profName}</Button>
      </div>
    </div>
  );
}

type ratingHeaderProps = {
  reviewNum: number,
  ratingNum: number
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
  ratingNum: number
}

function UserRating({ratingNum}: userRatingProps) {
  return (
      <div className="userRatingLayout">
       <div className="userRatingHeader">
          <div className="userRatingText">
            Rating
          </div>
          <div className="userRatingNumberText">
            {ratingNum.toFixed(1)}
          </div>
        </div>
    </div>)
}

type userBodyProps = {
  userDesc: string,
  userTags: [
    {
      id: string
      tagName: string
    }],
  userCourseName: string
}

function UserBody({userDesc, userTags, userCourseName}:userBodyProps) {
  
  return (
    <div className="userProfileBody">
      <div><h1>{userCourseName}</h1></div>
      <div>
            {userDesc.length > 300? 
              <p><ShowMore userDesc={userDesc} /></p>:
              <p>{userDesc}</p>
            }
      </div>
      <div>Tags: {userTags && userTags.map(data => (
            <span key={data.id}>
              {data.tagName}
            </span>
      ))}
      </div>
    </div>
  )
}

type ProfCardProps = {
  profName: string,
  profDesc: string,
  tags: any[]
  department: string,
  ratings: number,
  ratingNum: number
}

function ProfCard({profName, ratings, ratingNum, department, tags, profDesc}:ProfCardProps) {
  return (
    <div className="card">
    <div className="card-body profileCardLayout">
        <Rating profName={profName} reviewNum={ratings} ratingNum={ratingNum}/>
        <ProfileBody profName={profName} profDesc={profDesc} tags={tags} department={department}/>
    </div>
</div>
  )
}

type UserCardProps = {
  userCourseName: string,
  userDesc: string,
  userTags: [{
    id: string
    tagName: string
  }],
  ratingNum: number
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

type ShowMoreProps = {
  userDesc: string
}

function ShowMore({userDesc}: ShowMoreProps) {
  const [showMore, setShowMore] = useState(false)
  return (
    <>
      {!showMore? 
        <>
          {userDesc.substring(0,300) + "..."}
          <Button type="link" onClick={() => {setShowMore(true)}}>Show More</Button>
        </>
        :
        <>
          {userDesc}
          <Button type="link" onClick={() => {setShowMore(false)}}>Show Less</Button>
        </>
      }
    </>
  )
}

//implement show more button first for cards, then for text, 
// maybe use text first to build understanding

// need to resolve routing issue