import Link from 'next/link';

export default function EditCarTitle() {
    return (
        <>
            <div className="row ms-4 mt-3">
                <div className="d-flex">
                    <Link href="/owner">Home</Link>
                    <i className="bi bi-chevron-right"></i>
                    <Link href="/owner/cars">My car</Link>
                    <i className="bi bi-chevron-right"></i>
                    <p>Edit details</p>
                </div>
            </div>
            <div className="row ms-4">
                <h3>Edit car details</h3>
            </div>
        </>
    );
}
