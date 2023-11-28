import React from 'react';
import { Select } from 'antd';
import { useState, useEffect } from 'react';

const onChange = (value: string) => {
    console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
    console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const SelectClass: React.FC = () => (


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

export default SelectClass;

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





