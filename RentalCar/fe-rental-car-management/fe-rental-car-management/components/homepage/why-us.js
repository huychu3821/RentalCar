export default function WhyUs() {
    return (
        <div className="container-fluid my-3">
            <h2 className="ms-4">Why us?</h2>
            <div className="row">
                <div className="col-md-3" >
                    <div className="card" style={{ height: '40vh' }}>
                        <div className="card-header text-center fs-2">
                            <i className="bi bi-cash-coin"></i>
                        </div>

                        <div className="card-body">
                            <h5 className="card-title text-center">Save money</h5>
                            <p className="card-text">
                                We have no setup or registration fees. You are only charged when you
                                rent a car. So get started for FREE!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card" style={{ height: '40vh' }}>
                        <div className="card-header text-center fs-2">
                            <i className="bi bi-person-standing"></i>
                        </div>

                        <div className="card-body">
                            <h5 className="card-title text-center">Convenient</h5>
                            <p className="card-text">
                                We have a large selection of privately owned cars to suit your needs
                                throughout the country
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card" style={{ height: '40vh' }}>
                        <div className="card-header text-center fs-2">
                            <i className="bi bi-hammer"></i>
                        </div>

                        <div className="card-body">
                            <h5 className="card-title text-center">Legal and insurance</h5>
                            <p className="card-text">
                                We fully cover all rentals and even provide roadside assistance. Our
                                rating system and extended member profile checks provide safety.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card" style={{ height: '40vh' }}>
                        <div className="card-header text-center fs-2">
                            <i className="bi bi-headphones"></i>
                        </div>

                        <div className="card-body">
                            <h5 className="card-title text-center">24/7 support</h5>
                            <p className="card-text">
                                Our team is ready to support you all along the way with our 24/7
                                hotline and services
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
