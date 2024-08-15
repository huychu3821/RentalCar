import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg nav-bg">
            <div className="container-fluid">
                <Link className="navbar-brand ms-4 fs-2 fw-bold" href="/">
                    <i className="bi bi-car-front-fill"></i>
                    <span className="ms-2">Rent a car today!</span>
                </Link>
            </div>
        </nav>
    );
}