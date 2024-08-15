export default function Step4() {
    return (
        <>
            <div className="row footer-bg mx-4">
                <div className="col-md-3 d-flex justify-content-around">
                    <button className="fs-5 btn fw-bold">Step 1: Basic</button>
                    <span>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </span>
                </div>

                <div className="col-md-3 d-flex justify-content-around">
                    <button className="fs-5 btn fw-bold">Step 2: Details</button>
                    <div>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </div>
                </div>

                <div className="col-md-3 d-flex justify-content-around">
                    <button className="fs-5 btn fw-bold">Step 3: Pricing</button>
                    <div>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </div>
                </div>

                <div className="col-md-3 d-flex justify-content-around bg-info">
                    <button className="fs-5 btn fw-bold"> Step 4: Finish</button>
                    <div>
                        <i className="fs-2 bi bi-chevron-compact-right text-white"></i>
                    </div>
                </div>
            </div>
        </>
    );
}
