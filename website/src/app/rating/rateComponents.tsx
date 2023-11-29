import React from 'react';
import { Select, Input, Space } from 'antd';
import { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';


const onChange = (value: string) => {
    console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
    console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const SelectClass: React.FC = () => (


    <Select
        showSearch
        placeholder="Select a class"
        optionFilterProp=""
        onChange={onChange}
        onSearch={onSearch}
        filterOption={filterOption}
        options={populateOptions()}
    />
);



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

export const RateProfessor: React.FC = () => (


    <Select
        placeholder="Rate your professor"
        optionFilterProp=""
        onChange={onChange}
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

const options: SelectProps['options'] = [{

    label: 'caring',
    value: '6563b2c5b8e5ccb84c534c55',
    }];

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

 export const SelectProfessorTags: React.FC = () => (
  <Space style={{ width: '100%' }} direction="vertical">
    <Select
      mode="multiple"
      allowClear
      style={{ width: '100%' }}
      placeholder="Please select"
      defaultValue={[]}
      onChange={handleChange}
      options={options}
    />
  </Space>
);

const { TextArea } = Input;

export const ReviewBox: React.FC = () => (
  <>
    <br />
    <br />
    <TextArea rows={3} placeholder="What would you like to say?" maxLength={450} />
  </>
);





