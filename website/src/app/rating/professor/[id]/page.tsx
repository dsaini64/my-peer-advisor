"use client"

import React from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import { Select, Space, Input } from 'antd';
import type { SelectProps } from 'antd';


export default function RatingPage({ params }: { params: { id: string } }) {

  const [data, setData] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:9080/api/v1/professors/${params.id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (data === null) return <p>Failed to load</p>

  const onSubmit = (e: any) => {
    const data =
    {
      "courseIdentifier": "string",
      "professorRating": 0,
      //"professorTags": selectedItems,
      "professorReview": "string"
    }

  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  function populateOptions() {

    const [data, setData] = useState<null | any>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
      fetch(`http://localhost:9080/api/v1/courses/codes`)
        .then(res => res.json())
        .then(data => {
          setData(data)
          setLoading(false)
        })
    }, [])
    if (data === null) return []

    const classCodes: { label: string; value: string }[] = data?.map((item: { _id: string; classCode: string }) => ({
      label: item.classCode,
      value: item.classCode,
    }));

    return (
      classCodes
    )
  }

  const RateProfessor: React.FC = () => (

    <Select
      placeholder="Rate your professor"
      optionFilterProp=""
      filterOption={filterOption}
      options={
        [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
          { label: '10', value: '10' },
        ]
      }
    />
  );

  const options: SelectProps['options'] = [
    {
      label: 'Caring',
      value: 'caring',
    },
    {
      label: 'Tough Grader',
      value: "tough-grader"
    },
    {
      label: "Funny",
      value: "funny"
    },
    {
      label: "Inspirational",
      value: "inspirational"
    },
    {
      label: "Clear Grading Criteria",
      value: "clear-grading-criteria"
    }

  ];

  function SelectProfessorTags() {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleChange = (value: string[]) => {

      if (value.length <= 3) {
        setSelectedItems(value);
      } else {

        console.log('You can only select up to 3 items');
      }
    };

    return (
      <Space style={{ width: '100%' }} direction="vertical">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          value={selectedItems}
          onChange={handleChange}
          options={options}
        />
      </Space>
    );
  }

  const { TextArea } = Input;

  return (
    <div>
      <div>
        <h1>My Peer Advisor</h1>
        <SearchBar2 />
        <div>Rate: {data.professor.professorName}</div>
        <div>Select class code
          <span className='red-text'>*</span>
          <Select
            showSearch
            placeholder="Select a class"
            optionFilterProp=""
            filterOption={filterOption}
            options={populateOptions()}
          />
        </div>
      </div>

      <div>Rate your professor
        <span className='red-text'>*</span>
        <RateProfessor />
      </div>

      <div>Select up to 3 Tags
        <SelectProfessorTags />
      </div>

      <div>Write a review
        <span className='red-text'>*</span>
        <>
          <br />
          <br />
          <TextArea rows={3} placeholder="What would you like to say?" maxLength={450} />
        </>
      </div>

      <div className='search-bar-2'>

        <button>Submit</button>
      </div>

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