"use client";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import router from "next/router";
import { SearchBar2 } from "@/app/searchPage/page";


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
//         department={data?.professor.department} 
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
  professor?: Professor;
  reviews?: ReviewType[];
}

export interface ReviewType {
  rating: number;
  tags: Tag[];
  comment: string;
  courseID: {
    classCode: string;

  };

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
              userCourseName={key.courseID.classCode}
              userDesc={key.comment}
              userTags={key.tags}
              ratingNum={key.rating}
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
      Top Tags: {content.tags.join(",")}
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
          <span>N/A</span>:
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

function UserRating({ratingNum}: userRatingProps) {
  return (
      <div className="userRatingLayout">
       <div className="userRatingHeader">
          <div className="userRatingText">
            Rating
          </div>
          <div className="userRatingNumberText">

            {ratingNum===0?
              <>N/A</>
            :
              ratingNum.toFixed(1)
            }
          </div>
        </div>
    </div>)
}

type userBodyProps = {
  userDesc: string,
  userTags: Tag[]
  userCourseName: string
}

function UserBody({userDesc, userTags, userCourseName}: userBodyProps) {
  
  return (
    <div className="userProfileBody">
      <div><h1>{userCourseName}</h1></div>
      <div>
            {userDesc.length > 300? 
              <p><ShowMore userDesc={userDesc} /></p>:
              <p>{userDesc}</p>
            }
      </div>
      <div>Tags: {userTags && userTags.map(u=>u.tagName).join(", ")}
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
        <ProfileBody profName={profName} profDesc={profDesc} tags={tags} department={department}/>
    </div>
</div>
  )
}

type UserCardProps = {
  userCourseName: string,
  userDesc: string,
  userTags: Tag[]
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