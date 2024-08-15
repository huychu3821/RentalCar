'use client';

import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAppContext } from '@/app/app-provider';
import ReactStars from 'react-rating-stars-component';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AfterBookingDetails({ bookingData, roundedDays, images, bookingId }) {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState();
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [loading, setLoading] = useState(false);
    const [showModalReturnCar, setShowModalReturnCar] = useState(false);
    const [errorReturnCar, setErrorReturnCar] = useState();
    const handleShowReturnCar = () => setShowModalReturnCar(true);
    const handleCloseReturnCar = () => setShowModalReturnCar(false);

    const [cancelBookingShow, setCancelBookingShow] = useState(false);
    const [topUpCancelBookingShow, setTopUpCancelBookingShow] = useState(false);
    const { sessionToken } = useAppContext();
    const router = useRouter();

    const [showRatingModal, setShowRatingModal] = useState(false);
    const handleCloseRatingModal = () => setShowRatingModal(false);
    const [formData, setFormData] = useState({
        bookingId: bookingId,
        rate: '',
        content: '',
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    const confirm = async (e) => {
        e.preventDefault();
        let responseJson = {};
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/confirm-pick-up/${bookingId}`,
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
                window.location.reload()
            } else {
                alert('Error happened while confirm');
                setShowModal(false);
            }
        } catch (error) {
            setError(responseJson.error);
        }
        setShowModal(false);
    };
    const confirmReturnCar = async (e) => {
        e.preventDefault();
        setLoading(true);
        let responseJson = {};
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/return-car/${bookingId}`,
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
            setLoading(false);
        }
        setShowModalReturnCar(false);
    };

    const handleOnClickCancelBooking = async () => {
        try {
            setTopUpCancelBookingShow(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/cancel-booking?booking-id=${bookingId}`,
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
    function formatDateTime(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }
    return (
        <div className="container mb-3">
            <h3 className="fw-bold">Booking Details</h3>
            <div className="row">
                <div className="col-md-6">
                    <div
                        id="carouselExampleIndicators"
                        className="carousel slide"
                        data-bs-ride="carousel"
                    >
                        <div className="carousel-indicators">
                            <button
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to="0"
                                className="active"
                                aria-current="true"
                                aria-label="Slide 1"
                            ></button>
                            <button
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to="1"
                                aria-label="Slide 2"
                            ></button>
                            <button
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to="2"
                                aria-label="Slide 3"
                            ></button>
                            <button
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to="3"
                                aria-label="Slide 4"
                            ></button>
                        </div>
                        <div className="carousel-inner">
                            {images.map((image, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                    >
                                        <Image
                                            src={image.imgURL}
                                            className="d-block"
                                            alt={image.imgAlt}
                                            width={500}
                                            height={300}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-md-6 d-flex">
                    <div className="col-md-8">
                        <h4 className="fw-bold">{bookingData.carName}</h4>
                        <ul>
                            <li>
                                <p>From: {formatDateTime(bookingData.startDate)}</p>
                            </li>
                            <li>
                                <p>To: {formatDateTime(bookingData.endDate)}</p>
                            </li>
                        </ul>
                        <p className="fw-bold m-2">Number of days: {roundedDays} days</p>
                        <p className="fw-bold m-2">Base price: {bookingData.basePrice}</p>
                        <p className="fw-bold m-2">Total: {bookingData.totalAmount}</p>
                        <p className="fw-bold m-2">Deposit: {bookingData.deposit}</p>
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
                                <span className="fw-bold text-text-secondary">
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
                                    className="btn btn-primary m-2 col-8"
                                    href={`/customer/booking/${bookingId}`}
                                >
                                    View details
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-success m-2 col-8"
                                    onClick={handleShow}
                                >
                                    Confirm pick-up
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-danger m-2 col-8"
                                    onClick={() => setCancelBookingShow(true)}
                                >
                                    Cancel booking
                                </Button>
                            </>
                        )}
                        {bookingData.status === 'PENDING_DEPOSIT' && (
                            <>
                                <Button
                                    type="button"
                                    className="btn btn-primary m-2 col-8"
                                    href={`/customer/booking/${bookingId}`}
                                >
                                    View details
                                </Button>
                                <button
                                    type="button"
                                    className="btn btn-danger m-2 col-8"
                                    onClick={() => setCancelBookingShow(true)}
                                >
                                    Cancel booking
                                </button>
                            </>
                        )}
                        {bookingData.status === 'IN_PROGRESS' && (
                            <>
                                <Button
                                    type="button"
                                    className="btn btn-primary m-2 col-8"
                                    href={`/customer/booking/${bookingId}`}
                                >
                                    View details
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-primary m-2 col-8"
                                    onClick={handleShowReturnCar}
                                >
                                    Return car
                                </Button>
                            </>
                        )}
                        {bookingData.status === 'PENDING_PAYMENT' && (
                            <Button
                                type="button"
                                className="btn btn-primary m-2 col-8"
                                href={`/customer/booking/${bookingId}`}
                            >
                                View details
                            </Button>
                        )}
                        {bookingData.status === 'COMPLETED' && (
                            <Button
                                type="button"
                                className="btn btn-primary m-2 col-8"
                                href={`/customer/booking/${bookingId}`}
                            >
                                View details
                            </Button>
                        )}
                        {bookingData.status === 'CANCELLED' && (
                            <Button
                                type="button"
                                className="btn btn-primary m-2 col-8"
                                href={`/customer/booking/${bookingId}`}
                            >
                                View details
                            </Button>
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
                    {bookingData.totalAmount > bookingData.deposit && (
                        <p>
                            Please confirm to return the car. The remaining amount of{' '}
                            {bookingData.totalAmount - bookingData.deposit}
                            VND will be deducted from your wallet.
                        </p>
                    )}
                    {bookingData.totalAmount < bookingData.deposit && (
                        <p>
                            Please confirm to return the car. The exceeding amount of{' '}
                            {bookingData.deposit - bookingData.totalAmount}
                            VND will be returned to your wallet.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {loading ? (
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

            {(error || errorReturnCar) && (
                <div className="alert alert-danger mt-4">{error || errorReturnCar}</div>
            )}
        </div>
    );
}
