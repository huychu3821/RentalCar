import Link from 'next/link';
import './footer.css';

export default function Footer() {
    return (
        <footer className="footer mt-1 py-2 footer-bg">
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <h5>RENT CAR</h5>
                        <Link href="/customer/cars/search" className="text-decoration-none">
                            Search Cars and Rates
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <h5>CUSTOMER ACCESS</h5>
                        <ul className="list-inline mb-0">
                            <li className="list-item">
                                <Link href="/customer/booking" className="text-decoration-none">
                                    Manage My Booking
                                </Link>
                            </li>
                            <li className="list-item">
                                <Link href="/ewallet" className="text-decoration-none">
                                    My Wallet
                                </Link>
                            </li>
                            <li className="list-item">
                                <Link href="/owner/cars" className="text-decoration-none">
                                    My Car
                                </Link>
                            </li>
                            <li className="list-item">
                                <a href="/auth/login-register" className="text-decoration-none">
                                    Log In
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-3">
                        <h5>JOIN US</h5>
                        <Link href="/auth/login-register" className="text-decoration-none">
                            New User Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
