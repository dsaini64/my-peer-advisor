import React from 'react';
import { Select, Input, Space } from 'antd';
import { useState, useEffect } from 'react';
import type { SelectProps } from 'antd';

export function SelectClass(props: any) {
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [classCodes, setClassCodes] = useState<string[]>([]);
    const [codesToId, setCodesToId] = useState<Map<string, string>>(new Map());

    const handleChange = (value: string) => {
        setSelectedClass(value);
        props.callback(codesToId.get(value));
    };

    useEffect(() => {
        fetch(`http://localhost:9080/api/v1/courses/codes`)
            .then(res => res.json())
            .then(data => {
                const codes: string[] = data?.map((item: { _id: string; classCode: string }) => item.classCode);
                const codesMap: Map<string, string> = new Map();
                data?.forEach((item: { _id: string; classCode: string }) => {
                    codesMap.set(item.classCode, item._id);
                });
                setClassCodes(codes);
                setCodesToId(codesMap);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <Select
            showSearch
            placeholder="Select a class"
            onChange={handleChange}
            value={selectedClass}
            filterOption={(input: string, option: any) =>
                (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={classCodes.map((item: string) => ({ label: item, value: item }))}
            />
            );
            }

            export function RateProfessor(props: any) {

    const [selectedRating, setSelectedRating] = useState<string>('');

    const handleChange = (value: string) => {
        setSelectedRating(value);
        props.callback(value);
    };

    return (
        <Select
            placeholder="Rate your professor"
            optionFilterProp=""
            onChange={handleChange}
            value={selectedRating}
            options={[
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

            ]}
        />
    );
};

const options: SelectProps['options'] = [
    {
        label: 'Caring',
        value: '6563b2c5b8e5ccb84c534c55',
    },
    {
        label: 'Tough Grader',
        value: "6563b2c5b8e5ccb84c534c56"
    },
    {
        label: "Funny",
        value: "6563b2c5b8e5ccb84c534c57"
    },
    {
        label: "Inspirational",
        value: "6563b2c5b8e5ccb84c534c58"
    },
    {
        label: "Clear Grading Criteria",
        value: "6563b2c5b8e5ccb84c534c5e"
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

                value={selectedItems}
                onChange={handleChange}
                options={options}
            />
        </Space>
    );
}

const { TextArea } = Input;

export function ReviewBox(props: any) {
    const [review, setReview] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setReview(value);
        props.callback(value);
    };

    return (
        <>
            <br />
            <br />
            <TextArea
                rows={3}
                placeholder="What would you like to say?"
                maxLength={450}
                onChange={handleChange}
                value={review}
            />
        </>
    );
}



