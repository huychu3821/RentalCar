'use client';

import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './navbar.css';
import { useAppContext } from '@/app/app-provider';

export default function Header() {
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleOpenModal = () => setShowModal(true);
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfoResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-info/get-user`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                    },
                );
                if (!userInfoResponse.ok) {
                    throw new Error('Failed to fetch wallet data');
                }
                const userInfoJson = await userInfoResponse.json();
                setUserInfo({
                    name: userInfoJson.body.name || '',
                    email: userInfoJson.body.email || '',
                    role: userInfoJson.body.role || '',
                });
            } catch (error) {
                console.error('log out error: ', error);
            }
        };
        getUserInfo();
    }, [sessionToken]);
    const handleLogout = async (e) => {
        e.preventDefault();
        setShowModal(false);
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {},
            });

            router.push('/');
        } catch (error) {
            alert('log out error: ', error);
        }
    };
    return (
        <>
            <nav className="navbar navbar-expand-lg nav-bg">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-4 fs-2 fw-bold" href="/">
                        <i className="bi bi-car-front-fill"></i>
                        <span className="ms-2">Rent a car today!</span>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto fs-5">
                            <li className="nav-item">
                                <Link className="nav-link" href="#">
                                    ABOUT US
                                </Link>
                            </li>
                            <li className="nav-item dropdown me-1">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Welcome, {userInfo.name}
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item" href="/user-info">
                                            My Profile
                                        </Link>
                                    </li>
                                    {userInfo.role == '[OWNER]' && (
                                        <li>
                                            <Link className="dropdown-item" href="/owner/cars">
                                                My Cars
                                            </Link>
                                        </li>
                                    )}

                                    {userInfo.role == '[CUSTOMER]' && (
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                href="/customer/booking"
                                            >
                                                My Bookings
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link className="dropdown-item" href="/ewallet">
                                            My Wallet
                                        </Link>
                                    </li>

                                    {userInfo.role == '[OWNER]' && (
                                        <li>
                                            <Link className="dropdown-item" href="/owner/report">
                                                My Reports
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <Button
                                            className="dropdown-item"
                                            // href="#"

                                            onClick={handleOpenModal}
                                        >
                                            Log out
                                        </Button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Modal show={showModal} onHide={handleCloseModal} centered className="margin: auto">
                <Modal.Body className="text-center">
                    <h3>LOG OUT</h3>
                    <p>Are you sure you want to log out?</p>
                </Modal.Body>
                <Modal.Footer className="d-flex">
                    <Button
                        variant="secondary"
                        onClick={handleCloseModal}
                        className="bg-secondary-subtle text-black"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                        className="bg-secondary-subtle text-black"
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
