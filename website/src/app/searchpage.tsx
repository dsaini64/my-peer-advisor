import Image from 'next/image'
import React from 'react';

export default function SearchPage() {
    return (
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
        <ResultList />
      </div>
    );
  }

function SearchBar2() {
    return (
      <div className="search-bar-2">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    );
  }

function ResultList() {
    return (
        <div className="result-list">
            <Result />
            <Result />
        </div>
    );
}

function Result() {
    return(
        <div className="result-card">
            <ResultRating />
            <ResultName />
            <ResultTags />
        </div>
    );
}

function ResultRating() {
    return (
        <h1>4.0</h1>
    );
}

function ResultName() {
    return (
        <div>Result Name</div>
    );
}

function ResultTags() {
    return (
        <div>
            <div className="result-tag">Tag</div>
            <div className="result-tag">Tag2</div>
        </div>
    );
}