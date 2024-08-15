import Link from 'next/link';

export default function OwnerPage() {
    return (
        <>
            <div className="footer-bg row">
                <h3 className="ms-4 my-4">Have a car for rent? Don't miss out of your benefit</h3>
            </div>
            <div className="footer-bg row px-4">
                <div className="col-md-4">
                    <div className="d-flex">
                        <span>
                            <i className="fs-2 bi bi-coin"></i>
                        </span>
                        <h4 className="ms-2 mt-2">How the insurance works</h4>
                    </div>
                    <p className="ms-2 mt-1">
                        We fully cover all rentals and even provide roadside assistance. Our rating
                        system and extended member profile checks provide safety.
                    </p>
                </div>

                <div className="col-md-4">
                    <div className="d-flex">
                        <span>
                            <i className="fs-2 bi bi-shield-shaded"></i>
                        </span>
                        <h4 className="ms-2 mt-2">It's completely free</h4>
                    </div>
                    <p className="ms-2 mt-1">
                        We offer both owners and renters free sign ups. It’s only once a vehicle is
                        rented out that a share is deducted to cover admin and insurance.
                    </p>
                </div>

                <div className="col-md-4">
                    <div className="d-flex">
                        <span>
                            <i className="fs-2 bi bi-check-circle"></i>
                        </span>
                        <h4 className="ms-2 mt-2">You decide the price</h4>
                    </div>
                    <p className="ms-2 mt-1">
                        When you list a car you decide the price. We can help with recommendations
                        as to price, but ultimately you decide!
                    </p>
                </div>
            </div>

            <div className="footer-bg row px-4">
                <div className="col-md-4">
                    <div className="d-flex">
                        <span>
                            <i className="fs-2 bi bi-car-front-fill"></i>
                        </span>
                        <h4 className="ms-2 mt-2">Handing over your vehicle</h4>
                    </div>
                    <p className="ms-2 mt-1">
                        You arrange the time and location for the exchange of your vehicle with the
                        renter. Both parties will need to agree and sign the vehicle rental sheet
                        before and after key handover.
                    </p>
                </div>

                <div className="col-md-4">
                    <div className="d-flex">
                        <span>
                            <i className="fs-2 bi bi-exclamation-triangle-fill"></i>
                        </span>
                        <h4 className="ms-2 mt-2">You are in charge</h4>
                    </div>
                    <p className="ms-2 mt-1">
                        We offer both owners and renters free sign ups. It’s only once a vehicle is
                        rented out that a share is deducted to cover admin and insurance.
                    </p>
                </div>

                <div className="col-md-4">
                    <div className="d-flex">
                        <span>
                            <i className="fs-2 bi bi-credit-card"></i>
                        </span>
                        <h4 className="ms-2 mt-2">Set payment</h4>
                    </div>
                    <p className="ms-2 mt-1">
                        We pay you once a month and you can always view how much your car has earned
                        under your user profile.
                    </p>
                </div>
            </div>

            <div className="row">
                <h3 className="ms-4 my-4">Make money on your car right away</h3>
                <div className="text-center mb-3">
                    <Link href="/owner/add-a-car?step=1" className="btn btn-primary col-md-2 py-3">
                        List Your Car Today
                    </Link>
                </div>
            </div>
        </>
    );
}
