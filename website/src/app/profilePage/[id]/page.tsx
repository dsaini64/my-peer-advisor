"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { LikeOutlined, DislikeOutlined }  from "@ant-design/icons";
import { useRouter } from "next/navigation";
import router from "next/router";
import { SearchBar2 } from "@/app/searchPage/page";


export interface RootData {
  professor?: Professor;
  reviews?: ReviewType[];
}

export interface ReviewType {
  rating: number;
  _id: string
  tags: Tag[];
  comment: string;
  courseID: {
    classCode: string;

  };
  likes?: number
  dislikes?: number
  date: string 
}

export interface Professor {
  professorName: string;
  department: string;
  background: string;
  courses: Course[];
  ratingCount: number;
  ratingTotal: number;
  tags: Tag[];
  rating: number;
}

export interface Course {
  courseName: string;
  classCode: string;
  description: string;
  professors: string[];
  ratingCount: number;
  ratingTotal: number;
  quarterAvailability: string[];
  tags: Tag[];
  rating: number;
}

export interface Tag {
  tagName: string;
  id: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  // call backend for data
  const [data, setData] = useState<RootData>({})

  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${params.id}/reviews`)
    .then((response => response.json()))
    .then(data => {
      setData(data)

    })
    .catch(err => console.log(err))
  }, [])

  console.log("data: ", data)


  if (data === null) return <p>failed to load data</p>

  if ((Array.isArray(data))) return <div>No Results found</div>

  let tags: string[] = []
  const professor = data["professor"];
  if (professor) {
    if (professor.tags) {
      tags = professor.tags.map(t => t.tagName);
    }
  }

  console.log("profTags: ", tags)

  const ratingCount = data.professor?.ratingCount || 0;
  const router = useRouter();

  return (
    <>
     <h1
      onClick={() => {
        router.push('/');
      }}
    >My Peer Advisor</h1>
      <SearchBar2 />
    <div className="profilePageLayout">
      <ProfCard
        tags={tags}
        department={data.professor?.department}
        profDesc={data.professor?.background}
        profName={data.professor?.professorName}
        ratings={data.professor?.ratingCount}
        ratingNum={data.professor && data.professor.ratingCount? data.professor.ratingTotal/data.professor?.ratingCount: 0}
        id={params.id}
      />
      <div className="numOfUserReviews">{ratingCount} {ratingCount > 1 ?
        <>User Reviews</>
        :
        <>User Review</>
      } </div>
      <div>
        {data.reviews?data.reviews.map((key: ReviewType, i: number) =>
            <UserCard
              key={i}
              professorID={params.id}
              userCourseName={key.courseID.classCode}
              userDesc={key.comment}
              userTags={key.tags}
              ratingNum={key.rating}
              id={key._id}
            />

        )
        : null
      }

      </div>
    </div>
    </>
  );
}

type profileBodyProps = {
  profName?: string,
  profDesc?: string,
  department?: string,
  tags: Tag[]
}

function ProfileBody(content: profileBodyProps) {
  return (
    <div className="profileBody">
      <h1>{content.profName}</h1>
      {content.department}
      <p>Profile: <a href={content.profDesc}> {content.profDesc}</a></p> {/* display other courses taught as well */}
      Top Tags: {content.tags.join(", ")}
    </div>
  )
}

type profInfoProp = {
  profName?: string,
  reviewNum?: number,
  ratingNum?: number
  id?: string
}

function Rating({profName, reviewNum, ratingNum, id}: profInfoProp){
  const {push} = useRouter();
  const ratingPage = () => {
    push("/rating/professor/" + id);
  }
  return (
    <div className="ratingLayout">
      <RatingHeader reviewNum={reviewNum} ratingNum={ratingNum}/>
    <div className="ratingFooter">
      <Button type="link" className="align-self-end" onClick={ratingPage}>Rate {profName}</Button>
      </div>
    </div>
  );
}

type ratingHeaderProps = {
  reviewNum?: number,
  ratingNum?: number
}

function RatingHeader({reviewNum, ratingNum}:ratingHeaderProps){
  return (
    <div className="ratingHeader">
      <div className="ratingText">
        Rating
      </div>
      <div className="ratingNumberText">
        {!ratingNum ? 
          <>N/A</>:
          ratingNum.toFixed(1)
      }
      </div>
      <div className="reviewNumText">{reviewNum} ratings</div> 
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

            {ratingNum === 0?
              <>N/A</>
            :
              ratingNum.toFixed(1)
            }
          </div>
        </div>
    </div>
    )
}

type userBodyProps = {
  userDesc: string,
  userTags: Tag[]
  userCourseName: string
  id?: string
  professorID: string
}

function UserBody({userDesc, userTags, userCourseName, id, professorID}: userBodyProps) {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [data, setData] = useState<ReviewType>()
  
  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${professorID}/reviews`)
    .then((response => response.json()))
    .then(reviewList => {
      console.log("Reviews List",reviewList.reviews)
      for (let i = 0; i < reviewList.reviews.length; i++) {
        console.log("review type", reviewList.reviews[i])
        if(reviewList.reviews[i]._id == id) {
          setData(reviewList.reviews[i])
          console.log("data Like dislike", data)
            // setLikes(data?.likes)
            // setDislikes(data?.dislikes) 
            console.log("Likes: ", likes)
            console.log("Dislikes: ", dislikes)
        }
        
      }
    })
    .catch(err => console.log(err))
  }, [])

  const updateLikes = () => {
    fetch(`http://localhost:9080/api/v1/reviews/${id}/like`, {
      method: 'PATCH',
      credentials: "include"
    }).then((res) => {
      if(res.status == 200) {
        console.log("Liked Successfully")
        setLikes(likes + 1)
      }
      else if (res.status == 400) {
        console.log("Error Liking, invalid id")
      }
      else {
        console.log("Can only like once")
      }
    })
    .catch((err) => console.log(err))
  }

  const updateDislikes = () => {
    fetch(`http://localhost:9080/api/v1/reviews/${id}/dislike`, {
      method: 'PATCH',
      credentials: "include"
    }).then((res)=> {
      if(res.status == 200) {
        console.log("Disliked Successfully")
        setDislikes(dislikes + 1)
      }
      else if (res.status == 400){
        console.log("Error Disliking, invalid id")
      }
      else {
        console.log("Can only dislike once")
      }
    })
    .catch((err)=> console.log(err))
  }

  return (
    <div className="userProfileBody">
      <div className="dateFormat">{data?.date}</div>
      <div><h1>{userCourseName}</h1> </div>
      <div>
            {userDesc.length > 300? 
              <p><ShowMore userDesc={userDesc} /></p>:
              <p>{userDesc}</p>
            }
      </div>
      <div>
        Tags: {userTags && userTags.map(u=>u.tagName).join(", ")}
      </div>
      <div className="LikeDislikeButtonsLayout">
        <Button type="text" icon={<LikeOutlined />} onClick={updateLikes} /> 
        {likes}
        <Button type="text" icon={<DislikeOutlined />} onClick={updateDislikes} />
        {dislikes}
      </div>
    </div>
  )
}

type ProfCardProps = {
  profName?: string,
  profDesc?: string,
  tags: any[]
  department?: string,
  ratings?: number,
  ratingNum?: number
  id?: string
}

function ProfCard({profName, ratings, ratingNum, department, id, tags, profDesc}:ProfCardProps) {
  return (
    <div className="card">
    <div className="card-body profileCardLayout">
        <Rating 
          profName={profName} 
          reviewNum={ratings} 
          ratingNum={ratingNum} 
          id={id}
        />
        <ProfileBody 
          profName={profName} 
          profDesc={profDesc} 
          tags={tags} 
          department={department}
        />
    </div>
</div>
  )
}

type UserCardProps = {
  userCourseName: string,
  userDesc: string,
  userTags: Tag[]
  ratingNum: number
  id?: string
  professorID: string
}

function UserCard({userCourseName, userDesc, userTags, ratingNum, id, professorID}: UserCardProps){
  return (
    <div className="card">
      <div className="card-body profileCardLayout">
        <UserRating ratingNum={ratingNum}/>
        <UserBody 
          userCourseName={userCourseName} 
          userDesc={userDesc} 
          userTags={userTags} 
          id={id}
          professorID={professorID}
        />
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
          {userDesc.substring(0, 300) + "..."}
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