import Image from 'next/image'
import React from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useRouter } from 'next/router';
//import { useRouter } from 'next/navigation';
//import SearchBar from './SearchBar';

function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>My Peer Advisor</h1>
      {typeof window !== 'undefined' && <SearchBar />}
    </div>
  );
}

function SearchBar() {
  //const navigate = useNavigate();
  const router = require('next/router').useRouter();

  const navigateToSecondPage = () => {
    //navigate("/second");
    router.push("/second");
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search..." />
      <button  onClick={navigateToSecondPage}>Search</button>
    </div>
  );
}