'use client';

import SearchCarForm from '@/components/common/search-car-form';
import DisplaySearchCars from '@/components/cars/search/DisplaySearchCars';
import { useState } from 'react';


export default function CarSearch() {
    const [searchResults, setSearchResults] = useState({});
    const [searchData, setSearchData] = useState({});
    const [size, setSize] = useState(10);
    const [filterBy, setFilterBy] = useState('');

    const handleSearch = (results) => {
        setSearchResults(results.result);
        setSearchData(results.search_data);
    };

    const handleChange = (size, filterBy) => {
        setSize(size);
        setFilterBy(filterBy);
    };

    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <a href={"/"}>Home</a>
                        <i className="bi bi-chevron-right"></i>
                        <a href={"#"}>Search result</a>
                    </span>
                </div>

                <SearchCarForm onSearch={handleSearch} sort={filterBy} size={size} />
                <DisplaySearchCars
                    initialResults={searchResults}
                    search_data={searchData}
                    changeParam={handleChange}
                />
            </div>
        </>
    );
}
