'use client';
import { useAppContext } from '@/app/app-provider';

import MultiStepForm from '@/components/rent-a-car/multi-step-form';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default async function RentACarPage() {
    const [images, setImages] = useState('');
    const { sessionToken } = useAppContext();
    const router = useRouter();
    const [data, setData] = useState({
        id: '',
        productionYear: '',
        basePrice: '',
        deposit: '',
        frontImage: '',
        carStatus: '',
        model: '',
        brand: '',
        district: '',
        province: '',
        rate: '',
        noOfRides: '',
    });
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const carResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/check-status?id=${id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${sessionToken}`,
                            },
                        },
                    );

                    if (!carResponse.ok) {
                        router.push('/customer/cars/search');
                        alert('Car is booked or cancelled');
                    }

                    const carResponseJson = await carResponse.json();
                    if (carResponseJson.isSuccess == true) {
                        const carResponseBody = carResponseJson.body;
                        const formatResponse = {
                            id: carResponseBody.id || '',
                            productionYear: carResponseBody.productionYear || '',
                            basePrice: carResponseBody.basePrice || '',
                            deposit: carResponseBody.deposit || '',
                            frontImage: carResponseBody.frontImage || '',
                            carStatus: carResponseBody.carStatus || '',
                            model: carResponseBody.model || '',
                            brand: carResponseBody.brand || '',
                            rate: carResponseBody.rate || 0,
                            district: carResponseBody.district || '',
                            province: carResponseBody.province || '',
                            noOfRides: carResponseBody.noOfRides || 0,
                        };
                        setData(formatResponse);
                        setImages(formatResponse.frontImage);
                    }
                } catch (e) {
                    console.error('Error fetching data:', e);
                }
            };

            fetchData();
        }
    }, [router, id, sessionToken]);
    return (
        <>
            <MultiStepForm carData={data} images={images} />
        </>
    )
}