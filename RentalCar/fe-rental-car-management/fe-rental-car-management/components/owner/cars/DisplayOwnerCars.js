import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/app-provider';
import React from 'react';
import './ownercars.css';
import OwnerCarItem from './OwnerCarItem';
import Pagination from '@/components/cars/common/Pagination';

export default function DisplayOwnerCars({ initialResults }) {
    const { sessionToken } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [filterBy, setFilterBy] = useState('newest_to_latest');
    const [results, setResults] = useState(initialResults);

    useEffect(() => {
        setCurrentPage(1);
        setResults(initialResults);
    }, [initialResults]);

    useEffect(() => {
        const fetchData = async () => {
            const params = new URLSearchParams({
                page: currentPage,
                size: size,
                sort: filterBy,
            });

            await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/cars?${params.toString()}`,
                {
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    method: 'GET',
                },
            ).then(async (res) => {
                const payload = await res.json();
                setResults(payload.body);
            });
        };
        fetchData();
    }, [currentPage, size, filterBy, sessionToken]);

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

    if (!results) {
        return <h1> Loading...</h1>;
    }

    if (typeof results.result === 'string') {
        return <h1> {results.result} </h1>;
    }

    return (
        <div>
            {typeof results.message === 'string' ? (
                <div className="average">
                    <h1> {results.message}</h1>
                </div>
            ) : (
                <div>
                    <h2>List of cars</h2>
                    <p>There are {results.total_item} car found</p>
                    <div className="controls">
                        <select onChange={handleFilterChange} value={filterBy}>
                            <option value="newest_to_latest">Newest to Latest</option>
                            <option value="latest_to_newest">Latest to Newest</option>
                            <option value="price_low_high">Price: Low to High</option>
                            <option value="price_high_low">Price: High to Low</option>
                        </select>
                    </div>
                    {carList(results)}
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
            )}
        </div>
    );
}

function carList(results) {
    return (
        <div>
            <ul className="list-style">
                {results.result.map((car, index) => (
                    <OwnerCarItem key={index} car={car} />
                ))}
            </ul>
        </div>
    );
}
