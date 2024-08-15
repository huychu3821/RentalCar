'use client';

import { useAppContext } from '@/app/app-provider';
import Step1 from '@/components/owner/add-car/step/step-1';
import Step2 from '@/components/owner/add-car/step/step-2';
import Step3 from '@/components/owner/add-car/step/step-3';
import Step4 from '@/components/owner/add-car/step/step-4';
import AddCarTitle from '@/components/owner/add-car/title/title';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import { formattedNumber } from '@/lib/format-number';

export default function AddCarPage({ searchParams }) {
    const { sessionToken } = useAppContext();
    const router = useRouter();
    const [formData, setFormData] = useState({
        licensePlate: '',
        color: '',
        brand: '',
        model: '',
        productionYear: '',
        numberOfSeats: '',
        transmissionType: '',
        fuelType: '',
        registrationPaper: null, // file
        certificateOfInspection: null, // file
        insurance: null, // file
        // end step 1
        mileage: '',
        fuelConsumption: '',
        address: '',
        description: '',
        additionRules: [],
        imageFront: null, // file
        imageBack: null, // file
        imageLeft: null, // file
        imageRight: null, // file
        // end step 2
        price: '',
        deposit: '',
        specify: '',
    });

    const [loading, setLoading] = useState(false);
    const step = searchParams.step || 1;

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [carName, setCarName] = useState('');

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const brandResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/brand`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        method: 'GET',
                    },
                );
                if (!brandResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const resultBrandInfo = await brandResponse.json();
                if (resultBrandInfo.isSuccess) {
                    setBrands(resultBrandInfo.body);
                }
            } catch (error) {
                console.error('Error fetching brand:', error);
            }

            try {
                const addressResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/address`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        method: 'GET',
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
    }, [sessionToken]);

    const handleBrandChange = (e) => {
        const brandId = e.target.value;
        const brandName = e.target.options[e.target.selectedIndex].text;
        setSelectedBrand(brandId);
        setCarName(brandName);

        setFormData((prev) => ({
            ...prev,
            brand: brandId,
            model: '',
        }));

        const brandFilter = brands.find((brand) => brand.id === parseInt(brandId));
        if (brandFilter) {
            setModels(brandFilter.modelResponses);
        } else {
            setModels([]);
        }

        setSelectedModel('');
    };

    const handleModelChange = (e) => {
        const selectedModelId = e.target.value;
        const modelName = e.target.options[e.target.selectedIndex].text;
        setSelectedModel(selectedModelId);
        setCarName((prev) => prev + ' ' + modelName);
        setFormData((prev) => ({
            ...prev,
            model: selectedModelId,
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setSelectedProvince(provinceId);

        setFormData((prev) => ({
            ...prev,
            city: provinceId,
            district: '',
            ward: '',
            address: provinceName,
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
        const districtName = e.target.options[e.target.selectedIndex].text;
        setSelectedDistrict(districtId);
        setFormData((prev) => ({
            ...prev,
            district: districtId,
            ward: '',
            address: districtName + ', ' + prev.address,
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
            address: e.target.options[e.target.selectedIndex].text + ', ' + prev.address,
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
        const { name, checked } = e.target;
        const rulesMap = {
            bluetooth: 1,
            gps: 2,
            camera: 3,
            sunRoof: 4,
            childLock: 5,
            childSeat: 6,
            dvd: 7,
            usb: 8,
            smoking: 9,
            foodInCar: 10,
            pet: 11,
            other: 12,
        };
        const ruleValue = rulesMap[name];

        setFormData((prevFormData) => ({
            ...prevFormData,
            additionRules: checked
                ? [...prevFormData.additionRules, ruleValue]
                : prevFormData.additionRules.filter((rule) => rule !== ruleValue),
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files[0],
        }));

        const fileURL = URL.createObjectURL(files[0]);
        if (['imageFront', 'imageBack', 'imageLeft', 'imageRight'].includes(name)) {
            setImages((prev) => {
                const updatedImages = prev.filter((image) => image.alt !== name);
                return [...updatedImages, { src: fileURL, alt: name }];
            });
        }
    };

    const handleOnNextStep1 = (e) => {
        e.preventDefault();
        const newErrors = {};
        const requiredFields = [
            'licensePlate',
            'color',
            'brand',
            'model',
            'productionYear',
            'numberOfSeats',
            'transmissionType',
            'fuelType',
            'registrationPaper',
            'certificateOfInspection',
            'insurance',
        ];
        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (formData.productionYear <= 0) {
            newErrors.productionYear = 'Production year must be greater than 0';
        }
        if (formData.numberOfSeats <= 0) {
            newErrors.numberOfSeats = 'Number of seats must be greater than 0';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            router.push('/owner/add-a-car?step=2');
        }
    };

    const handleOnNextStep2 = (e) => {
        e.preventDefault();
        const newErrors = {};
        const requiredFields = [
            'mileage',
            'city',
            'district',
            'ward',
            'imageFront',
            'imageBack',
            'imageLeft',
            'imageRight',
        ];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (formData.mileage <= 0) {
            newErrors.mileage = 'Mileage must be greater than 0';
        }

        if (formData.fuelConsumption <= 0) {
            newErrors.fuelConsumption = 'Fuel Consumption must be greater than 0';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            router.push('/owner/add-a-car?step=3');
        }
    };

    const handleOnNextStep3 = (e) => {
        e.preventDefault();
        const newErrors = {};
        const requiredFields = ['price', 'deposit'];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        if (formData.deposit <= 0) {
            newErrors.deposit = 'Deposit must be greater than 0';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            router.push('/owner/add-a-car?step=4');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fileFields = [
            'registrationPaper',
            'certificateOfInspection',
            'insurance',
            'imageFront',
            'imageBack',
            'imageLeft',
            'imageRight',
        ];

        const files = {};
        const jsonData = {};

        // Tách file và dữ liệu JSON
        Object.keys(formData).forEach((key) => {
            if (fileFields.includes(key) && formData[key] !== null) {
                files[key] = formData[key];
            } else {
                jsonData[key] = formData[key];
            }
        });

        // Tạo FormData và thêm file
        const form = new FormData();
        Object.keys(files).forEach((key) => {
            form.append([key], files[key]);
        });

        // Thêm JSON data vào FormData
        form.append('data', JSON.stringify(jsonData));

        // fetch API backend here
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/owner/add-car`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: form,
                },
            );

            if (!response.ok) {
                console.error('Add car fail!');
                setFormData({});
            }

            alert('Add car successfully!');
            router.push('/owner');
        } catch (e) {
            console.error();
            'Error add car: ', e;
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <AddCarTitle />
            <div className="container-fluid bg-info-subtle py-2">
                {step == 1 && <Step1 />}
                {step == 2 && <Step2 />}
                {step == 3 && <Step3 />}
                {step == 4 && <Step4 />}
                {step == 1 && (
                    <p className="text-danger ms-4 mt-2">
                        Note: Please check your information carefully, you'll not be able to change
                        the basic details of your car, which is based on the registration
                        information
                    </p>
                )}

                <form method="post" onSubmit={handleSubmit}>
                    {step == 1 && (
                        <>
                            <div className="row d-flex justify-content-around mb-3">
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        License Plate: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        value={formData.licensePlate || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                        required
                                    />
                                    {errors.licensePlate && (
                                        <span className="text-danger">{errors.licensePlate}</span>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        Color: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="text"
                                        name="color"
                                        value={formData.color || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                        required
                                    />
                                    {errors.color && (
                                        <span className="text-danger">{errors.color}</span>
                                    )}
                                </div>
                            </div>

                            <div className="row d-flex justify-content-around mb-3">
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        Brand name: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <select
                                        value={selectedBrand || ''}
                                        onChange={handleBrandChange}
                                        className="form-select border border-dark"
                                        aria-label=".form-select-sm example"
                                    >
                                        <option value="" disabled>
                                            {formData.brand ? formData.brand : 'Select Brand'}
                                        </option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand && (
                                        <span className="text-danger">{errors.brand}</span>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        Model: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <select
                                        value={selectedModel || ''}
                                        onChange={handleModelChange}
                                        className="form-select border border-dark"
                                        aria-label=".form-select-sm example"
                                    >
                                        <option value="">
                                            {formData.model ? formData.model : 'Select Model'}
                                        </option>
                                        {models.map((model) => (
                                            <option key={model.id} value={model.id}>
                                                {model.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.model && (
                                        <span className="text-danger">{errors.model}</span>
                                    )}
                                </div>
                            </div>

                            <div className="row d-flex justify-content-around mb-3">
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        Production year: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="number"
                                        name="productionYear"
                                        value={formData.productionYear || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                        required
                                    />
                                    {errors.productionYear && (
                                        <span className="text-danger">{errors.productionYear}</span>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        No. of seats: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="number"
                                        name="numberOfSeats"
                                        value={formData.numberOfSeats || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                        required
                                    />
                                    {errors.numberOfSeats && (
                                        <span className="text-danger">{errors.numberOfSeats}</span>
                                    )}
                                </div>
                            </div>

                            <div className="row d-flex justify-content-around mb-3">
                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        Transmission: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            name="transmissionType"
                                            type="radio"
                                            id="automatic"
                                            value="Automatic"
                                            checked={formData.transmissionType === 'Automatic'}
                                            onChange={handleOnChange}
                                            required
                                        />
                                        <label htmlFor="automatic">Automatic</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            name="transmissionType"
                                            type="radio"
                                            id="manual"
                                            value="Manual"
                                            checked={formData.transmissionType === 'Manual'}
                                            onChange={handleOnChange}
                                            required
                                        />
                                        <label htmlFor="manual">Manual</label>
                                    </div>
                                    {errors.transmissionType && (
                                        <span className="text-danger">
                                            {errors.transmissionType}
                                        </span>
                                    )}
                                </div>

                                <div className="col-md-4">
                                    <label className="fw-bold mb-2">
                                        Fuel: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            name="fuelType"
                                            type="radio"
                                            id="gasoline"
                                            value="Gasoline"
                                            checked={formData.fuelType === 'Gasoline'}
                                            onChange={handleOnChange}
                                            required
                                        />
                                        <label htmlFor="gasoline">Gasoline</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            name="fuelType"
                                            type="radio"
                                            id="diesel"
                                            value="Diesel"
                                            checked={formData.fuelType === 'Diesel'}
                                            onChange={handleOnChange}
                                            required
                                        />
                                        <label htmlFor="diesel">Diesel</label>
                                    </div>
                                    {errors.fuelType && (
                                        <span className="text-danger">{errors.fuelType}</span>
                                    )}
                                </div>
                            </div>

                            <div className="row d-flex justify-content-around mb-3 mx-0">
                                <h3 className="ms-5 ps-4 my-4">Documents</h3>
                                <div className="col-md-3">
                                    <label className="fw-bold mb-2">
                                        Registration paper: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="file"
                                        name="registrationPaper"
                                        accept=".doc, .docx, .pdf, image/*"
                                        onChange={handleFileChange}
                                        className="form-control border border-dark"
                                    />
                                    {errors.registrationPaper && (
                                        <span className="text-danger">
                                            {errors.registrationPaper}
                                        </span>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="fw-bold mb-2">
                                        Certificate of inspection:{' '}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="file"
                                        name="certificateOfInspection"
                                        accept=".doc, .docx, .pdf, image/*"
                                        onChange={handleFileChange}
                                        className="form-control border border-dark"
                                    />
                                    {errors.certificateOfInspection && (
                                        <span className="text-danger">
                                            {errors.certificateOfInspection}
                                        </span>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <label className="fw-bold mb-2">
                                        Insurance: <span className="text-danger">*</span>
                                    </label>
                                    <br />
                                    <input
                                        type="file"
                                        name="insurance"
                                        accept=".doc, .docx, .pdf, image/*"
                                        onChange={handleFileChange}
                                        className="form-control border border-dark"
                                    />
                                    {errors.insurance && (
                                        <span className="text-danger">{errors.insurance}</span>
                                    )}
                                </div>

                                <p className="ms-5 mt-3">
                                    File type: doc, .docx, .pdf, .jpg, .jpeg, .png
                                </p>
                            </div>

                            <div className="d-flex justify-content-center">
                                <Link href="/owner" className="mt-2 mx-5 text-dark">
                                    Cancel
                                </Link>
                                <Link
                                    href="#"
                                    className="btn btn-primary"
                                    onClick={handleOnNextStep1}
                                >
                                    Next
                                </Link>
                            </div>
                        </>
                    )}

                    {step == 2 && (
                        <>
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
                                    />
                                    {errors.mileage && (
                                        <span className="text-danger">{errors.mileage}</span>
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
                                    />
                                    <span className="fw-bold"> liter/100 km</span>
                                    <br />
                                    {errors.fuelConsumption && (
                                        <span className="text-danger">
                                            {errors.fuelConsumption}
                                        </span>
                                    )}
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
                                            disabled
                                        />
                                        {/* <i className="bi bi-search fs-3 bg-light"></i> */}
                                    </div>
                                    <div className="py-3">
                                        <select
                                            value={selectedProvince || ''}
                                            onChange={handleProvinceChange}
                                            className="form-select border border-dark"
                                            aria-label=".form-select-sm example"
                                        >
                                            <option value="" disabled>
                                                {formData.city ? formData.city : 'City/Province'}
                                            </option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.city && (
                                        <span className="text-danger">{errors.city}</span>
                                    )}
                                    <div className="py-3">
                                        <select
                                            value={selectedDistrict || ''}
                                            onChange={handleDistrictChange}
                                            className="form-select border border-dark"
                                            aria-label=".form-select-sm example"
                                        >
                                            <option value="" disabled>
                                                {formData.district ? formData.district : 'District'}
                                            </option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.district && (
                                        <span className="text-danger">{errors.district}</span>
                                    )}
                                    <div className="py-3">
                                        <select
                                            value={selectedWard || ''}
                                            onChange={handleWardChange}
                                            className="form-select border border-dark"
                                            aria-label=".form-select-sm example"
                                        >
                                            <option value="">
                                                {formData.ward ? formData.ward : 'Select Ward'}
                                            </option>
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.ward && (
                                        <span className="text-danger">{errors.ward}</span>
                                    )}
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
                                    />
                                </div>
                            </div>

                            <div className="row d-flex justify-content-around mb-3 mx-5">
                                <label className="fw-bold mb-2">Additional functions:</label>
                                <br />
                                <div className="col-md-3 bg-light">
                                    <i className="bi bi-bluetooth me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="bluetooth"
                                        name="bluetooth"
                                        checked={formData.additionRules.includes(1)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="bluetooth">
                                        Bluetooth
                                    </label>
                                    <br />
                                    <i className="bi bi-map-fill me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="gps"
                                        name="gps"
                                        checked={formData.additionRules.includes(2)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="gps">
                                        GPS
                                    </label>
                                    <br />
                                    <i className="bi bi-camera-fill me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="camera"
                                        name="camera"
                                        checked={formData.additionRules.includes(3)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="camera">
                                        Camera
                                    </label>
                                </div>
                                <div className="col-md-3 bg-light">
                                    <i className="bi bi-sun me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="sunRoof"
                                        name="sunRoof"
                                        checked={formData.additionRules.includes(4)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="sunRoof">
                                        Sun roof
                                    </label>
                                    <br />

                                    <i className="bi bi-unlock-fill me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="childLock"
                                        name="childLock"
                                        checked={formData.additionRules.includes(5)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="childLock">
                                        Child lock
                                    </label>
                                    <br />

                                    <i className="bi bi-person-arms-up me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="childSeat"
                                        name="childSeat"
                                        checked={formData.additionRules.includes(6)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="childSeat">
                                        Child seat
                                    </label>
                                    <br />
                                </div>
                                <div className="col-md-3 bg-light">
                                    <i className="bi bi-disc me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="dvd"
                                        name="dvd"
                                        checked={formData.additionRules.includes(7)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="dvd">
                                        DVD
                                    </label>
                                    <br />

                                    <i className="bi bi-usb-symbol me-2"></i>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="usb"
                                        name="usb"
                                        checked={formData.additionRules.includes(8)}
                                        onChange={handleOnCheckBoxChange}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="usb">
                                        USB
                                    </label>
                                    <br />
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
                                        />
                                        {errors.imageFront && (
                                            <span className="text-danger">{errors.imageFront}</span>
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
                                        />
                                        {errors.imageBack && (
                                            <span className="text-danger">{errors.imageBack}</span>
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
                                        />
                                        {errors.imageLeft && (
                                            <span className="text-danger">{errors.imageLeft}</span>
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
                                        />
                                        {errors.imageRight && (
                                            <span className="text-danger">{errors.imageRight}</span>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-3 ms-5">
                                    Please include full 4 images of your vehicle
                                    <br />
                                    File type: .jpg , .jpeg , .png, .gif
                                </p>
                            </div>

                            <div className="d-flex justify-content-center">
                                <Link href="/owner" className="mt-2 mx-5 text-dark">
                                    Cancel
                                </Link>
                                <Link
                                    href="/owner/add-a-car?step=3"
                                    className="btn btn-primary"
                                    onClick={handleOnNextStep2}
                                >
                                    Next
                                </Link>
                            </div>
                        </>
                    )}

                    {step == 3 && (
                        <>
                            <div className="row my-3 ms-5">
                                <div className="col-md-2">
                                    <label className="fw-bold my-1">
                                        Set base price for your car:
                                    </label>
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                        required
                                    />
                                    {errors.price && (
                                        <span className="text-danger">{errors.price}</span>
                                    )}
                                </div>
                                <div className="col-md-1">
                                    <label className="fw-bold my-1">VND/Day</label>
                                </div>
                            </div>

                            <div className="row my-3 ms-5">
                                <div className="col-md-2">
                                    <label className="fw-bold my-1">Required deposit:</label>
                                </div>
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        name="deposit"
                                        value={formData.deposit || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                        required
                                    />
                                    {errors.deposit && (
                                        <span className="text-danger">{errors.deposit}</span>
                                    )}
                                </div>
                                <div className="col-md-1">
                                    <label className="fw-bold my-1">VND</label>
                                </div>
                            </div>

                            <div className="my-3 ms-5">
                                <div className="col-md-2">
                                    <label className="fw-bold my-1">Terms of use</label>
                                </div>
                                <div className="row mb-3 mx-5">
                                    <div className="col-md-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="smoking"
                                            name="smoking"
                                            checked={formData.additionRules.includes(9)}
                                            onChange={handleOnCheckBoxChange}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="smoking">
                                            No smoking
                                        </label>
                                    </div>
                                    <div className="col-md-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="foodInCar"
                                            name="foodInCar"
                                            checked={formData.additionRules.includes(10)}
                                            onChange={handleOnCheckBoxChange}
                                        />
                                        <label
                                            className="form-check-label ms-2"
                                            htmlFor="foodInCar"
                                        >
                                            No food in car
                                        </label>
                                    </div>
                                </div>
                                <div className="row mb-3 mx-5">
                                    <div className="col-md-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="pet"
                                            name="pet"
                                            checked={formData.additionRules.includes(11)}
                                            onChange={handleOnCheckBoxChange}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="pet">
                                            No pet
                                        </label>
                                    </div>
                                    <div className="col-md-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="other"
                                            name="other"
                                            checked={formData.additionRules.includes(12)}
                                            onChange={handleOnCheckBoxChange}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="other">
                                            Other
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="row ms-5">
                                <div className="col-md-2"></div>
                                <div className="col-md-4">
                                    <p>Please specify:</p>
                                    <textarea
                                        rows="5"
                                        name="specify"
                                        value={formData.specify || ''}
                                        onChange={handleOnChange}
                                        className="form-control border border-dark"
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-5">
                                <Link href="/owner" className="mt-2 mx-5 text-dark">
                                    Cancel
                                </Link>
                                <Link
                                    href="#"
                                    className="btn btn-primary"
                                    onClick={handleOnNextStep3}
                                >
                                    Next
                                </Link>
                            </div>
                        </>
                    )}

                    {step == 4 && (
                        <>
                            <div className="row">
                                <div className="mx-5 col-md-4">
                                    <h2 className="mt-3">Preview</h2>
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
                                                        src={image.src}
                                                        alt={image.alt}
                                                        className="img-thumbnail"
                                                        width={500}
                                                        height={300}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                                <div className="col-md-6">
                                    <h1 className="mt-5">{carName}</h1>
                                    <div className="row mt-2">
                                        <div className="col-md-4">
                                            <h4>Ratings:</h4>
                                        </div>
                                        <div className="col-md-8 fw-bold">
                                            <span>
                                                <i className="bi bi-star mx-1"></i>
                                            </span>
                                            <span>
                                                <i className="bi bi-star mx-1"></i>
                                            </span>
                                            <span>
                                                <i className="bi bi-star mx-1"></i>
                                            </span>
                                            <span>
                                                <i className="bi bi-star mx-1"></i>
                                            </span>
                                            <span>
                                                <i className="bi bi-star mx-1"></i>
                                            </span>
                                            <br />
                                            <p>(No ratings yet)</p>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-4">
                                            <h4>No. of rides:</h4>
                                        </div>
                                        <div className="col-md-8 fw-bold">
                                            <h4>0</h4>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-4">
                                            <h4>Price:</h4>
                                        </div>
                                        <div className="col-md-8 fw-bold">
                                            <h4>{formattedNumber(formData.price / 1000)} k/day</h4>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-4">
                                            <h4>Locations:</h4>
                                        </div>
                                        <div className="col-md-8 fw-bold">
                                            <h4>{formData.address}</h4>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-4">
                                            <h4>Status:</h4>
                                        </div>
                                        <div className="col-md-8 fw-bold">
                                            <h4 className="text-success">Available</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-5">
                                {loading ? (
                                    <span
                                        className="spinner-border"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    <>
                                        <Link href="/owner" className="mt-2 mx-5 text-dark">
                                            Cancel
                                        </Link>
                                        <button type="submit" className="btn btn-primary">
                                            Submit
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </form>
            </div>
        </>
    );
}
