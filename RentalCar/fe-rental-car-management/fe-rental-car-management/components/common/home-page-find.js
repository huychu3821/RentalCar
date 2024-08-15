'use client';

import SearchCarForm from './search-car-form';
import { useRouter } from 'next/navigation';


export default function HomepageFind() {
    const router = useRouter();
    const handleSearch = (results) => {
        router.push('/customer/cars/search', results);
    };

    return (
        <div className="container-fluid nav-bg py-3">
            <div className="row">
                <div className="d-flex">
                    <div className="col-5">
                        <h2 className="mx-4 text-light fw-bolder">
                            Looking for a vehicle? You’re at the right place.
                        </h2>
                        <p className="mx-4 text-light fw-bold">
                            We have a large selection of locally owned cars available for you to
                            choose from. Rental plans are customized to suit your needs.
                        </p>
                        <p className="mx-4 text-light fw-bold">
                            With over 300 cars located nationwide we will have something for you.
                        </p>
                    </div>
                    <div className="col-7">
                        <SearchCarForm onSearch={handleSearch} />
                    </div>
                </div>
            </div>
        </div>
    );
}
