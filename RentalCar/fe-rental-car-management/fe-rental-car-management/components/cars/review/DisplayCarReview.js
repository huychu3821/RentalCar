import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/app-provider';
import React from 'react';
import './car.css';
import Pagination from '@/components/cars/common/Pagination';
import RatingComponent from '../rating-component';
import ReviewItem from './reviewItem';

export default function DisplayCarReview(carId) {
    const { sessionToken } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [size, setSize] = useState(10);
    const [filterBy, setFilterBy] = useState('newest_to_latest');
    const [results, setResults] = useState();
    const [count, setCount] = useState();
    const [star, setStar] = useState(0);

    useEffect(() => {
        const fetchCountData = async () => {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/cars/${carId.carId}/count-review`,
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
                setCount(payload.body);
            });
        };
        fetchCountData();
    }, [carId.carId, sessionToken]);

    useEffect(() => {
        const fetchData = async () => {
            const params = new URLSearchParams({
                page: currentPage,
                size: size,
                sort: filterBy,
                rate: star,
            });
            await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/cars/${carId.carId}?${params.toString()}`,
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
    }, [star, currentPage, size, filterBy, carId.carId, sessionToken]);

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

    const handleRatingButton = (newStar) => {
        setStar(newStar);
    };

    return (
        <div>
            <h1> Average Rating</h1>
            <div className="average">
                <h2> {count?.avg}</h2>
                <RatingComponent initialRating={count?.avg} />
            </div>
            <h1> Details </h1>

            <div className="button-container">
                <button
                    className={`medium-button ${star === 0 ? 'active' : ''}`}
                    onClick={() => handleRatingButton(0)}
                >
                    All ({count?.result[0]})
                </button>
                <button
                    className={`medium-button ${star === 1 ? 'active' : ''}`}
                    onClick={() => handleRatingButton(1)}
                >
                    1 Star ({count?.result[1]})
                </button>
                <button
                    className={`medium-button ${star === 2 ? 'active' : ''}`}
                    onClick={() => handleRatingButton(2)}
                >
                    2 Star ({count?.result[2]})
                </button>
                <button
                    className={`medium-button ${star === 3 ? 'active' : ''}`}
                    onClick={() => handleRatingButton(3)}
                >
                    3 Star ({count?.result[3]})
                </button>
                <button
                    className={`medium-button ${star === 4 ? 'active' : ''}`}
                    onClick={() => handleRatingButton(4)}
                >
                    4 Star ({count?.result[4]})
                </button>
                <button
                    className={`medium-button ${star === 5 ? 'active' : ''}`}
                    onClick={() => handleRatingButton(5)}
                >
                    5 Star ({count?.result[5]})
                </button>
            </div>
            {!results ? (
                <p> Loading</p>
            ) : typeof results.message === 'string' ? (
                <div className="average">
                    <h1> {results.message}</h1>
                </div>
            ) : (
                <div>
                    <div className="controls">
                        <select onChange={handleFilterChange} value={filterBy}>
                            <option value="newest_to_latest">Newest to Latest</option>
                            <option value="latest_to_newest">Latest to Newest</option>
                        </select>
                    </div>
                    {reviewList(results)}
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

function reviewList(results) {
    return (
        <div>
            <ul>
                {results.result.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                ))}
            </ul>
        </div>
    );
}
