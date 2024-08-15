import Link from 'next/link';
import WhyUs from './why-us';
import WhatPeopleSay from '../common/what-people-say';
import WhereToFindUs from '../common/where-to-find-us';

export default function GuestHome() {
    return (
        <div className="container-fluid">
            <div className="row nav-bg p-2 d-flex">
                <div className="col-md-6 text-center">
                    <h2>
                        Looking for a vehicle? <br />
                        You're at the right place.
                    </h2>

                    <p>Choose between 100's of private cars for rent at really low prices!</p>
                    <Link href="/auth/login-register" className="btn btn-primary">
                        Find a Rental Car Near You
                    </Link>
                </div>

                <div className="col-md-6 text-center">
                    <h2>Are you a car owner?</h2>

                    <p>List your car and make money from your asset today!</p>
                    <Link href="/auth/login-register" className="btn btn-primary">
                        List Your Car Today
                    </Link>
                </div>
            </div>

            <WhyUs />

            <WhatPeopleSay />

            <WhereToFindUs />
        </div>
    );
}
