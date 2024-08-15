'use client';

import DisplayUserBookings from '@/components/bookings/DisplayUserBookings';

export default function MyBooking() {
    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <a href={'/'}>Home</a>
                        <i className="bi bi-chevron-right"></i>
                        <a href={'#'}>My Bookings</a>
                    </span>
                </div>
                <DisplayUserBookings />
            </div>
        </>
    );
}
