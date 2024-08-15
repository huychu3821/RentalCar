import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/app-provider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function EditCarDetail({ data, additionFunctions, imageData, carId }) {
    const { sessionToken } = useAppContext();
    const router = useRouter();
    const [additions, setAdditions] = useState(additionFunctions);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    const isContain = (item) => {
        return data.additionFunctions.some((id) => item.id === id);
    };

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        if (Array.isArray(imageData)) {
            setImages(imageData);
        } else {
            console.error('imageData is not an array:', imageData);
        }

        const fetchData = async () => {
            try {
                const addressResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/address`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );

                if (!addressResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const resultAddressInfo = await addressResponse.json();
                if (resultAddressInfo.isSuccess) {
                    setProvinces(resultAddressInfo.body);
                }
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        };
        fetchData();
        setFormData((prevFormData) => ({
            ...prevFormData,
            mileage: data.mileage,
            fuelConsumption: data.fuelConsumption,
            address: data.address,
            description: data.description,
            additionRules: additionFunctions
                .filter((item) => data.additionFunctions.includes(item.id))
                .map((item) => item.id),
        }));

        const dataMap = additionFunctions.map((item) => {
            return {
                id: item.id,
                name: item.name,
                symbol: item.symbol || '',
                isChecked: isContain(item),
            };
        });
        setAdditions(dataMap);
    }, [data, additionFunctions, imageData, sessionToken]);

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);

        setFormData((prev) => ({
            ...prev,
            province: provinceId,
            district: '',
            ward: '',
        }));

        const provinceFilter = provinces.find((province) => province.id === parseInt(provinceId));
        if (provinceFilter) {
            setDistricts(provinceFilter.districtResponses);
        } else {
            setDistricts([]);
        }

        setSelectedDistrict('');
        setSelectedWard('');
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setFormData((prev) => ({
            ...prev,
            district: districtId,
            ward: '',
        }));

        const selectedDistrictData = districts.find(
            (district) => district.id === parseInt(districtId),
        );
        if (selectedDistrictData) {
            setWards(selectedDistrictData.wardResponses);
        } else {
            setWards([]);
        }

        setSelectedWard('');
    };

    const handleWardChange = (e) => {
        const wardId = e.target.value;
        setSelectedWard(wardId);
        setFormData((prev) => ({
            ...prev,
            ward: wardId,
        }));
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnCheckBoxChange = (e) => {
        const { id, checked } = e.target;
        const ruleValue = parseInt(id);

        setFormData((prevFormData) => ({
            ...prevFormData,
            additionRules: checked
                ? [...prevFormData.additionRules, ruleValue]
                : prevFormData.additionRules.filter((rule) => rule !== ruleValue),
        }));

        setAdditions((prevAdditions) =>
            prevAdditions.map((item) =>
                item.id === ruleValue ? { ...item, isChecked: checked } : item,
            ),
        );
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files[0],
        }));

        const fileURL = URL.createObjectURL(files[0]);
        switch (name) {
            case 'imageFront':
                setImages((prev) => [...prev, { src: fileURL, alt: 'imageFront' }]);
                break;
            case 'imageBack':
                setImages((prev) => [...prev, { src: fileURL, alt: 'imageBack' }]);
                break;
            case 'imageLeft':
                setImages((prev) => [...prev, { src: fileURL, alt: 'imageLeft' }]);
                break;
            case 'imageRight':
                setImages((prev) => [...prev, { src: fileURL, alt: 'imageRight' }]);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.mileage <= 0) {
            return;
        }
        setLoading(true);
        const fileFields = ['imageFront', 'imageBack', 'imageLeft', 'imageRight'];

        const files = {};
        const jsonData = {};

        Object.keys(formData).forEach((key) => {
            if (fileFields.includes(key) && formData[key] !== null) {
                files[key] = formData[key];
            } else {
                jsonData[key] = formData[key];
            }
        });

        const form = new FormData();
        Object.keys(files).forEach((key) => {
            form.append([key], files[key]);
        });
        form.append('data', JSON.stringify(jsonData));

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/edit-car-information/${carId}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: form,
                },
            );

            if (!response.ok) {
                alert('Edit car fail!');
                return;
            } else {
                await alert('Edit car successfully!');
            }
            window.location.reload();
        } catch (e) {
            console.log('Error', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-around my-3">
                    <div className="col-md-4">
                        <label className="fw-bold mb-2">
                            Mileage: <span className="text-danger">*</span>
                        </label>
                        <br />
                        <input
                            type="number"
                            name="mileage"
                            value={formData.mileage || ''}
                            onChange={handleOnChange}
                            className="form-control border border-dark"
                            required
                            disabled={data.carStatus == 'BOOKED'}
                        />
                        {formData.mileage <= 0 && (
                            <span className="text-danger">Mileage must be greater than 0</span>
                        )}
                    </div>
                    <div className="col-md-4">
                        <label className="fw-bold mb-2">Fuel consumption:</label>
                        <br />
                        <input
                            type="number"
                            name="fuelConsumption"
                            value={formData.fuelConsumption || ''}
                            onChange={handleOnChange}
                            className="border border-dark"
                            disabled={data.carStatus == 'BOOKED'}
                        />
                        <span className="fw-bold"> liter/100 km</span>
                    </div>
                </div>

                <div className="row d-flex justify-content-around mb-3">
                    <div className="col-md-4">
                        <label className="fw-bold mb-2">
                            Address: <span className="text-danger">*</span>
                        </label>
                        <br />
                        <div className="d-flex border border-dark">
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleOnChange}
                                className="form-control"
                                disabled={data.carStatus == 'BOOKED'}
                            />
                            <i className="bi bi-search fs-3 bg-light"></i>
                        </div>
                        <div className="py-3">
                            <select
                                value={selectedProvince || ''}
                                onChange={handleProvinceChange}
                                className="form-select border border-dark"
                                aria-label=".form-select-sm example"
                                disabled={data.carStatus == 'BOOKED'}
                            >
                                <option value="" disabled>
                                    {data.province ? data.province : 'City/Province'}
                                </option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="py-3">
                            <select
                                value={selectedDistrict || ''}
                                onChange={handleDistrictChange}
                                className="form-select border border-dark"
                                aria-label=".form-select-sm example"
                                disabled={data.carStatus == 'BOOKED'}
                            >
                                <option value="" disabled>
                                    {data.district ? data.district : 'District'}
                                </option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="py-3">
                            <select
                                value={selectedWard || ''}
                                onChange={handleWardChange}
                                className="form-select border border-dark"
                                aria-label=".form-select-sm example"
                                disabled={data.carStatus == 'BOOKED'}
                            >
                                <option value="">{data.ward ? data.ward : 'Select Ward'}</option>
                                {wards.map((ward) => (
                                    <option key={ward.id} value={ward.id}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label className="fw-bold mb-2">Description:</label>
                        <br />
                        <textarea
                            rows="6"
                            placeholder="Description of your vehicle"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleOnChange}
                            className="form-control border border-dark"
                            disabled={data.carStatus == 'BOOKED'}
                        />
                    </div>
                </div>

                <div className="row d-flex justify-content-around mb-3 mx-5">
                    <label className="fw-bold mb-2">Additional functions:</label>
                    <br />
                    <div className="border border-dark p-2 rounded">
                        <div className="row">
                            {additions.map((item) => (
                                <div key={item.id} className="col-4 mb-2">
                                    <input
                                        type="checkbox"
                                        id={item.id.toString()}
                                        name={item.name}
                                        checked={item.isChecked}
                                        onChange={handleOnCheckBoxChange}
                                        disabled={data.carStatus == 'BOOKED'}
                                    />
                                    <label className="form-check-label" htmlFor={item.id}>
                                        {item.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="container-fluid mb-3">
                    <label className="fw-bold mb-2 mx-5">
                        Images: <span className="text-danger">*</span>
                    </label>
                    <br />
                    <div className="row d-flex justify-content-around">
                        <div className="col-md-4">
                            <label className="fw-bold mb-2">Front</label>
                            <br />
                            <input
                                type="file"
                                accept="image/*"
                                name="imageFront"
                                onChange={handleFileChange}
                                className="form-control border border-dark"
                                disabled={data.carStatus == 'BOOKED'}
                            />
                            {images[0] && formData?.imageFront == null && (
                                <Image
                                    style={{ width: '100px', height: '60px' }}
                                    src={images[0].imgURL}
                                    alt={images[0].imgAlt}
                                    className="img-thumbnail"
                                    width={100}
                                    height={60}
                                />
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="fw-bold mb-2">Back</label>
                            <br />
                            <input
                                type="file"
                                accept="image/*"
                                name="imageBack"
                                onChange={handleFileChange}
                                className="form-control border border-dark"
                                disabled={data.carStatus == 'BOOKED'}
                            />
                            {images[1] && formData?.imageBack == null && (
                                <Image
                                    style={{ width: '100px', height: '60px' }}
                                    src={images[1].imgURL}
                                    alt={images[1].imgAlt}
                                    className="img-thumbnail"
                                    width={100}
                                    height={60}
                                />
                            )}
                        </div>
                    </div>
                    <div className="row d-flex justify-content-around mt-3">
                        <div className="col-md-4">
                            <label className="fw-bold mb-2">Left</label>
                            <br />
                            <input
                                type="file"
                                accept="image/*"
                                name="imageLeft"
                                onChange={handleFileChange}
                                className="form-control border border-dark"
                                disabled={data.carStatus == 'BOOKED'}
                            />
                            {images[2] && formData?.imageLeft == null && (
                                <Image
                                    style={{ width: '100px', height: '60px' }}
                                    src={images[2].imgURL}
                                    alt={images[2].imgAlt}
                                    className="img-thumbnail"
                                    width={100}
                                    height={60}
                                />
                            )}
                        </div>
                        <div className="col-md-4">
                            <label className="fw-bold mb-2">Right</label>
                            <br />
                            <input
                                type="file"
                                accept="image/*"
                                name="imageRight"
                                onChange={handleFileChange}
                                className="form-control border border-dark"
                                disabled={data.carStatus == 'BOOKED'}
                            />
                            {images[3] && formData?.imageRight == null && (
                                <Image
                                    style={{ width: '100px', height: '60px' }}
                                    src={images[3].imgURL}
                                    alt={images[3].imgAlt}
                                    className="img-thumbnail"
                                    width={100}
                                    height={60}
                                />
                            )}
                        </div>
                    </div>

                    <p className="mt-3 ms-5">
                        Please include full 4 images of your vehicle
                        <br />
                        File type: .jpg , .jpeg , .png, .gif
                    </p>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center">
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center mt-5">
                        <Link href={`/owner/cars`} className="mt-2 mx-5 text-dark">
                            Discard
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                )}
            </form>
        </>
    );
}
