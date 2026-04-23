import search from '@assets/icons/search.svg'
import { useState } from "react"
import React from 'react'

type Props = {
    query: string;
    setQuery: (q: string) => void;
};

const SearchBar = ({ query, setQuery }: Props) => {
    const [inputValue, setInputValue] = useState(query);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(inputValue);
    };

    return (
        <div className="search-header">
            <form className="search-bar-container" onSubmit={handleSubmit}>
                <input
                    className="search-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="search-icon-button" type="submit">
                    <img className="search-icon" src={search} alt="search icon" />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
