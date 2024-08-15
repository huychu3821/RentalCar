import { useState, useEffect } from 'react';
import './searchItem.css';
import { useAppContext } from '@/app/app-provider';
import React, { useContext } from 'react';
import { LocationContext } from '@/app/customer/SearchContext';
import CarItem from './SearchItem';
import TableItem from './TableItem';
import Pagination from '../common/Pagination';
import convertToNewFormat from '../common/convertToNewFormat';
import { FaList, FaTh } from 'react-icons/fa';
import { keyframes } from 'styled-components';

export default function DisplaySearchCars({ initialResults, search_data, changeParam }) {
    const { sessionToken } = useAppContext();
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [filterBy, setFilterBy] = useState('newest_to_latest');
    const [results, setResults] = useState(initialResults);
    const { locationState } = useContext(LocationContext);

    useEffect(() => {
        setCurrentPage(1);
        setResults(initialResults);
    }, [initialResults]);

    if (Object.keys(search_data).length === 0) {
        async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/search`, {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                method: 'POST',
                body: JSON.stringify(
                    convertToNewFormat(locationState, currentPage, size, filterBy),
                ),
            }).then(async (res) => {
                const payload = await res.json();
                setResults(payload.body);
            });
        };
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/search`, {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                method: 'POST',
                body: JSON.stringify(
                    convertToNewFormat(
                        Object.keys(search_data).length === 0 ? locationState : search_data,
                        currentPage,
                        size,
                        filterBy,
                    ),
                ),
            }).then(async (res) => {
                const payload = await res.json();
                setResults(payload.body);
            });
        };
        changeParam(size, filterBy);
        if (locationState.pickUpLocation !== '') {
            fetchData();
        }
    }, [currentPage, size, filterBy, changeParam, locationState, search_data, sessionToken]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSizeChange = (event) => {
        setSize(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
        setCurrentPage(1);
    };

    if (!results || !results.result) {
        return <h1></h1>;
    }

    return (
        <div>
            <h2>Search Results</h2>
            <div className="controls-wrapper">
                <p>There are {results.total_item} cars found</p>
                <div className="controls">
                    <div className="view-mode-buttons">
                        <button
                            onClick={() => setViewMode('list')}
                            className={viewMode === 'list' ? 'active' : ''}
                        >
                            <FaTh />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={viewMode === 'table' ? 'active' : ''}
                        >
                            <FaList />
                        </button>
                    </div>
                    <select onChange={handleFilterChange} value={filterBy}>
                        <option value="newest_to_latest">Newest to Latest</option>
                        <option value="latest_to_newest">Latest to Newest</option>
                        <option value="price_low_high">Price: Low to High</option>
                        <option value="price_high_low">Price: High to Low</option>
                    </select>
                </div>
            </div>
            {viewMode === 'list' ? carList(results) : carTable(results)}
            <div className="pagination-controls">
                <select onChange={handleSizeChange} value={size}>
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={30}>30 per page</option>
                </select>
                <Pagination
                    totalPage={results.total_page}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

function carList(results) {
    return (
        <ul>
            {results.result.map((car) => (
                <CarItem key={car.carId} car={car} />
            ))}
        </ul>
    );
}

function carTable(results) {
    return (
        <table className="car-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Rating</th>
                    <th>No. of rides</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {results.result.map((car, index) => (
                    <TableItem key={index} car={car} />
                ))}
            </tbody>
        </table>
    );
}
