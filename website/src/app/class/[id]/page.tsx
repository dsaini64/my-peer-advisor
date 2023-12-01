"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import router from "next/router";
import { SearchBar2 } from "@/app/searchPage/page";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";


// type ReviewType = {
//   id: string
//   professorID: string
//   courseID: {
//     id:string
//     classCode: string
//   }
//   rating: number
//   reviewType: string
//   likes: number
//   dislikes: number
//   comment: string
//   tags: [
//     {
//       id: string
//       tagName: string
//     }
//   ]
//   date: "string"
//   __v: number
// }
// export default function ProfilePage({ params }: { params: { id: string } }) {
//   // call backend for data

//   const [data, setData] = useState<any | null>(null)
//   useEffect(() => {
//     fetch(`http://localhost:9080/api/v1/professors/${params.id}/reviews`)
//     .then((response=> {
//       if(response.ok) {
//         console.log("response successful")
//         return response.json()
//       }
//       else {
//         console.error("Response Failed")
//       }
//     }

//     ))
//     .then(data => {
//       setData(data)
//     })
//     .catch(err=>console.log(err))
//   }, [])

//   console.log("data: ", data)


//   if(data === null) return <p>failed to load data</p>

//   //if(!(data.constructor === Array)) return <div>No Results found</div>

//   const tags: string[] = data?.professor.tags.map((item: { _id: string; tagName: string }) => (
//     item.tagName
//   ));

//   console.log("profTags: ", tags)
//   let ratingCount = data?.professor?.ratingCount
//   return (
//     <div className="profilePageLayout">
//       <ProfCard 
//         tags={tags} 
//         classCode={data?.professor.classCode} 
//         profDesc={data?.professor.background} 
//         profName={data?.professor.professorName} 
//         ratings={data?.professor.ratingCount} 
//         ratingNum={data?.professor.ratingTotal.toFixed(1)} 
//         id={params.id} />
//       <div className="numOfUserReviews">{ratingCount} {ratingCount > 1?
//           <>User Reviews</>
//         :
//           <>User Review</>
//       } </div>
//       <div>
//           {data.reviews.map((key: ReviewType, i: number)=> 
//             <UserCard 
//                 key={i} 
//                 userCourseName={key.courseID.classCode} 
//                 userDesc={key.comment} 
//                 userTags={key.tags} 
//                 ratingNum={key.rating} 
//               />

//           )}

//       </div>
//     </div>
//   );  
// }

export interface RootData {
  course?: Course;
  reviews?: ReviewType[];
}

export interface ReviewType {
  rating: number;
  tags: Tag[];
  comment: string;
  professorID: {
    professorName: string;

  };
  likes: number
  dislikes: number
  date:string 
  id: string
}

export interface Professor {
  id: string,
  professorName: string
}

export interface Course {
  courseName: string;
  classCode: string;
  description: string;
  professors: Professor[];
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
    fetch(`http://localhost:9080/api/v1/courses/${params.id}/reviews`)
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
  const course = data["course"];
  if (course) {
    if (course.tags) {
      tags = course.tags.map(t => t.tagName);
    }
  }


  console.log("profTags: ", tags)
  const ratingCount = data.course?.ratingCount || 0;
  const router = useRouter();

