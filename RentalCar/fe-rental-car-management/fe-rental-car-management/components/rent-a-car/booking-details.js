import Link from 'next/link';

export default function BookingDetail({ bookingDetails }) {
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };
    return (
        <div className="container-fluid">
            <div className="row d-flex flex-row justify-content-between nav-bg px-5 py-3">
                <div className="col-6">
                    <h4 className="text-light">Booking Details</h4>
                    <ul className="text-light ps-5 fw-bolder">
                        <li className="py-2 fw-bold">
                            Pick up location: {bookingDetails.pickUpLocation}
                        </li>
                        <li className="py-2 fw-bold">
                            Pick up date and time:{' '}
                            {formatDate(bookingDetails.pickUpDate) +
                                ' - ' +
                                bookingDetails.pickUpTime}
                        </li>
                        <li className="py-2 fw-bold">
                            Return date and time:{' '}
                            {formatDate(bookingDetails.dropOffDate) +
                                ' - ' +
                                bookingDetails.dropOffTime}
                        </li>
                    </ul>
                </div>
                <div className="col-6">
                    <Link href="/customer/cars/search" className="text-decoration-none">
                        <h5 className="text-end text-light">
                            <i className="bi bi-pencil-square"></i> Change Details
                        </h5>
                    </Link>
                </div>
            </div>
        </div>
    );
}
