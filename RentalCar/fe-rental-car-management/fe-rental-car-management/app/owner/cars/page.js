'use client'
import DisplayOwnerCars from "@/components/owner/cars/DisplayOwnerCars";

export default function EditCarInfo() {
    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <a href={"/"}>Home</a>
                        <i className="bi bi-chevron-right"></i>
                        <a href={"/owner/cars"}>My cars</a>
                    </span>
                </div>
                <DisplayOwnerCars />
            </div>
        </>
    );
}