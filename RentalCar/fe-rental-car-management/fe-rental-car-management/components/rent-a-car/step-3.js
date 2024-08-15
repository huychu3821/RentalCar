import Link from "next/link";

export default function Step3RentACar() {
    return (
        <>
            <div className="row footer-bg mx-4 my-3">
                <div className="col-md-4 d-flex justify-content-around">
                    <Link className="btn fw-bold" href="#">Step 1: Booking Infomation</Link>
                    <span>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </span>
                </div>

                <div className="col-md-4 d-flex justify-content-around">
                    <Link className="btn fw-bold" href="#">Step 2: Payment</Link>
                    <div>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </div>
                </div>

                <div className="col-md-4 d-flex justify-content-around bg-primary">
                    <Link className="btn fw-bold text-light" href="#">Step 3: Finishing</Link>
                    <div>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </div>
                </div>
            </div>
        </>
    );
}
