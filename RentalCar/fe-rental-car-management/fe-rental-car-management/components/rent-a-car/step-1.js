import Link from "next/link";

export default function Step1RentACar() {
    return (
        <>
            <div className="row footer-bg mx-4 my-3">
                <div className="col-md-4 d-flex justify-content-around bg-primary">
                    <Link className="btn fw-bold text-light" href="#">Step 1: Booking Infomation</Link>
                    <span>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </span>
                </div>

                <div className="col-md-4 d-flex justify-content-around">
                    <Link className="btn fw-bold" href="#">Step 2: Payment</Link>
                    <span>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </span>
                </div>

                <div className="col-md-4 d-flex justify-content-around">
                    <Link className="btn fw-bold" href="#">Step 3: Finish</Link>
                    <span>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </span>
                </div>
            </div>
        </>
    );
}
