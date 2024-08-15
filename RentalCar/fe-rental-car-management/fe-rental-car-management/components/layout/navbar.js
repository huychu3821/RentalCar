import Link from 'next/link';
import './navbar.css';

export default function Navbar() {
    return (
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
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" href="/auth/login-register">
                                    <i className="bi bi-person-circle"></i> SIGN UP
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/auth/login-register">
                                    LOGIN
                                </Link>
                            </li>
                        </ul>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
