'use client';
import DisplayOwnerCars from '@/components/owner/cars/DisplayOwnerCars';
import OwnerRating from './OwnerRating';


export default function EditCarInfo() {


    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <a href={'/'}>Home</a>
                        <i className="bi bi-chevron-right"></i>
                        <a href={'/owner/cars'}>My Reports</a>
                    </span>
                </div>
                <h1> My Report</h1>
                <OwnerRating/>
                <h1> Details </h1>
                <DisplayOwnerCars />
            </div>
        </>
    );
}
