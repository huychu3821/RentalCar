'use client';
import { useState } from 'react';
import { useAppContext } from '@/app/app-provider';
import React, { useContext } from 'react';
import { LocationContext } from '@/app/customer/SearchContext';
import './css/searchForm.css';

export default function SearchCarForm({ onSearch, size, sort }) {
    const { sessionToken } = useAppContext();
    const { setLocationState } = useContext(LocationContext);
    const { locationState } = useContext(LocationContext);
    const [formData, setFormData] = useState({
        pickUpLocation: '',
        pickUpDate: '',
        dropOffDate: '',
        pickUpTime: '',
        dropOffTime: '',
    });

    const [errors, setErrors] = useState({
        pickUpLocation: false,
        pickUpDate: false,
        dropOffDate: false,
        pickUpTime: false,
        dropOffTime: false,
    });

    const [validDate, setValidDate] = useState('');

    if (
        Object.values(formData).every((value) => value === '') &&
        !Object.values(locationState).every((value) => value === '')
    )
        setFormData(locationState);

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((preState) => ({
            ...preState,
            [name]: value,
        }));
    };

    const handleInput = (e) => {
        const { name } = e.target;
        setErrors((preState) => ({
            ...preState,
            [name]: false,
        }));
    };

    const validateForm = () => {
        const currentDate = new Date();
        const pickUpDateTime = new Date(`${formData.pickUpDate}T${formData.pickUpTime}`);
        const dropOffDateTime = new Date(`${formData.dropOffDate}T${formData.dropOffTime}`);
        const newErrors = {
            pickUpLocation: formData.pickUpLocation === '',
            pickUpDate: formData.pickUpDate === '',
            dropOffDate: formData.dropOffDate === '',
            pickUpTime: formData.pickUpTime === '',
            dropOffTime: formData.dropOffTime === '',
        };
        if (pickUpDateTime < currentDate) {
            newErrors.pickUpDate = true;
            newErrors.pickUpTime = true;
            setValidDate('Pick-up and Drop-off date must be after today');
        }

        if (dropOffDateTime < currentDate) {
            newErrors.dropOffDate = true;
            newErrors.dropOffTime = true;
            setValidDate('Pick-up and Drop-off date must be after today');
        }

        if (pickUpDateTime > currentDate && dropOffDateTime > currentDate) {
            if (pickUpDateTime > dropOffDateTime) {
                newErrors.pickUpDate = true;
                newErrors.pickUpTime = true;
                newErrors.dropOffDate = true;
                newErrors.dropOffTime = true;
                setValidDate(
                    'Drop-off date time must be later and Pick-up date time, please try again.',
                );
            }
        }
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setValidDate('');
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/car/search`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    method: 'POST',
                    body: JSON.stringify(transformJsonFormat(formData)),
                }).then(async (res) => {
                    const payload = await res.json();
                    if (payload.status === 400) throw payload.body;
                    const data = {
                        status: res.status,
                        search_data: formData,
                        result: payload.body,
                    };

                    setLocationState(formData);

                    onSearch(data);
                });
            } catch (e) {
                alert(e.message);
            }

            localStorage.setItem('pickUpLocation', formData.pickUpLocation);
            localStorage.setItem('pickUpDate', formData.pickUpDate);
            localStorage.setItem('dropOffDate', formData.dropOffDate);
            localStorage.setItem('pickUpTime', formData.pickUpTime);
            localStorage.setItem('dropOffTime', formData.dropOffTime);
        }
    };

    function transformJsonFormat(input) {
        const { pickUpLocation, pickUpDate, dropOffDate, pickUpTime, dropOffTime } = input;

        const start = `${pickUpDate} ${pickUpTime}`;
        const end = `${dropOffDate} ${dropOffTime}`;

        const output = {
            location: `${pickUpLocation}`,
            start: start,
            end: end,
            page: 1,
            size: `${size ? size : 10}`,
            sort: `${sort ? sort : ''}`,
        };

        return output;
    }

    return (
        <div className="bg-secondary rounded py-3">
            <div className="row">
                <h3 className="px-5 text-light fw-bolder">
                    Find the ideal car rental for your trip
                </h3>
                <div className="px-5">
                    <form
                        id="register-form"
                        className="text-center"
                        method="POST"
                        onSubmit={handleSubmit}
                    >
                        <div className="col-6 py-2">
                            <div className="form-group text-start text-light mt-2">
                                <h5 className="fw-bold">PICK-UP LOCATION</h5>
                                <input
                                    type="text"
                                    name="pickUpLocation"
                                    id="pickUpLocation"
                                    className={`form-control my-2 ${errors.pickUpLocation ? 'error' : ''}`}
                                    placeholder="Enter your location"
                                    value={formData.pickUpLocation}
                                    onInput={handleInput}
                                    onChange={onChange}
                                />
                                <span
                                    className={`error-message ${errors.pickUpLocation ? '' : 'd-none'}`}
                                >
                                    Pick Up Location is required
                                </span>
                            </div>
                        </div>

                        <div className="col-7 d-flex py-2">
                            <div className="form-group text-start text-light mt-2">
                                <h5 className="fw-bold">PICK-UP DATE AND TIME</h5>
                                <div className="d-flex align-items-center">
                                    <div className="form-group text-start text-light mt-2">
                                        <input
                                            type="date"
                                            name="pickUpDate"
                                            id="pickUpDate"
                                            className={`form-control my-2 ${errors.pickUpDate ? 'error' : ''}`}
                                            value={formData.pickUpDate}
                                            onChange={onChange}
                                            onInput={handleInput}
                                        />

                                        <span
                                            className={`error-message ${errors.pickUpDate ? '' : 'd-none'}`}
                                        >
                                            {validDate !== ''
                                                ? validDate
                                                : 'Pick-up date is required'}
                                        </span>
                                    </div>
                                    <div className="form-group text-start text-light mt-2 input-field">
                                        <input
                                            type="time"
                                            className={`form-control my-2 ${errors.pickUpTime ? 'error' : ''}`}
                                            name="pickUpTime"
                                            id="pickUpTime"
                                            value={formData.pickUpTime}
                                            onChange={onChange}
                                            onInput={handleInput}
                                        />
                                        <span
                                            className={`error-message ${errors.pickUpTime && validDate === '' ? '' : 'd-none'}`}
                                        >
                                            {validDate !== ''
                                                ? validDate
                                                : 'Pick-up date is required'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group text-start text-light mt-2 ms-5">
                                <h5 className="fw-bold">DROP-OFF DATE AND TIME</h5>
                                <div className="d-flex align-items-center">
                                    <div className="form-group text-start text-light mt-2">
                                        <input
                                            type="date"
                                            name="dropOffDate"
                                            id="dropOffDate"
                                            className={`form-control my-2 ${errors.dropOffDate ? 'error' : ''}`}
                                            value={formData.dropOffDate}
                                            onChange={onChange}
                                            onInput={handleInput}
                                        />
                                        <span
                                            className={`error-message ${errors.dropOffDate ? '' : 'd-none'}`}
                                        >
                                            {validDate !== ''
                                                ? validDate
                                                : 'Drop-off date is required'}
                                        </span>
                                    </div>

                                    <div className="form-group text-start text-light mt-2 input-field">
                                        <input
                                            type="time"
                                            name="dropOffTime"
                                            className={`form-control my-2 ${errors.dropOffTime ? 'error' : ''}`}
                                            id="time"
                                            value={formData.dropOffTime}
                                            onChange={onChange}
                                            onInput={handleInput}
                                        />
                                        <span
                                            className={`error-message ${errors.dropOffTime && validDate === '' ? '' : 'd-none'}`}
                                        >
                                            {validDate !== ''
                                                ? validDate
                                                : 'Drop-off time is required'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-4 col-6 mx-auto">
                            SEARCH
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
