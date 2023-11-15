"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


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
      <Link href={`/search-results?query=${searchTerm}`}>
        <>Search</>
      </Link>
    </div>
  );
};

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

export default Page;