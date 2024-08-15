'use client';

import fetchImageURL from '@/lib/fetchImage';
import './personal-information.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/app-provider';
import Image from 'next/image';

export default function PersonalInformation({ data }) {
    const { sessionToken } = useAppContext();
    const [formData, setFormData] = useState({});
    const [resetData, setResetData] = useState({});
    const [resetImage, setResetImage] = useState({});
    const [imageRequest, setImageRequest] = useState({});

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [topUpLoading, setTopUpLoading] = useState(false);

    useEffect(() => {
        setFormData(data);
        setResetData(data);

        const fetchData = async () => {
            try {
                if (data.driverLicense) {
                    const url = await fetchImageURL(data.driverLicense);
                    setImageUrl(url);
                    setResetImage(url);
                }

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
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [data, sessionToken]);

    function handleOnChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

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

    const validateForm = () => {
        const { phone, nationalId, detailAddress, name, ward, district, city } = formData;
        const regex = new RegExp(/^\+\d+$/);
        const nationalIdRegex = new RegExp(/^[0-9 ]+$/);
        const addressRegex = new RegExp(/^[A-Za-z ]+$/);
        const nameRegex = new RegExp(/^[A-Za-z ]+$/);
        if (!nameRegex || !nameRegex.test(name)) {
            return 'Name must only contain text characters.';
        }
        if (!phone || !nationalId) {
            return 'Phone and National ID are required.';
        }
        if (!regex.test(phone)) {
            return 'Phone number must contain  +  and followed by digits.';
        }
        if (!nationalIdRegex.test(nationalId)) {
            return 'National ID must only contain digits.';
        }
        if (!addressRegex.test(detailAddress)) {
            return 'Address must only contain text characters.';
        }
        if (!ward || !district || !city) {
            return 'You must fill all addresses.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTopUpLoading(true);

        if (validateForm()) {
            alert(validateForm());
            setTopUpLoading(false);
            return;
        }

        const form = new FormData();
        form.append('file', imageRequest);
        form.append('data', JSON.stringify(formData));
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-info/edit-profile`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: form,
                },
            );
            const result = await response.json();
            if (response.ok) {
                alert('Update information successfully!');
                window.location.reload();
            } else {
                alert(result.message || 'An error occurred during update!');
                setTopUpLoading(false);
            }
        } catch (error) {
            alert('An error occurred during update profile!');
            setTopUpLoading(false);
        }
    };

    const handleOnClickDiscardChange = (event) => {
        event.preventDefault();
        setFormData(resetData);
        setImageUrl(resetImage);
        setImageRequest({});
    };

    const handleImageChange = (e) => {
        const img = e.target.files[0];
        if (img) {
            const url = URL.createObjectURL(img);
            setImageRequest(img);
            setImageUrl(url);
        }
    };

    return (
        <div className="container-fluid">
            <form method="post" onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between">
                    <div className="col-md-4 mx-5">
                        <div className="py-3">
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
                        <div className="py-3">
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
                        <div className="py-3">
                            <label className="fw-bold">
                                National ID No.<span className="text-danger">*</span>
                            </label>
                            <br />
                            <input
                                type="text"
                                name="nationalId"
                                value={formData.nationalId || ''}
                                onChange={handleOnChange}
                                className="form-control border border-dark"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-4 mx-5">
                        <div className="py-3">
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
                        <div className="py-3">
                            <label className="fw-bold">
                                Email Address: <span className="text-danger">*</span>
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
                        <div className="py-3">
                            <label className="fw-bold">
                                Driving license.<span className="text-danger">*</span>
                            </label>
                            <br />
                            {imageUrl ? (
                                <Image
                                    style={{ width: '400px', height: '200px' }}
                                    src={imageUrl}
                                    alt="Profile"
                                    className="img-fluid my-2"
                                    width={400}
                                    height={200}
                                />
                            ) : (
                                <p></p>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="form-control border border-dark"
                            />
                        </div>
                    </div>
                </div>

                {/* -------Address------- */}
                <div className="col-md-6 mx-5">
                    <div className="py-3">
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
                                {formData.city ? formData.city : 'City/Province'}
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
                        >
                            <option value="DEFAULT" disabled>
                                District
                            </option>
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
                    <div className="py-3">
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
                    <div className="py-3">
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

                <div className="d-flex justify-content-center my-2">
                    <button
                        className="btn btn-link ms-2 mx-3"
                        onClick={(event) => handleOnClickDiscardChange(event)}
                        disabled={topUpLoading}
                    >
                        Discard
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={topUpLoading}>
                        {topUpLoading ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        ) : null}
                        Save
                    </button>
                </div>
                <br />
            </form>
        </div>
    );
}
