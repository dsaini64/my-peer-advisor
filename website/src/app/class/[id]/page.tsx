"use client"

import { useState, useEffect } from 'react'

export default function ClassPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:9080/api/v1/courses/655e740644c47b2420f26ce5/reviews')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  console.log(typeof(data));

  return (
    (data === null) ? <div>Loading...</div> : <ClassProfile content={data}/>
  );
}

type ClassProfileProps = {
  content: object
}

function ClassProfile({content}: ClassProfileProps) {
  return (
    <div>
        <h1>{content.courses.classCode}</h1> <h1>{content.course.courseName}</h1>
    </div>
  )
}

