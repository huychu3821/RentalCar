'use client';
import RatingComponent from '@/components/cars/rating-component';
import { useState } from 'react';
import { useAppContext } from '@/app/app-provider';
import './style.css';

export default function OwnerRating() {
    const [star, setStar] = useState();
    const { sessionToken } = useAppContext();

    const fetchData = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/rating`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionToken}`,
            },
            method: 'GET',
        }).then(async (res) => {
            const payload = await res.json();
            setStar(payload.body);
        });
    };
    if (!star) fetchData();

    return (
        <>
            <h2> Average Rating</h2>
            <div className="center">
                <h3> {star?.avg}</h3>
                <p> {`(${star?.numberOfReview})`}</p>
                <RatingComponent initialRating={star?.avg} />
            </div>
        </>
    );
}
