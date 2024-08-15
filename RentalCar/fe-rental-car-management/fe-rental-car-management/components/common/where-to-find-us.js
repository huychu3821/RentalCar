'use client'
import { useEffect, useState } from 'react';

export default function WhereToFindUs() {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/guest/top-province`);
                const data = await response.json();
                setUserData(Object.entries(data.body));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="container-fluid">
            <br />
            <h2 className="mx-4">Where to find us?</h2>
            <div className="row d-flex justify-content-around">
                {userData.map(([location, cars], index) => (
                    <div
                        key={index}
                        className="card col-md-3 m-3"
                        style={{
                            backgroundImage: "url('https://mdbootstrap.com/img/Photos/Others/images/76.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            height: '200px',
                        }}
                    >
                        <div className="card-body d-flex flex-column justify-content-end">
                            <h4 className="text-light">{location}</h4>
                            <p className="card-text text-light">{cars}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
