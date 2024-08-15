'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/app-provider';
import fetchImageURL from '@/lib/fetchImage';
import { useParams } from 'next/navigation';
import EditCarDetail from './detail';
import EditCarPricing from './pricing';
import EditCarBasicInfo from './basic-info';
import EditCarGeneral from './edit-car-general';

// Dynamically import react-bootstrap components.
const Tabs = dynamic(() => import('react-bootstrap/Tabs'), { ssr: false });
const Tab = dynamic(() => import('react-bootstrap/Tab'), { ssr: false });

export default function EditCarContent() {
    const { sessionToken } = useAppContext();
    const params = useParams();
    const id = params.slug;

    const [key, setKey] = useState('basicInformation');

    const [data, setData] = useState({
        id: '',
        licensePlate: '',
        color: '',
        numberOfSeats: '',
        productionYear: '',
        transmissionType: '',
        fuelType: '',
        fuelConsumption: '',
        mileage: '',
        basePrice: '',
        deposit: '',
        description: '',
        frontImage: '',
        backImage: '',
        leftImage: '',
        rightImage: '',
        address: '',
        ward: '',
        district: '',
        province: '',
        carStatus: '',
        model: '',
        brand: '',
        document: [],
        additionFunctions: [],
        TermOfUses: [],
        rate: '',
        noOfRides: '',
    });

    const [image, setImage] = useState([]);
    const [additionFunctionList, setAdditionFunctionList] = useState([]);
    const [termOfUses, setTermOfUses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const carResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/detail?id=${id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                const additionFunctionResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/addition/addition-function`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                const termOfUseResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/addition/term-use`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                if (!carResponse.ok || !additionFunctionResponse.ok || !termOfUseResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const carResponseJson = await carResponse.json();
                const additionFunctionJson = await additionFunctionResponse.json();
                const termOfUseJson = await termOfUseResponse.json();

                if (carResponseJson.isSuccess) {
                    const carResponseBody = carResponseJson.body;
                    const formatResponse = {
                        id: carResponseBody.id || '',
                        licensePlate: carResponseBody.licensePlate || '',
                        color: carResponseBody.color || '',
                        numberOfSeats: carResponseBody.numberOfSeats || '',
                        productionYear: carResponseBody.productionYear || '',
                        transmissionType: carResponseBody.transmissionType || '',
                        fuelType: carResponseBody.fuelType || '',
                        fuelConsumption: carResponseBody.fuelConsumption || '',
                        mileage: carResponseBody.mileage || '',
                        basePrice: carResponseBody.basePrice || '',
                        deposit: carResponseBody.deposit || '',
                        description: carResponseBody.description || '',
                        frontImage: carResponseBody.frontImage || '',
                        backImage: carResponseBody.backImage || '',
                        leftImage: carResponseBody.leftImage || '',
                        rightImage: carResponseBody.rightImage || '',
                        address: carResponseBody.address || '', //todo: add ward, district, province
                        ward: carResponseBody.ward || '',
                        district: carResponseBody.district || '',
                        province: carResponseBody.province || '',
                        carStatus: carResponseBody.carStatus || '',
                        model: carResponseBody.model || '',
                        brand: carResponseBody.brand || '',
                        document: carResponseBody.document || '',
                        additionFunctions: carResponseBody.additionFunctions || '',
                        TermOfUses: carResponseBody.termOfUses || '',
                        rate: carResponseBody.rate || 0,
                        noOfRides: carResponseBody.noOfRides || 0,
                    };
                    setData(formatResponse);

                    if (formatResponse.frontImage) {
                        const frontImageUrl = await fetchImageURL(formatResponse.frontImage);
                        setImage((prev) => [
                            ...prev,
                            {
                                imgURL: frontImageUrl,
                                imgAlt: 'front image',
                            },
                        ]);
                    }
                    if (formatResponse.backImage) {
                        const backImage = await fetchImageURL(formatResponse.backImage);
                        setImage((prev) => [
                            ...prev,
                            {
                                imgURL: backImage,
                                imgAlt: 'back image',
                            },
                        ]);
                    }
                    if (formatResponse.leftImage) {
                        const leftImage = await fetchImageURL(formatResponse.leftImage);
                        setImage((prev) => [
                            ...prev,
                            {
                                imgURL: leftImage,
                                imgAlt: 'left image',
                            },
                        ]);
                    }
                    if (formatResponse.rightImage) {
                        const rightImage = await fetchImageURL(formatResponse.rightImage);
                        setImage((prev) => [
                            ...prev,
                            {
                                imgURL: rightImage,
                                imgAlt: 'right image',
                            },
                        ]);
                    }
                }

                if (additionFunctionJson.isSuccess) {
                    const additionFunctionResponseBody = additionFunctionJson.body;
                    setAdditionFunctionList(additionFunctionResponseBody);
                }
                if (termOfUseJson.isSuccess) {
                    const termOfUseResponseBody = termOfUseJson.body;
                    setTermOfUses(termOfUseResponseBody);
                }
            } catch (e) {
                console.error('Error fetching data:', e);
            }
        };
        fetchData();
    }, [id, sessionToken]);

    return (
        <>
            <div className="column">
                <div className="container">
                    <EditCarGeneral data={data} imageData={image} tab={key} carId={id} />
                </div>

                <div className="my-3 container">
                    <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
                        <Tab eventKey="basicInformation" title="Basic Information">
                            <EditCarBasicInfo data={data} tab={key} />
                        </Tab>
                        <Tab eventKey="details" title="Details">
                            <EditCarDetail
                                data={data}
                                additionFunctions={additionFunctionList}
                                imageData={image}
                                tab={key}
                                carId={id}
                            />
                        </Tab>
                        <Tab eventKey="termOfUses" title="Pricing">
                            <EditCarPricing
                                data={data}
                                termOfUses={termOfUses}
                                tab={key}
                                carId={id}
                            />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
