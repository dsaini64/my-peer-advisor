"use client"
import React, { useState } from 'react';
import Link from 'next/link';

interface SearchBarProps {
  searchTerm: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onInputChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for class/professor.."
        value={searchTerm}
        onChange={onInputChange}
      />
    </div>
  );
};

const Page: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div>
      <div className='MyPeerAdvisorHeader'>
        <h1>My Peer Advisor</h1>
      </div>
      <SearchBar searchTerm={searchTerm} onInputChange={handleInputChange} />
      <Link href={`/searchpage?query=${searchTerm}`}>
        <a>Search</a>
      </Link>
    </div>
  );
};

interface SearchBarProps {
  searchTerm: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default Page;