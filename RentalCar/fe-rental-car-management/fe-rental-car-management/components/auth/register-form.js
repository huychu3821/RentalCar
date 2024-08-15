'use client';
import Link from 'next/link';
import { useState, useRef } from 'react';
import './auth-form.css';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    // Sử dụng useRef để tham chiếu tới checkbox
    const agreeRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const { name, email, phone, password, confirmPassword, role } = formData;
        if (!name || !email || !phone || !password || !confirmPassword || !role) {
            return 'All fields are required';
        }
        if (password.length < 7) {
            return 'Password must be greater or equal 7 characters';
        }
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        const USERNAME_REGEX = /^[a-zA-Z\s]+$/;
        if (!USERNAME_REGEX.test(name)) {
            return 'Username must not contain invalid characters';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorMsg = validateForm();
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                },
            );
            const result = await response.json();
            if (response.status === 200) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    role: '',
                });
                setError('');
                setSuccess('Registration successful!');

                // Bỏ check ở checkbox
                if (agreeRef.current) {
                    agreeRef.current.checked = false;
                }

                router.push('/auth/login-register');
            } else {
                if (typeof result.message === 'object') {
                    const errorMessages = Object.keys(result.message)
                        .map((key) => result.message[key])
                        .join(', ');
                    setError(errorMessages);
                } else {
                    setError(result.message || 'An error occurred during registration');
                }
            }
        } catch (error) {
            setError(error.message || 'An error occurred during registration');
        }
    };

    return (
        <form id="register-form" className="text-center" method="post" onSubmit={handleSubmit}>
            <h2 className="mt-3">NOT A MEMBER YET?</h2>

            <input
                type="text"
                name="name"
                id="name"
                className="form-control mt-4"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
            />

            <input
                type="email"
                name="email"
                className="form-control mt-4"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="phone"
                id="phone"
                className="form-control mt-4"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
            />

            <input
                type="password"
                name="password"
                className="form-control mt-4"
                placeholder="Pick a password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <div className="form-text mt-3">
                Use at least one letter, one number, and seven characters.
            </div>
            <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control mt-3"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
            />

            <div className="mt-4 d-flex justify-content-between">
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        name="role"
                        type="radio"
                        id="customer"
                        value="customer"
                        checked={formData.role === 'customer'}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="customer"> I want to rent a car</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        name="role"
                        type="radio"
                        id="carOwner"
                        value="owner"
                        checked={formData.role === 'owner'}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="carOwner"> I am a car owner</label>
                </div>
            </div>

            <div className="mt-4 form-check d-flex justify-content-between">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="agree"
                    name="agree"
                    ref={agreeRef}
                    required
                />
                <label className="form-check-label ms-0" htmlFor="agree">
                    I have read and agree with the
                    <Link href="#" className="ms-1 fst-italic">
                        Terms and Conditions
                    </Link>
                </label>
            </div>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">{success}</div>}

            <button type="submit" className="btn btn-primary mt-3">
                <span>
                    <i className="bi bi-person-plus-fill fs-4 me-2"></i>
                </span>
                SIGN UP
            </button>
        </form>
    );
}
