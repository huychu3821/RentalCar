import Link from 'next/link';

export default function RentACarTitle() {
    return (
        <>
            <div className="row ms-4 mt-3">
                <div className="d-flex">
                    <Link href="/">Home</Link>
                    <i className="bi bi-chevron-right"></i>
                    <p>Book car</p>
                </div>
            </div>
        </>
    );
}
