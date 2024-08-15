import { useEffect, useState } from 'react';
import RatingComponent from '@/components/cars/rating-component';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAppContext } from '@/app/app-provider';
import { useRouter } from 'next/navigation';
import { formattedNumber } from '@/lib/format-number';

export default function EditCarGeneral({ data, imageData, tab, carId }) {
    const { sessionToken } = useAppContext();
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState(data.carStatus);
    const [booking, setBooking] = useState({});

    useEffect(() => {
        if (Array.isArray(imageData)) {
            setImages(imageData);
        } else {
            console.error('imageData is not an array:', imageData);
        }

        setStatus(data.carStatus);
    }, [imageData, data.carStatus]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking/car-id/${carId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );
                const bookingJson = await bookingResponse.json();

                if (bookingResponse.ok) {
                    setBooking(bookingJson.body);
                }
            } catch (e) {
                console.error('Error get booking', e);
            }
        };
        fetchData();
    }, [carId, sessionToken]);

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        if (
            (status === 'AVAILABLE' && newStatus === 'STOPPED') ||
            (status === 'STOPPED' && newStatus === 'AVAILABLE')
        ) {
            if (confirm('Are you sure you want to stop renting this car?') == true) {
                setStatus(newStatus);
                handleOnSubmit(newStatus);
            } else {
                return;
            }
        }
    };

    const handleOnSubmit = async (status) => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/change-car-status/${carId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify(status),
                },
            );
            window.location.reload();
        } catch (error) {
            console.error('Error change car status:', error);
        }
    };

    const handleConfirmDeposit = async () => {
        try {
            if (
                confirm(
                    'Please confirm that you have receive the deposit this booking. This will allow the customer to pick-up the carat the agreed date and time',
                ) == true
            ) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/confirm-deposit/${carId}/${booking.id}`,
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
            console.error('Error confirm deposit:', error);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            if (
                confirm('Please confirm that you have receive the payment for this booking.') ==
                true
            ) {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/confirm-payment/${carId}/${booking.id}`,
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'text-success fw-bold';
            case 'BOOKED':
                return 'text-warning fw-bold';
            case 'STOPPED':
                return 'text-danger fw-bold';
            default:
                return '';
        }
    };

    const getStatus = () => {
        if (data.carStatus === 'AVAILABLE') {
            return <td className="text-success fw-bold">Available</td>;
        }
        if (data.carStatus === 'BOOKED') {
            return <td className="text-warning fw-bold">Booked</td>;
        } else {
            return <td className="text-danger fw-bold">Stop</td>;
        }
    };

    return (
        <>
            <div className="container-fluid row">
                <br />
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
                                        style={{ width: '500px', height: '300px' }}
                                        src={image.imgURL}
                                        alt={image.imgAlt}
                                        className="img-thumbnail"
                                        width={500}
                                        height={300}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ------- General Information------ */}
                <div className="col-md-8 row my-5">
                    <div className="col-md-9">
                        <h2>{data.brand + ' ' + data.model}</h2>

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="fw-bold">Ratings:</td>
                                    <td className="fw-bold">
                                        <RatingComponent initialRating={Number(data.rate)} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">No. of rides:</td>
                                    <td className="fw-bold">{data.noOfRides}</td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">Price:</td>
                                    <td className="fw-bold">
                                        {formattedNumber(data.basePrice / 1000)} k/day
                                    </td>
                                </tr>

                                <tr>
                                    <td className="fw-bold">Locations:</td>
                                    <td className="fw-bold">
                                        {data.district + ', ' + data.province}
                                    </td>
                                </tr>
                                {tab == 'basicInformation' && (
                                    <tr>
                                        <td className="fw-bold">Status:</td>
                                        <td className="fw-bold">
                                            <select
                                                value={status}
                                                onChange={handleStatusChange}
                                                className={`form-select ${getStatusClass(status)}`}
                                                disabled={status === 'BOOKED'}
                                            >
                                                <option value="AVAILABLE" className="text-success">
                                                    Available
                                                </option>
                                                {status == 'BOOKED' && (
                                                    <option value="BOOKED" className="text-warning">
                                                        Booked
                                                    </option>
                                                )}

                                                <option value="STOPPED" className="text-danger">
                                                    Stop
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                )}

                                {(tab == 'details' || tab == 'termOfUses') && (
                                    <tr>
                                        <td className="fw-bold">Status:</td>
                                        {getStatus()}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-3">
                        {status == 'BOOKED' && booking?.status == 'PENDING_DEPOSIT' && (
                            <form method="POST" onSubmit={handleConfirmDeposit}>
                                <button className="btn btn-primary">Confirm deposit</button>
                            </form>
                        )}

                        {status == 'BOOKED' && booking?.status == 'PENDING_PAYMENT' && (
                            <form method="POST" onSubmit={handleConfirmPayment}>
                                <button className="btn btn-primary">Confirm payment</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
