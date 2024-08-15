'use client';

import { useAppContext } from '@/app/app-provider';
import { useEffect, useState } from 'react';
import BookingDetail from './booking-details';
import Step1RentACar from './step-1';
import Link from 'next/link';
import fetchImageURL from '@/lib/fetchImage';
import RentACarTitle from './title';
import Info from './info';
import Step3RentACar from './step-3';
import Step2RentACar from './step-2';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formattedNumber } from '@/lib/format-number';

const MultiStepForm = ({ carData, images }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({});
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [wallet, setWallet] = useState(0);
    const [checked, setChecked] = useState(true);
    const router = useRouter();
    const handleNextStep = () => {
        if (validateForm()) {
            setError(validateForm());
            return;
        }
        setStep(step + 1);
    };
    const [bookingDetails, setBookingDetails] = useState({
        pickUpLocation: '',
        pickUpDate: '',
        pickUpTime: '',
        dropOffDate: '',
        dropOffTime: '',
    });
    const { sessionToken } = useAppContext();
    const [formDataFetch, setFormDataFetch] = useState({});
    const [formData, setFormData] = useState({
        carId: '',
        startDate: `${bookingDetails.pickUpDate} ${bookingDetails.pickUpTime}`,
        endDate: `${bookingDetails.dropOffDate} ${bookingDetails.dropOffTime}`,
        name: '',
        phone: '',
        dob: '',
        nationalId: '',
        detailAddress: '',
        ward: '',
        district: '',
        city: '',
        driverLicense: '',
        email: '',
        nameDriver: '',
        phoneDriver: '',
        dobDriver: '',
        nationalIdDriver: '',
        detailAddressDriver: '',
        wardDriver: '',
        districtDriver: '',
        cityDriver: '',
        driverLicenseDriver: '',
        emailDriver: '',
        paymentMethod: '',
    });

    const [imageRequest, setImageRequest] = useState({});

    const [imageRequestDriver, setImageRequestDriver] = useState({});
    const [imageDisplay, setImageDisplay] = useState({});

    const [imageDisplayDriver, setImageDisplayDriver] = useState({});

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedProvinceDriver, setSelectedProvinceDriver] = useState('');
    const [selectedDistrictDriver, setSelectedDistrictDriver] = useState('');
    const [selectedWardDriver, setSelectedWardDriver] = useState('');

    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlDriver, setImageUrlDriver] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const pickUpLocation = localStorage.getItem('pickUpLocation') || '';
        const pickUpDate = localStorage.getItem('pickUpDate') || '';
        const pickUpTime = localStorage.getItem('pickUpTime') || '';
        const dropOffDate = localStorage.getItem('dropOffDate') || '';
        const dropOffTime = localStorage.getItem('dropOffTime') || '';

        setBookingDetails({
            pickUpLocation,
            pickUpDate,
            pickUpTime,
            dropOffDate,
            dropOffTime,
        });
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/wallet/get`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        method: 'GET',
                    },
                );

                if (!walletResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const rsWallet = await walletResponse.json();
                setWallet(rsWallet.body.balance);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [wallet, sessionToken]);
    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            carId: carData.id,
            startDate: `${bookingDetails.pickUpDate} ${bookingDetails.pickUpTime}`,
            endDate: `${bookingDetails.dropOffDate} ${bookingDetails.dropOffTime}`,
        }));
        const start = new Date(`${bookingDetails.pickUpDate} ${bookingDetails.pickUpTime}`);
        const end = new Date(`${bookingDetails.dropOffDate} ${bookingDetails.dropOffTime}`);
        if (start && end && !isNaN(start) && !isNaN(end)) {
            const differenceInTime = end.getTime() - start.getTime();
            const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)) + 1; // Làm tròn xuống
            setNumberOfDays(differenceInDays);
        }
    }, [bookingDetails, carData]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-info/get-user`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        method: 'GET',
                    },
                );

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

                if (!userResponse.ok || !addressResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const resultUserInfo = await userResponse.json();
                const resultAddressInfo = await addressResponse.json();

                if (resultUserInfo.isSuccess) {
                    const userData = resultUserInfo.body;
                    const formattedApiData = {
                        carId: carData.id,
                        startDate: `${bookingDetails.pickUpDate} ${bookingDetails.pickUpTime}`,
                        endDate: `${bookingDetails.dropOffDate} ${bookingDetails.dropOffTime}`,
                        city: userData.city || '',
                        detailAddress: userData.detailAddress || '',
                        district: userData.district || '',
                        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
                        driverLicense: userData.driverLicense || '',
                        name: userData.name || '',
                        nationalId: userData.nationalId || '',
                        phone: userData.phone || '',
                        ward: userData.ward || '',
                        email: userData.email || '',
                        cityDriver: userData.city || '',
                        detailAddressDriver: userData.detailAddress || '',
                        districtDriver: userData.district || '',
                        dobDriver: userData.dob
                            ? new Date(userData.dob).toISOString().split('T')[0]
                            : '',
                        driverLicenseDriver: userData.driverLicense || '',
                        nameDriver: userData.name || '',
                        nationalIdDriver: userData.nationalId || '',
                        phoneDriver: userData.phone || '',
                        wardDriver: userData.ward || '',
                        emailDriver: userData.email || '',
                    };
                    setFormData(formattedApiData);
                    setFormDataFetch(formattedApiData);
                    setProvinces(resultAddressInfo.body);
                    if (resultUserInfo.body.driverLicense || formattedApiData.driverLicenseDriver) {
                        const url = await fetchImageURL(resultUserInfo.body.driverLicense);
                        setImageUrl(url);
                        const urlDriver = await fetchImageURL(formattedApiData.driverLicenseDriver);
                        setImageUrlDriver(urlDriver);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [bookingDetails, carData, sessionToken]);
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (!files[0]) return;
        setFormData((prev) => ({
            ...prev,
            [name]: files[0].name,
        }));
        const fileURL = URL.createObjectURL(files[0]);
        switch (name) {
            case 'driverLicense':
                setImageDisplay({ src: fileURL, alt: 'driverLicense' });
                setImageRequest(e.target.files[0]);
                break;
            case 'driverLicenseDriver':
                setImageDisplayDriver({ src: fileURL, alt: 'driverLicenseDriver' });
                setImageRequestDriver(e.target.files[0]);
                break;
            default:
                break;
        }
    };
    function handleOnChange(e) {
        const { name, value, type } = e.target;
        if (type === 'radio') {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }
    const handleOnChangeCheckBox = () => {
        setChecked((prev) => !prev);
        setFormData((prev) => ({
            ...prev,
            ...(checked == true
                ? {
                      carId: carData.id,
                      nameDriver: '',
                      phoneDriver: '',
                      dobDriver: '',
                      nationalIdDriver: '',
                      detailAddressDriver: '',
                      wardDriver: '',
                      districtDriver: '',
                      cityDriver: '',
                      driverLicenseDriver: '',
                      emailDriver: '',
                  }
                : formDataFetch),
        }));
    };

    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setSelectedProvince(provinceId);

        setFormData((prev) => ({
            ...prev,
            city: provinceName,
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
        const selectedDistrictId = e.target.value;
        setSelectedDistrict(selectedDistrictId);
        setFormData((prev) => ({
            ...prev,
            district: e.target.options[e.target.selectedIndex].text,
            ward: '',
        }));
        const selectedDistrictData = districts.find(
            (district) => district.id === parseInt(selectedDistrictId),
        );
        if (selectedDistrictData) {
            setWards(selectedDistrictData.wardResponses);
        } else {
            setWards([]);
        }
        setSelectedWard('');
    };

    const handleWardChange = (e) => {
        const selectedWardId = e.target.value;
        setSelectedWard(selectedWardId);
        setFormData((prev) => ({
            ...prev,
            ward: e.target.options[e.target.selectedIndex].text,
        }));
    };

    const handleDriverProvinceChange = (e) => {
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setSelectedProvinceDriver(provinceId);

        setFormData((prev) => ({
            ...prev,
            cityDriver: provinceName,
            districtDriver: '',
            wardDriver: '',
        }));

        const provinceFilter = provinces.find((province) => province.id === parseInt(provinceId));
        if (provinceFilter) {
            setDistricts(provinceFilter.districtResponses);
        } else {
            setDistricts([]);
        }

        setSelectedDistrictDriver('');
        setSelectedWardDriver('');
    };
    const handleDriverDistrictChange = (e) => {
        const selectedDistrictId = e.target.value;
        setSelectedDistrictDriver(selectedDistrictId);
        setFormData((prev) => ({
            ...prev,
            districtDriver: e.target.options[e.target.selectedIndex].text,
            wardDriver: '',
        }));
        const selectedDistrictData = districts.find(
            (district) => district.id === parseInt(selectedDistrictId),
        );
        if (selectedDistrictData) {
            setWards(selectedDistrictData.wardResponses);
        } else {
            setWards([]);
        }
        setSelectedWardDriver('');
    };

    const handleDriverWardChange = (e) => {
        const selectedWardId = e.target.value;
        setSelectedWardDriver(selectedWardId);
        setFormData((prev) => ({
            ...prev,
            wardDriver: e.target.options[e.target.selectedIndex].text,
        }));
    };

    const validateForm = () => {
        const {
            emailDriver,
            email,
            phone,
            nationalId,
            phoneDriver,
            nationalIdDriver,
            ward,
            wardDriver,
            district,
            districtDriver,
            city,
            cityDriver,
        } = formData;
        const regex = new RegExp(/^\+\d{1,3}\d{9}$/);
        if (!phone || !nationalId) {
            return 'Phone and National ID are required';
        }
        if (!regex.test(phone)) {
            return 'Phone number must contain  +  and followed by digits, then 9 digits for the renter phone number.';
        }
        if (!phoneDriver || !nationalIdDriver) {
            return 'Phone and National ID are required';
        }
        if (!regex.test(phoneDriver)) {
            return 'Phone number must contain  +  and followed by digits, then 9 digits for the driver phone number.';
        }
        if (!emailDriver || !email) {
            return 'Email are required';
        }
        if (!ward || !district || !city) {
            return 'City, district, ward of renter are required';
        }
        if (!wardDriver || !districtDriver || !cityDriver) {
            return 'City, district, ward of driver are required';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (validateForm()) {
            setError(validateForm());
            return;
        }
        const form = new FormData();
        form.append('file', imageRequest);
        form.append('fileDriver', imageRequestDriver);
        form.append('data', JSON.stringify(formData));
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/booking`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: form,
            });
            const rs = await response.json();
            if (response.ok) {
                setResult(rs.body);
                setSuccess('Booking successful');
                alert('Booking successful!');
                handleNextStep();
                localStorage.clear();
            } else {
                if (wallet < carData.deposit && formData.paymentMethod === 'WALLET') {
                    alert('Insufficient balance');
                    setError('Insufficient balance');
                }
                alert(rs.error || 'An error occurred during booking');
                setError(rs.error || 'An error occurred during booking');
            }
        } catch (error) {
            router.push('/cars/search');
            alert('An error occurred during booking car');
            setError('An error occurred during booking car');
        } finally {
            setLoading(false);
        }
    };
    function formatDateTime(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return (
        <>
            <RentACarTitle />
            <BookingDetail bookingDetails={bookingDetails} />
            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="container-fluid">
                        <Step1RentACar />
                        <Info carData={carData} numberOfDays={numberOfDays} images={images} />
                        <div className="container-fluid mt-3">
                            <div>
                                <h3 className="fw-bold ps-5">Renter's information</h3>
                                <div className="d-flex justify-content-between">
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Full Name:</label>
                                            <br />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Phone Number: <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                            />
                                            <div className="form-text mt-3">
                                                Phone must contain '+' and be followed by numerics
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                National ID No.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="number"
                                                name="nationalId"
                                                value={formData.nationalId || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                            />
                                        </div>
                                        <div className="py-2 mt-5">
                                            <h5 className="fw-bold">Address: </h5>
                                            <select
                                                value={selectedProvince || ''}
                                                onChange={handleProvinceChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                            >
                                                <option value="DEFAULT" disabled>
                                                    City/Province
                                                </option>
                                                <option value="" disabled>
                                                    {formData.city
                                                        ? formData.city
                                                        : 'City/Province'}
                                                </option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedDistrict || ''}
                                                onChange={handleDistrictChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                            >
                                                <option value="DEFAULT" disabled>
                                                    District
                                                </option>
                                                <option value="" disabled>
                                                    {formData.district
                                                        ? formData.district
                                                        : 'District'}
                                                </option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedWard || ''}
                                                onChange={handleWardChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                            >
                                                <option value="DEFAULT" disabled>
                                                    Ward
                                                </option>
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
                                        <div className="py-2">
                                            <input
                                                type="text"
                                                name="detailAddress"
                                                value={formData.detailAddress || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                placeholder="House number, Street"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Date of birth:</label>
                                            <br />
                                            <input
                                                type="date"
                                                name="dob"
                                                value={formData.dob || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Email Address:{' '}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                disabled
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Driving license.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            {imageDisplay.src ? (
                                                <Image
                                                    src={imageDisplay.src}
                                                    alt={imageDisplay.alt}
                                                    className="img-thumbnail"
                                                    width={500}
                                                    height={300}
                                                />
                                            ) : (
                                                <Image
                                                    src={imageUrl}
                                                    alt="Profile"
                                                    className="img-fluid"
                                                    width={500}
                                                    height={300}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                name="driverLicense"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="fw-bold mt-3 ps-5">Driver's information</h3>
                                <input
                                    type="checkbox"
                                    name="isDifference"
                                    className="ms-5"
                                    onChange={handleOnChangeCheckBox}
                                />
                                <label>Difference from Renter's information</label>
                                <div className="d-flex justify-content-between">
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Full Name:</label>
                                            <br />
                                            <input
                                                type="text"
                                                name="nameDriver"
                                                value={formData.nameDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Phone Number: <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="text"
                                                name="phoneDriver"
                                                value={formData.phoneDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                            />
                                            <div className="form-text mt-3">
                                                Phone must contain '+' and be followed by numerics
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                National ID No.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="number"
                                                name="nationalIdDriver"
                                                value={formData.nationalIdDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                required
                                            />
                                        </div>
                                        <div className="py-2 mt-5">
                                            <h5 className="fw-bold">Address: </h5>
                                            <select
                                                value={selectedProvinceDriver || ''}
                                                onChange={handleDriverProvinceChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                            >
                                                <option value="DEFAULT" disabled>
                                                    City/Province
                                                </option>
                                                <option value="" disabled>
                                                    {formData.cityDriver
                                                        ? formData.cityDriver
                                                        : 'City/Province'}
                                                </option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedDistrictDriver || ''}
                                                onChange={handleDriverDistrictChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                            >
                                                <option value="DEFAULT" disabled>
                                                    District
                                                </option>
                                                <option value="" disabled>
                                                    {formData.districtDriver
                                                        ? formData.districtDriver
                                                        : 'District'}
                                                </option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <select
                                                value={selectedWardDriver || ''}
                                                onChange={handleDriverWardChange}
                                                className="form-select border border-dark"
                                                aria-label=".form-select-sm example"
                                            >
                                                <option value="DEFAULT" disabled>
                                                    Ward
                                                </option>
                                                <option value="">
                                                    {formData.wardDriver
                                                        ? formData.wardDriver
                                                        : 'Select Ward'}
                                                </option>
                                                {wards.map((ward) => (
                                                    <option key={ward.id} value={ward.id}>
                                                        {ward.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="py-2">
                                            <input
                                                type="text"
                                                name="detailAddressDriver"
                                                value={formData.detailAddressDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                                placeholder="House number, Street"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mx-5">
                                        <div className="py-2">
                                            <label className="fw-bold">Date of birth:</label>
                                            <br />
                                            <input
                                                type="date"
                                                name="dobDriver"
                                                value={formData.dobDriver || ''}
                                                onChange={handleOnChange}
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Email Address:{' '}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            <input
                                                type="email"
                                                name="emailDriver"
                                                value={formData.emailDriver || ''}
                                                onChange={handleOnChange}
                                                required
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                        <div className="py-2">
                                            <label className="fw-bold">
                                                Driving license.
                                                <span className="text-danger">*</span>
                                            </label>
                                            <br />
                                            {imageDisplayDriver.src ? (
                                                <Image
                                                    src={imageDisplayDriver.src}
                                                    alt={imageDisplayDriver.alt}
                                                    className="img-thumbnail"
                                                    width={500}
                                                    height={300}
                                                />
                                            ) : (
                                                <Image
                                                    src={imageUrlDriver}
                                                    alt="Profile"
                                                    className="img-fluid"
                                                    width={500}
                                                    height={300}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="driverLicenseDriver"
                                                onChange={handleFileChange}
                                                className="form-control border border-dark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <div className="mt-3 d-flex flex-end">
                                <Link type="button" className="btn btn-primary" href={'/'}>
                                    Cancel
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-2"
                                    onClick={handleNextStep}
                                >
                                    Next
                                </button>
                            </div>
                            <br />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <>
                        <Info carData={carData} numberOfDays={numberOfDays} images={images} />
                        <Step2RentACar />
                        <div className="container-fluid py-4">
                            <h6 className="fw-bold ms-3">Please select your payment method</h6>
                            <div className="container">
                                <div className="my-2">
                                    <input
                                        className="form-check-input"
                                        name="paymentMethod"
                                        type="radio"
                                        id="carOwner"
                                        value="WALLET"
                                        checked={formData.paymentMethod === 'WALLET'}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label className="ms-2"> My wallet</label>
                                    <p className="mt-3 ms-5">
                                        Current balance:
                                        {wallet < carData.deposit && (
                                            <span className="text-danger">
                                                {' '}
                                                {formattedNumber(wallet)} VND - Insufficien Balance
                                                <p className="mt-3 ms-5 fst-italic">
                                                    Please go to My wallet to top-up and try again.
                                                </p>
                                            </span>
                                        )}
                                        {wallet > carData.deposit && (
                                            <div>
                                                <span className="text-success">
                                                    {formattedNumber(wallet)} VND
                                                </span>
                                                <br />
                                            </div>
                                        )}
                                    </p>
                                </div>
                                <div className="my-2">
                                    <input
                                        className="form-check-input"
                                        name="paymentMethod"
                                        type="radio"
                                        id="paymentMethod"
                                        value="CASH"
                                        checked={formData.paymentMethod === 'CASH'}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label className="ms-2"> Cash</label>
                                    <p className="mt-3 ms-5 fst-italic">
                                        Our operator will contact you for further instruction
                                    </p>
                                </div>
                                <div className="my-2">
                                    <input
                                        className="form-check-input"
                                        name="paymentMethod"
                                        type="radio"
                                        id="paymentMethod"
                                        value="BANK_TRANSFER"
                                        checked={formData.paymentMethod === 'BANK_TRANSFER'}
                                        onChange={handleOnChange}
                                        required
                                    />
                                    <label className="ms-2"> Bank transfer</label>
                                    <p className="mt-3 ms-5 fst-italic">
                                        Our operator will contact you for further instruction
                                    </p>
                                </div>
                            </div>
                            <div className="px-5 d-flex justify-content-end">
                                {loading ? (
                                    <span
                                        className="spinner-border"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    <>
                                        <Link type="button" className="btn btn-primary" href={'/'}>
                                            Cancel
                                        </Link>
                                        <button type="submit" className="btn btn-secondary mx-2">
                                            Confirm payment
                                        </button>
                                    </>
                                )}
                                <p className="ms-5 fst-italic">
                                    The deposit amount will be deducted from your wallet
                                </p>
                            </div>
                        </div>
                    </>
                )}
                {step === 3 && (
                    <div className="container py-4">
                        <Step3RentACar />
                        <p className="fw-bold py-2">
                            You've successfully booked {result.carName} from{' '}
                            {formatDateTime(result.startDate)} to {formatDateTime(result.endDate)}
                        </p>
                        <p className="fw-bold py-2">
                            Your booking number is: {result.bookingNumber}
                        </p>
                        <p className="fw-bold py-2">
                            Our operator will contact you with further guidance about pickup.
                        </p>
                        <div className="py-3 d-flex justify-content-center">
                            <Link href={'/'} className="mx-2">
                                Go to homepage
                            </Link>
                            <Link
                                type="button"
                                className="btn btn-secondary mx-2"
                                href={'/customer/cars/search'}
                            >
                                Book another car
                            </Link>
                            <Link
                                type="button"
                                className="btn btn-primary mx-2"
                                href="/customer/booking"
                            >
                                View booking
                            </Link>
                        </div>
                    </div>
                )}
            </form>
        </>
    );
};

export default MultiStepForm;
