'use client';
import { formattedNumber } from '@/lib/format-number';
import RatingComponent from '../cars/rating-component';
import fetchImageURL from '@/lib/fetchImage';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function CarInfo({ carData, images }) {
    const [img, setImg] = useState();
    const getStatus = () => {
        if (carData.carStatus === 'AVAILABLE') {
            return <td className="text-success fw-bold">Available</td>;
        }
        if (carData.carStatus === 'BOOKED') {
            return <td className="text-warning fw-bold">Booked</td>;
        } else {
            return <td className="text-danger fw-bold">Stop</td>;
        }
    };
    useEffect(() => {
        const fetchInitialImage = async () => {
            try {
                const url = await fetchImageURL(images);
                setImg(url);
            } catch (error) {
                console.error('Error fetching initial image:', error);
            }
        };

        fetchInitialImage();
    }, [images]);
    return (
        <>
            <h2>{carData.brand + ' ' + carData.model}</h2>
            <div>
                <Image
                    style={{ width: '300px', height: '200px' }}
                    src={img}
                    alt="image"
                    width={300}
                    height={200}
                />
            </div>
            <table className="table">
                <tbody>
                    <tr>
                        <td className="fw-bold">Ratings:</td>
                        <td className="fw-bold">
                            <RatingComponent initialRating={carData.rate} />
                        </td>
                    </tr>
                    <tr>
                        <td className="fw-bold">No. of rides:</td>
                        <td className="fw-bold">{carData.noOfRides}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold">Price:</td>
                        <td className="fw-bold">
                            {formattedNumber(carData.basePrice / 1000)} k/day
                        </td>
                    </tr>

                    <tr>
                        <td className="fw-bold">Locations:</td>
                        <td className="fw-bold">{carData.district + ', ' + carData.province}</td>
                    </tr>
                    <tr>
                        <td className="fw-bold">Status:</td>
                        {getStatus()}
                    </tr>
                </tbody>
            </table>
        </>
    );
}
