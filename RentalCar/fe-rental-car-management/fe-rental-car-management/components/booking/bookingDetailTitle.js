import Link from 'next/link';

export default function BookingDetailsTitle() {
    return (
        <>
            <div className="row ms-4 mt-3">
                <div className="d-flex">
                    <Link href="/">Home</Link>
                    <i className="bi bi-chevron-right"></i>
                    <Link href={"/customer/booking"}>My bookings</Link >
                    <i className="bi bi-chevron-right"></i>
                    <p>Booking details</p>
                </div>
            </div>
        </>
    );
}