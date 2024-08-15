import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './ownercars.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import fetchImageURL from '@/lib/fetchImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import RatingComponent from '@/components/cars/rating-component';
import { formattedNumber } from '@/lib/format-number';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/app-provider';

import { Button } from 'react-bootstrap';

export default function OwnerCarItem({ car }) {
    const { sessionToken } = useAppContext();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const pathName = usePathname();

    const handleConfirmDeposit = async (carId) => {
        try {
            if (
                confirm(
                    'Please confirm that you have receive the deposit this booking. This will allow the customer to pick-up the carat the agreed date and time',
                ) == true
            ) {
                let bid;

                const bookingResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/car-id/${carId}`,
                    {
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                const bookingJson = await bookingResponse.json();
                if (bookingResponse.ok) {
                    bid = bookingJson.body.id;
                } else {
                    console.error('Error fetching booking id:', bookingJson.message);
                }

                await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/confirm-deposit/${carId}/${bid}`,
                    {
                        mode: 'cors',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );
                router.refresh();
            } else {
                return;
            }
        } catch (error) {
            console.error('Error confirm deposit:', error);
        }
    };

    const handleConfirmPayment = async (carId) => {
        try {
            if (
                confirm('Please confirm that you have receive the payment for this booking.') ==
                true
            ) {
                let bid;

                const bookingResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/car-id/${carId}`,
                    {
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                const bookingJson = await bookingResponse.json();
                if (bookingResponse.ok) {
                    bid = bookingJson.body.id;
                } else {
                    console.error('Error fetching booking id:', bookingJson.message);
                }

                await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/confirm-payment/${carId}/${bid}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );
                router.refresh();
            } else {
                return;
            }
        } catch (error) {
            console.error('Error confirm payment:', error);
        }
    };

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
                        setImages([frontImage, backImage, frontImage, backImage]);
                    } catch (error) {
                        console.error('Error fetching images:', error);
                    }
                }
            };

            fetchImages();
            setLoading(false);
        }, 2000);
    }, [car]);

    return (
        <li>
            <div className="container mb-3">
                <div className="row">
                    <div className="col-md-6">
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
                    </div>
                    <div className="col-md-6 d-flex">
                        <div className="col-md-8">
                            <h4 className="fw-bold">{car.name}</h4>
                            <p className="fw-bold m-2">
                                <RatingComponent initialRating={car.rating} />
                            </p>
                            <p className="fw-bold m-2">No. of rides: {car.numberOfRides}</p>
                            <p className="fw-bold m-2">
                                Base price: {formattedNumber(car.price / 1000)} k/day
                            </p>
                            <p className="fw-bold m-2">Location: {car.location}</p>
                            <p className="fw-bold m-2">
                                Status:
                                {car.status === 'AVAILABLE' && (
                                    <span className="fw-bold text-success"> {car.status}</span>
                                )}
                                {car.status === 'STOPPED' && (
                                    <span className="fw-bold text-danger"> {car.status}</span>
                                )}
                                {car.status === 'BOOKED' && (
                                    <span className="fw-bold text-primary"> {car.status}</span>
                                )}
                            </p>
                        </div>
                        <div className="col-md-4">
                            {(car.status === 'AVAILABLE' || car.status === 'STOPPED') && (
                                <>
                                    {pathName !== '/owner/report' && (
                                        <Link
                                            type="button"
                                            className="btn btn-primary m-2 w-100"
                                            href={`/owner/edit-car-information/${car.carId}`}
                                        >
                                            View details
                                        </Link>
                                    )}
                                    <Link
                                        type="button"
                                        className="btn btn-primary m-2 w-100"
                                        href={`/owner/cars/${car.carId}`}
                                    >
                                        View Feedbacks
                                    </Link>
                                </>
                            )}
                            {car.status === 'BOOKED' && (
                                <>
                                    {pathName !== '/owner/report' && (
                                        <Link
                                            type="button"
                                            className="btn btn-primary m-2 w-100"
                                            href={`/owner/edit-car-information/${car.carId}`}
                                        >
                                            View Details
                                        </Link>
                                    )}
                                    {car.bookingStatus === 'PENDING_DEPOSIT' &&
                                        pathName !== '/owner/report' && (
                                            <Button
                                                type="button"
                                                className="btn btn-primary m-2 w-100"
                                                onClick={() => handleConfirmDeposit(car.carId)}
                                            >
                                                Confirm Deposit
                                            </Button>
                                        )}

                                    {car.bookingStatus === 'PENDING_PAYMENT' &&
                                        pathName !== '/owner/report' && (
                                            <>
                                                <Button
                                                    type="button"
                                                    className="btn btn-primary m-2 w-100"
                                                    onClick={() => handleConfirmPayment(car.carId)}
                                                >
                                                    Confirm Payment
                                                </Button>
                                            </>
                                        )}
                                    <Link
                                        type="button"
                                        className="btn btn-primary m-2 w-100"
                                        href={`/owner/cars/${car.carId}`}
                                    >
                                        View Feedbacks
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}
