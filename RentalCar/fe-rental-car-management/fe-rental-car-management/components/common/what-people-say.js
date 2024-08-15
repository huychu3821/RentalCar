'use client';
import { useEffect, useState } from 'react';
import RatingComponent from '../cars/rating-component';
import Image from 'next/image';

export default function WhatPeopleSay() {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/guest/top-recent-rating`,
                );
                const data = await response.json();
                setUserData(data.body); // Đảm bảo rằng dữ liệu được lưu dưới dạng mảng
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="container-fluid bg-secondary-subtle">
            <br />
            <h2 className="mx-4">What people say?</h2>
            <div className="row d-flex justify-content-around">
                {userData.map((review, index) => (
                    <div key={index} className="card col-md-5 m-3">
                        <div className="row g-0">
                            <div className="col-4 d-flex justify-content-center align-self-center">
                                {}
                                <div className="avatar-placeholder">
                                    <img
                                        src="https://via.placeholder.com/150"
                                        alt="User avatar"
                                        className="img-fluid rounded-circle"
                                    />
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="card-body">
                                    <h5 className="card-title">{review.username}</h5>
                                    <p className="card-text">{review.content}</p>
                                    {<RatingComponent initialRating={review.rate} />}
                                    <p className="card-text">
                                        <small className="text-body-secondary">
                                            {new Date(review.time).toLocaleString()}
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
