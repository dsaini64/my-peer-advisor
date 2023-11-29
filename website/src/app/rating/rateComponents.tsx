import React from 'react';
import { Select, Input, Space } from 'antd';
import { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';


// Filter `option.label` match the user type `input`
const filterOption = (input: string, option: any) =>
    (option ?? '').toLowerCase().includes(input.toLowerCase());

export function SelectClass(props: any) {

    const [selectedClass, setSelectedClass] = useState<string>('');
    const handleChange = (value: string) => {

        setSelectedClass(value);
        props.callback(codesToId.get(value));
    };

    const optionsReturn = populateOptions();

    const classCodes = optionsReturn.classCodes;
    const codesToId = optionsReturn.codesToId;

    console.log(classCodes);
    console.log(codesToId);

    return (
        <Select
            showSearch
            placeholder="Select a class"
            optionFilterProp=""
            onChange={handleChange}
            value={selectedClass}
            //onSearch={onSearch}
            filterOption={filterOption}
            options={classCodes}
        />
    );
}



function populateOptions(): { classCodes: string[]; codesToId: Map<string, string>; } {

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

    //if (data === null) return []

    const classCodes: string[] = data?.map((item: { _id: string; classCode: string }) => (
        item.classCode
    ));

    const codesToId: Map<string, string> = new Map();

    data?.forEach((item: { _id: string; classCode: string }) => {
        codesToId.set(item.classCode, item._id);
    });

    return (
         {classCodes, codesToId}
    )
}

export const RateProfessor: React.FC = (props: any) => (

    <Select
        placeholder="Rate your professor"
        optionFilterProp=""
        //onChange={onChange}
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


export function SelectProfessorTags(props: any) {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleChange = (value: string[]) => {

        if (value.length <= 3) {
            setSelectedItems(value);
        } else {

            console.log('You can only select up to 3 items');
        }

        props.callback(value);
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

export const ReviewBox: React.FC = () => (
    <>
        <br />
        <br />
        <TextArea rows={3} placeholder="What would you like to say?" maxLength={450} />
    </>
);





