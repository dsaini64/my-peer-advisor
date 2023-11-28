"use client"

import Image from 'next/image'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'


export default function RatingPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)
  let id = "655e74a507d82f6cfb9a1a86"

  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  console.log(data);

    return (
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
        (data === null) ? <div>loading...</div> : <div>worked</div>
      </div>
    );
}

function SearchBar2() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    return (
      <div className="search-bar-2">
        <input 
            onChange={(e) => setSearch(e.target.value)}
            type="text" 
            value={search} 
            placeholder="Search..." />
        <button
            onClick={() => {
                router.push('/searchPage?q=' + search);
            }}
        >Search</button>
      </div>
    );
}

