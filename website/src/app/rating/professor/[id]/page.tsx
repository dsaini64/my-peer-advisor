"use client"

import Image from 'next/image'
import React from 'react';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function RatingPage() {
    return (
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
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