  return (
    <>
      <h1
      onClick={() => {
        router.push('/'); // should be variable later on based on prof id from database
      }}
    >My Peer Advisor</h1>
      <SearchBar2 />
      <div className="profilePageLayout">
        <CourseCard
          tags={tags}
          classCode={data.course?.classCode}
          courseDesc={data.course?.description}
          courseName={data.course?.courseName}
          ratings={data.course?.ratingCount}
          ratingNum={data.course && data.course.ratingCount ? data.course.ratingTotal / data.course.ratingCount : 0}
          id={params.id}
        />
        <div className="numOfUserReviews">{ratingCount} {ratingCount > 1 ?
          <>User Reviews</>
          :
          <>User Review</>
        } </div>
        <div>
          {data.reviews ? data.reviews.map((key: ReviewType, i: number) =>
            <UserCard
              key={i}
              userProfName={key.professorID.professorName}
              userDesc={key.comment}
              userTags={key.tags}
              ratingNum={key.rating}
              id={key.id}
              courseID={key.professorID}
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
  courseName?: string,
  courseDesc?: string,
  classCode?: string,
  tags: Tag[]
}

function ProfileBody({ courseName, courseDesc, classCode, tags }: profileBodyProps) {
  return (
    <div className="profileBody">
      <h1>{courseName}</h1>
      {classCode}
      <p>{courseDesc}</p> {/* display other courses taught as well */}
      Top Tags: {tags.join(", ")}
    </div>
  )
}

type courseInfoProp = {
  courseName?: string,
  reviewNum?: number,
  ratingNum?: number
  id?: string
}

function Rating({ courseName, reviewNum, ratingNum, id }: courseInfoProp) {
  const { push } = useRouter();
  const ratingPage = () => {
    push("/rating/course/" + id);
  }
  return (
    <div className="ratingLayout">
      <RatingHeader reviewNum={reviewNum} ratingNum={ratingNum} />
      <div className="ratingFooter">
        <Button type="link" className="align-self-end" onClick={ratingPage}>Rate {courseName}</Button>
      </div>
    </div>
  );
}

type ratingHeaderProps = {
  reviewNum?: number,
  ratingNum?: number
}

function RatingHeader({ reviewNum, ratingNum }: ratingHeaderProps) {
  return (
    <div className="ratingHeader">
      <div className="ratingText">
        Rating
      </div>
      <div className="ratingNumberText">
        {!ratingNum ?
          <span>N/A</span> :
          ratingNum.toFixed(1)
        }
      </div>
      <div className="reviewNumText"> {reviewNum} ratings</div>
    </div>
  )
}

type userRatingProps = {
  ratingNum: number
}

function UserRating({ ratingNum }: userRatingProps) {
  return (
    <div className="userRatingLayout">
      <div className="userRatingHeader">
        <div className="userRatingText">
          Rating
        </div>
        <div className="userRatingNumberText">

          {ratingNum === 0 ?
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
  userProfName: string
  id: string
  courseID?: string
}

function UserBody({userDesc, userTags, userProfName, id, courseID}: userBodyProps) {
  const updateLikes = () => {
    fetch(`http://localhost:9080/api/v1/reviews/${id}/like`, {
      method: 'PATCH'
    })
  }


  const updateDislikes = () => {
    fetch(`http://localhost:9080/api/v1/reviews/${id}/dislike`, {
      method: 'PATCH'
    })
  }

  return (
    <div className="userProfileBody">
      <div><h1>{userProfName}</h1></div>
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
        <Button type="text" icon={<DislikeOutlined />} onClick={updateDislikes} />
      </div>
    </div>
  )
}

type CourseCardProps = {
  courseName?: string,
  courseDesc?: string,
  tags: any[]
  classCode?: string,
  ratings?: number,
  ratingNum?: number
  id?: string
}

function CourseCard({ courseName, ratings, ratingNum, classCode, id, tags, courseDesc }: CourseCardProps) {
  return (
    <div className="card">
      <div className="card-body profileCardLayout">
        <Rating
          courseName={courseName}
          reviewNum={ratings}
          ratingNum={ratingNum}
          id={id}
        />
        <ProfileBody
          courseName={courseName}
          courseDesc={courseDesc} tags={tags}
          classCode={classCode}
        />
      </div>
    </div>
  )
}

type UserCardProps = {
  userProfName: string,
  userDesc: string,
  userTags: Tag[]
  ratingNum: number
  id: string
  courseID?: string
}

function UserCard({ userProfName, userDesc, userTags, ratingNum, id, courseID }: UserCardProps) {
  console.log("Review id: ", id)
  return (
    <div className="card">
      <div className="card-body profileCardLayout">
        <UserRating ratingNum={ratingNum} />
        <UserBody userProfName={userProfName} userDesc={userDesc} userTags={userTags} id={id} courseID={courseID}/>
      </div>
    </div>
  )
}

type ShowMoreProps = {
  userDesc: string
}

function ShowMore({ userDesc }: ShowMoreProps) {
  const [showMore, setShowMore] = useState(false)
  return (
    <>
      {!showMore ?
        <>
          {userDesc.substring(0, 300) + "..."}
          <Button type="link" onClick={() => { setShowMore(true) }}>Show More</Button>
        </>
        :
        <>
          {userDesc}
          <Button type="link" onClick={() => { setShowMore(false) }}>Show Less</Button>
        </>
      }
    </>
  )
}

//implement show more button first for cards, then for text, 
// maybe use text first to build understanding

// need to resolve routing issue