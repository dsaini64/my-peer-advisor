import { useState, useEffect } from 'react'



export default function Page({ params }: { params: { id: string } }) {

    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`http://localhost:3000/api/course/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    }, [])

}