"use client"

import Image from 'next/image'
import React from 'react';
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Homepage() {
  return (
    <div>
      <div className='MyPeerAdvisorHeader'>
        <h1 >My Peer Advisor</h1>
      </div>
      <SearchBar />
    </div>
  );
}

function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="search-bar">
      <input 
        onChange={(e) => setSearch(e.target.value)}
        type="text"  
        value={search} 
        placeholder='Search for class/professor...'/>
      <button
        onClick={() => {
          router.push('/searchPage?q=' + search);
        }}
      >Search</button>
    </div>
  );
}