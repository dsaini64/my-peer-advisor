"use client"

import { useState, useEffect } from 'react'

export default function ClassPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3000/api/page/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    
}, [])

  console.log(data);

  return (
    (data === null) ? <div>Loading...</div> : ClassProfile(data)
  );
}

function ClassProfile(content: any) {
  return (
    <div className="flex-col h-screen w-screen">
        <div>
          <h1 className='font-bold'>{content.course.classCode}</h1> <h1 >{content.course.courseName}</h1>
        </div>
      </div>
  )
}