import React from 'react';
import './item.css'
import RatingComponent from '../rating-component';

export default function ReviewItem({ review }) {
    return (
        <li key={review.id}>
            <div className="review-item">
                <div className="user-info">
                    <span className="user-icon">👤</span>
                    <span className="user-name">{review.userName}</span>
                    <div className='rating'>
                    <RatingComponent initialRating={review.rate} />
                    <span className="review-date">12/02/2022 08:30</span>
                    </div>
                    
                </div>
                <p className="review-text">
                    {review.content}
                </p>

                <div className="product-info">
                    <div className="product-image"></div>
                    <div className="product-details">
                        <h3 className="product-name">{review.carName}</h3>
                        <p className="booking-period">
                            <span className="label">From:</span> {review.start}<br/>
                            <span className="label">To:</span> {review.end}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}
