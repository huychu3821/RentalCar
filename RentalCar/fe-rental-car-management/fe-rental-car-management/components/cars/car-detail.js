'use client';
import Link from 'next/link';
import DetailLayout from './detail-layout';
import { useParams } from 'next/navigation';

export default function CarDetail() {
    const id = useParams().slug;
    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <Link href={'/'}>Home</Link>
                        <i className="bi bi-chevron-right"></i>
                        <Link href={'/customer/cars/search'}> Search result</Link>
                        <i className="bi bi-chevron-right"></i>
                        <Link href={'#'}> Car detail</Link>
                    </span>
                </div>
                <h3 className="fw-bold">Car Details</h3>
                <div>
                    <DetailLayout id={id} />
                </div>
            </div>
        </>
    );
}
