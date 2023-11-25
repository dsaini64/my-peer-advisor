import Image from 'next/image'
import React from 'react';

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
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search for class/professor.." />
      <button>Search</button>
      <a href='./profilePage.tsx'> Profile page</a>
    </div>
  );
}