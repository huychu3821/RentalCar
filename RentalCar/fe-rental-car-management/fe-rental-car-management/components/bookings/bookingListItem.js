import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './bookingItem.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReactStars from 'react-rating-stars-component';
import fetchImageURL from '@/lib/fetchImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import { Modal, Button } from 'react-bootstrap';
import { useAppContext } from '@/app/app-provider';
import { useRouter } from 'next/navigation';
import { formattedNumber } from './../../lib/format-number';

function BookingItem({ bookingData }) {
    const [images, setImages] = useState([]);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const handleCloseRatingModal = () => setShowRatingModal(false);

    const [loading, setLoading] = useState(true);
    const [loadingReturn, setLoadingReturn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState();
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [cancelBookingShow, setCancelBookingShow] = useState(false);
    const [topUpCancelBookingShow, setTopUpCancelBookingShow] = useState(false);

    const [showModalReturnCar, setShowModalReturnCar] = useState(false);
    const [errorReturnCar, setErrorReturnCar] = useState();
    const handleShowReturnCar = () => setShowModalReturnCar(true);
    const handleCloseReturnCar = () => setShowModalReturnCar(false);

    const { sessionToken } = useAppContext();
    const router = useRouter();
    const confirm = async (e) => {
        e.preventDefault();
        let responseJson = {};
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/confirm-pick-up/${bookingData.bookingNumber.split('-')[1]}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                },
            );
            responseJson = await response.json();
            if (responseJson.status === 200) {
                setShowModal(false);
                window.location.reload();
            } else {
                alert('Error happened while confirm');
                setShowModal(false);
            }
        } catch (error) {
            setError(responseJson.error);
        }
        setShowModal(false);
    };
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    useEffect(() => {
        setTimeout(() => {
            const fetchImages = async () => {
                if (bookingData.frontImage !== null) {
                    try {
                        const frontImage = await fetchImageURL(`${bookingData.frontImage}`);
                        const backImage = await fetchImageURL(`${bookingData.backImage}`);
                        const leftImage = await fetchImageURL(`${bookingData.leftImage}`);
                        const rightImage = await fetchImageURL(`${bookingData.rightImage}`);
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
    }, [
        bookingData.backImage,
        bookingData.frontImage,
        bookingData.leftImage,
        bookingData.rightImage,
    ]);
    const ratingChanged = (newRating) => {
        setFormData((prev) => ({
            ...prev,
            rate: newRating,
        }));
    };
    const handleSkipOnClick = () => {
        setShowRatingModal(false);
        window.location.reload();
    };
    const [formData, setFormData] = useState({
        bookingId: bookingData.id,
        rate: '',
        content: '',
    });
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/customer/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(formData),
            });
            window.location.reload();
        } catch (e) {
            console.error('Give ratings fail', e);
        }
    };
    const confirmReturnCar = async (e) => {
        e.preventDefault();
        setLoadingReturn(true);
        let responseJson = {};
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/return-car/${bookingData.bookingNumber.split('-')[1]}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                },
            );
            responseJson = await response.json();
            if (responseJson.status === 200) {
                setShowModalReturnCar(false);
                // show modal ratings
                setShowRatingModal(true);
            } else {
                alert('Error happened while confirm');
                setShowModalReturnCar(false);
            }
        } catch (error) {
            setErrorReturnCar(responseJson.error);
        } finally {
            setLoadingReturn(false);
        }
        setShowModalReturnCar(false);
    };
    const handleOnClickCancelBooking = async () => {
        try {
            setTopUpCancelBookingShow(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/cancel-booking?booking-id=${bookingData.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                },
            );
            if (response.ok) {
                alert('Booking canceled successfully');
                window.location.reload();
            } else {
                alert('An error occurred during cancellation');
            }
        } catch (error) {
            alert('Can not cancel booking');
        }
    };

    return (
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
                        <h4 className="fw-bold">{bookingData.name}</h4>
                        <ul>
                            <li>
                                <p>From: {bookingData.pickUpDateTime}</p>
                            </li>
                            <li>
                                <p>To: {bookingData.returnDateTime}</p>
                            </li>
                        </ul>
                        <p className="fw-bold m-2">
                            Number of days: {bookingData.numberOfDays} days
                        </p>
                        <p className="fw-bold m-2">
                            Base price: {formattedNumber(bookingData.basePrice)}
                        </p>
                        <p className="fw-bold m-2">Total: {formattedNumber(bookingData.total)}</p>
                        <p className="fw-bold m-2">
                            Deposit: {formattedNumber(bookingData.deposit)}
                        </p>
                        <p className="fw-bold m-2">Booking No. {bookingData.bookingNumber}</p>
                        <p className="fw-bold m-2">
                            Booking status:
                            {bookingData.status === 'CONFIRMED' && (
                                <span className="fw-bold text-success"> {bookingData.status}</span>
                            )}
                            {bookingData.status === 'PENDING_DEPOSIT' && (
                                <span className="fw-bold text-danger"> {bookingData.status}</span>
                            )}
                            {bookingData.status === 'IN_PROGRESS' && (
                                <span className="fw-bold text-danger"> {bookingData.status}</span>
                            )}
                            {bookingData.status === 'PENDING_PAYMENT' && (
                                <span className="fw-bold text-danger"> {bookingData.status}</span>
                            )}
                            {bookingData.status === 'COMPLETED' && (
                                <span className="fw-bold text-primary"> {bookingData.status}</span>
                            )}
                            {bookingData.status === 'CANCELLED' && (
                                <span className="fw-bold text-secondary">
                                    {' '}
                                    {bookingData.status}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="col-md-4">
                        {bookingData.status === 'CONFIRMED' && (
                            <>
                                <Button
                                    type="button"
                                    className="btn btn-primary m-2 w-100"
                                    href={`/customer/booking/${bookingData.bookingNumber.split('-')[1]}`}
                                >
                                    View details
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-success m-2 w-100"
                                    onClick={handleShow}
                                >
                                    Confirm pick-up
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-danger m-2 w-100"
                                    onClick={() => setCancelBookingShow(true)}
                                >
                                    Cancel booking
                                </Button>
                            </>
                        )}
                        {bookingData.status === 'PENDING_DEPOSIT' && (
                            <>
                                <Link
                                    type="button"
                                    className="btn btn-primary m-2 w-100"
                                    href={`/customer/booking/${bookingData.bookingNumber.split('-')[1]}`}
                                >
                                    View details
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-danger m-2 w-100"
                                    onClick={() => setCancelBookingShow(true)}
                                >
                                    Cancel booking
                                </button>
                            </>
                        )}
                        {bookingData.status === 'IN_PROGRESS' && (
                            <>
                                <Link
                                    type="button"
                                    className="btn btn-primary m-2 w-100"
                                    href={`/customer/booking/${bookingData.bookingNumber.split('-')[1]}`}
                                >
                                    View details
                                </Link>
                                <Button
                                    type="button"
                                    className="btn btn-primary m-2 w-100"
                                    onClick={handleShowReturnCar}
                                >
                                    Return car
                                </Button>
                            </>
                        )}
                        {(bookingData.status === 'PENDING_PAYMENT' ||
                            bookingData.status === 'COMPLETED' ||
                            bookingData.status === 'CANCELLED') && (
                            <Link
                                type="button"
                                className="btn btn-primary m-2 w-100"
                                href={`/customer/booking/${bookingData.bookingNumber.split('-')[1]}`}
                            >
                                View details
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Body>Are you sure you want to confirm pick-up for this booking?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={confirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                backdrop="static"
                show={cancelBookingShow}
                onHide={() => setCancelBookingShow(false)}
            >
                <Modal.Body>
                    <p>Are you sure you want to cancel this booking?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        disabled={topUpCancelBookingShow}
                        onClick={() => setCancelBookingShow(false)}
                    >
                        Close
                    </Button>

                    <Button
                        variant="primary"
                        disabled={topUpCancelBookingShow}
                        onClick={() => {
                            handleOnClickCancelBooking();
                        }}
                    >
                        {topUpCancelBookingShow ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : null}
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalReturnCar} onHide={handleCloseReturnCar}>
                <Modal.Header>Return car</Modal.Header>
                <Modal.Body>
                    {bookingData.total > bookingData.deposit && (
                        <p>
                            Please confirm to return the car. The remaining amount of{' '}
                            {bookingData.total - bookingData.deposit}
                            VND will be deducted from your wallet.
                        </p>
                    )}
                    {bookingData.total < bookingData.deposit && (
                        <p>
                            Please confirm to return the car. The exceeding amount of{' '}
                            {bookingData.deposit - bookingData.total}
                            VND will be returned to your wallet.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {loadingReturn ? (
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={handleCloseReturnCar}>
                                No
                            </Button>
                            <Button variant="primary" onClick={confirmReturnCar}>
                                Yes
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
            <Modal
                show={showRatingModal}
                onHide={handleCloseRatingModal}
                centered
                className="margin: auto"
            >
                <form method="POST" onSubmit={handleOnSubmit}>
                    <Modal.Body className="text-center">
                        <h3>Rate your trip</h3>
                        <p>Do you enjoy your trip? Please let us know what you think</p>
                        <div className="d-flex justify-content-center">
                            <ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={30}
                                // isHalf={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                                activeColor="#ffd700"
                            />
                        </div>
                        <textarea
                            rows="6"
                            name="content"
                            value={formData.content || ''}
                            onChange={handleOnChange}
                            className="form-control border border-dark"
                        />
                        {error && <p className="text-danger">{error}</p>}
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-around">
                        <Button
                            variant="secondary"
                            onClick={handleSkipOnClick}
                            className="bg-secondary-subtle text-black"
                        >
                            Skip
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="bg-secondary-subtle text-black"
                        >
                            Send Review
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}

export default BookingItem;
