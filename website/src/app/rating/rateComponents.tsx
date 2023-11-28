import { useState, useEffect } from 'react';
import React from 'react';

interface SearchableDropdownProps {
    options: string[];
}

function SearchableDropdown({ options }: SearchableDropdownProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        // Filter options based on the search term
        const filtered = options.filter((option: string) =>
            option.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    const handleSelect = (selectedOption: string) => {
        // Handle the selected option (e.g., pass it to a function, update state, etc.)
        console.log('Selected:', selectedOption);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for a class..."
            />
            <div>
                {filteredOptions.length > 0 ? (
                    <ul>
                        {filteredOptions.map((option: string, index: number) => (
                            <li key={index} onClick={() => handleSelect(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No matching classes found.</p>
                )}
            </div>
        </div>
    );
}

export default SearchableDropdown;