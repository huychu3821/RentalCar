export default function CarInformationTab({ onTabClick, activeTab }) {
    return (
        <div className="col-5">
            <div className="row footer-bg">
                <div className={`col-md-4 d-flex justify-content-around ${activeTab === 'Booking Information' ? 'bg-white' : 'bg-secondary'}`}>
                    <button
                        className="btn btn-sm"
                        onClick={() => onTabClick('Booking Information')}
                    >
                        Booking Information
                    </button>
                </div>
                <div className={`col-md-4 d-flex justify-content-around ${activeTab === 'Car Information' ? 'bg-white' : 'bg-secondary'}`}>
                    <button
                        className="btn btn-sm"
                        onClick={() => onTabClick('Car Information')}
                    >
                        Car Information
                    </button>
                </div>
                <div className={`col-md-4 d-flex justify-content-around ${activeTab === 'Payment Information' ? 'bg-white' : 'bg-secondary'}`}>
                    <button
                        className="btn btn-sm"
                        onClick={() => onTabClick('Payment Information')}
                    >
                        Payment Information
                    </button>
                </div>
            </div>
        </div>
    );
}
