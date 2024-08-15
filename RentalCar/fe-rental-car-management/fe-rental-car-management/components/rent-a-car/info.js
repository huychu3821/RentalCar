import { formattedNumber } from '@/lib/format-number';
import CarInfo from './carInfo';

export default function Info({ carData, numberOfDays, images }) {
    return (
        <>
            <div className="row my-3">
                <div className="col-md-6 ps-5 border border-2 py-3">
                    <CarInfo carData={carData} images={images} />
                </div>
                <div className="col-md-6 border border-2 py-3 px-5">
                    <h4 className="fw-bold">Booking summary</h4>
                    <h6 className="fw-bold text-end py-2">Number of days: {numberOfDays}</h6>
                    <h6 className="fw-bold text-end py-2">
                        Price per days: {formattedNumber(carData.basePrice)} VND
                    </h6>
                    <hr />
                    <h6 className="fw-bold text-end py-2">
                        Total: {formattedNumber(numberOfDays * carData.basePrice)} VND
                    </h6>
                    <h6 className="fw-bold text-end py-2">
                        Deposit: {formattedNumber(carData.deposit)} VND
                    </h6>
                </div>
            </div>
        </>
    );
}
