import Image from 'next/image'
import React from 'react';
//import SearchBar from './SearchBar';

function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function Homepage() {
  return (
    <div>
      <div className='MPAHeader'>
        <h1 >My Peer Advisor</h1>
      </div>
      <SearchBar />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search..." />
      <button>Search</button>
    </div>
  );
}