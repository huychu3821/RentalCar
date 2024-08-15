import dynamic from 'next/dynamic';
import BasicInformation from './basic-information';
import Details from './detail';
import TermOfUses from './term-of-use';
import GeneralInformation from './general-information';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/app-provider';
import fetchImageURL from '@/lib/fetchImage';

// Dynamically import react-bootstrap components.
const Tabs = dynamic(() => import('react-bootstrap/Tabs'), { ssr: false });
const Tab = dynamic(() => import('react-bootstrap/Tab'), { ssr: false });

export default function DetailLayout({ id }) {
    const { sessionToken } = useAppContext();

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
        address: '', //todo: add ward, district, province
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
        noOfRides: 0,
    });

    const [image, setImage] = useState([]);

    const [additionFunctionList, setAdditionFunctionList] = useState([]);
    const [termOfUses, setTermOfUses] = useState([]);
    // ${id.id}
    useEffect(() => {
        const fetchData = async () => {
            try {
                const carResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/detail?id=${id}`,
                    {
                        // mode: 'no-cors',
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
                        //todo: set back image
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
    }, [id.id, sessionToken]);

    return (
        <>
            <div className="column">
                <div className="Container">
                    <GeneralInformation data={data} imageData={image} />
                </div>

                <div className="my-3">
                    <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
                        <Tab eventKey="basicInformation" title="BasicInformation">
                            <BasicInformation data={data} />
                        </Tab>
                        <Tab eventKey="details" title="Details">
                            <Details data={data} additionFunctions={additionFunctionList} />
                        </Tab>
                        <Tab eventKey="termOfUses" title="TermOfUses">
                            <TermOfUses data={data} termOfUses={termOfUses} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
