'use client';
import { Suspense } from 'react';
import BookingForm from '@/components/booking/booking-edit';
import BookingDetailsTitle from '@/components/booking/bookingDetailTitle';
import LoadingBooking from './loading';

export default function BookingEdit() {
    return (
        <>
            <BookingDetailsTitle />
            <Suspense fallback={<LoadingBooking />}>
                <BookingForm />
            </Suspense>
        </>
    );
}
