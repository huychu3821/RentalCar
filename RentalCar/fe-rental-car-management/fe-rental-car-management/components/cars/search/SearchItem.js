import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import RatingComponent from '../rating-component';
import fetchImageURL from '@/lib/fetchImage';
import { formattedNumber } from '@/lib/format-number';

const CarItem = ({ car }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const fetchImages = async () => {
                if (car.frontImage !== null) {
                    try {
                        const frontImage = await fetchImageURL(`${car.frontImage}`);
                        const backImage = await fetchImageURL(`${car.backImage}`);
                        const leftImage = await fetchImageURL(`${car.leftImage}`);
                        const rightImage = await fetchImageURL(`${car.rightImage}`);
                        setImages([frontImage, backImage, leftImage, rightImage]);
                    } catch (error) {
                        console.error('Error fetching images:', error);
                    }
                } else {
                    try {
                        const frontImage =
                            'https://firebasestorage.googleapis.com/v0/b/rentail-car-management.appspot.com/o/front.jpg?alt=media&token=b56b29bd-09d9-424f-a9e8-1432e7f11d1f';
                        const backImage =
                            'https://firebasestorage.googleapis.com/v0/b/rentail-car-management.appspot.com/o/back.jpg?alt=media&token=28369521-4260-471a-ad69-d299b0343f4c';
                        setImages([frontImage, backImage]);
                    } catch (error) {
                        console.error('Error fetching images:', error);
                    }
                }
            };

            fetchImages();
            setLoading(false);
        }, 2000);
    }, [car.backImage, car.frontImage, car.leftImage, car.rightImage]);

    return (
        <li key={car.carId} className="car-item">
            <div className="car-image">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="col-md-4">
                        <Swiper
                            navigation
                            pagination={{ type: 'fraction' }}
                            modules={[Navigation, Pagination]}
                            className="rounded"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <div className="text-center">
                                        <Image
                                            src={image}
                                            alt={' '}
                                            className="img-thumbnail"
                                            width={500}
                                            height={300}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
            <div className="car-details">
                <h3>{car.name}</h3>
                <div className="car-rating">
                    <RatingComponent initialRating={car.rating} />
                </div>
                <div>No. of rides: {car.numberOfRides}</div>
                <div>Price: {formattedNumber(car.price / 1000)} k/day</div>
                <div>Locations: {car.location}</div>
                <div>
                    Status: <span className={car.status.toLowerCase()}>{car.status}</span>
                </div>
                <div className="car-actions">
                    <Link
                        className={`rent-now btn btn-primary ${car.status === 'BOOKED' ? 'disabled' : ''}`}
                        href={`/customer/rent-a-car?id=${car.carId}`}
                        aria-disabled={car.status === 'BOOKED'}
                    >
                        Rent now
                    </Link>
                    <Link className="view-details btn" href={`/customer/cars/detail/${car.carId}`}>
                        View details
                    </Link>
                </div>
            </div>
        </li>
    );
};

export default CarItem;
