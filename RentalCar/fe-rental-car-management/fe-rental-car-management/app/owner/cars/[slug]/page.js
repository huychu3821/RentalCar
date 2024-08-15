'use client'
 
import DisplayCarReview from "@/components/cars/review/DisplayCarReview";
import { useParams } from "next/navigation";

export default function CarFeedBacks() {
    const id = useParams().slug;
    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <a href={'#'}>Home</a>
                        <i className="bi bi-chevron-right"></i>
                        <a href={'/owner/cars'}>My cars</a>
                        <i className="bi bi-chevron-right"></i>
                        <a href={''}>{id}</a>
                    </span>
                </div>
                <DisplayCarReview carId={id} />
            </div>
        </>
    );
}