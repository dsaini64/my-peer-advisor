import Image from 'next/image'
import React from 'react';
import SearchBar from './SearchBar';

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
      <h1>Welcome to my app</h1>
      <SearchBar />
    </div>
  );
}