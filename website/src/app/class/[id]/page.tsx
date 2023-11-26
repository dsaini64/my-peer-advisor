import { useState, useEffect } from 'react'



export default function ClassPage({ params }: { params: { id: string } }) {

    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:9080/api/v1/courses/${params.id}/reviews`) //http://localhost:9080/api/v1/courses/{id}/reviews
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    }, [])

    console.log(data);

}

type profileBodyProps = {
    className: string,
    classDescription: string,
    degree: string,
  }
  
  function ProfileBody(content: profileBodyProps) {
    return (
      <div className="profileBody">
        <div><h1>{content.className}</h1></div>
        <div>{content.degree}</div>
        <div><p>{content.classDescription}</p></div>
      </div>
    )
  }