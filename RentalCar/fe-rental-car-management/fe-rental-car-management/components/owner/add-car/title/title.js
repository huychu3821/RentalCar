import Link from 'next/link';

export default function AddCarTitle() {
    return (
        <>
            <div className="row ms-4 mt-3">
                <div className="d-flex">
                    <Link href="/">Home</Link>
                    <i className="bi bi-chevron-right"></i>
                    <p>Add a car</p>
                </div>
            </div>
            <div className="row ms-4">
                <h3>Add a car</h3>
            </div>
        </>
    );
}
