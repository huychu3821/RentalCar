import { useEffect, useState } from 'react';
import RatingComponent from './rating-component';
import Link from 'next/link';
import { formattedNumber } from '@/lib/format-number';
import Image from 'next/image';
export default function GeneralInformation({ data, imageData }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (Array.isArray(imageData)) {
            setImages(imageData);
        } else {
            console.error('imageData is not an array:', imageData);
        }
    }, [imageData]);

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
                <div
                    id="carouselExampleIndicators"
                    className="carousel slide col-md-4"
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

                {/* ------- General Information------ */}
                <div className="container-fluid col-md-8 row">
                    <div className="col-md-9">
                        <h2>{data.brand + ' ' + data.model}</h2>

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="fw-bold">Ratings:</td>
                                    <td className="fw-bold">
                                        <RatingComponent initialRating={data.rate} />
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
                                <tr>
                                    <td className="fw-bold">Status:</td>
                                    {getStatus()}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-3">
                        <Link
                            className="btn btn-primary mt-3"
                            href={`/customer/rent-a-car?id=${data.id}`}
                        >
                            Rent now
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
