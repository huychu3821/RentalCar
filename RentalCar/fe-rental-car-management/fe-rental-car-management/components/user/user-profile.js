'use client';
import Link from 'next/link';
import PersonalInformation from './personal-information';
import PersonalSecurity from './personal-security';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/app-provider';

const Tabs = dynamic(() => import('react-bootstrap/Tabs'), { ssr: false });
const Tab = dynamic(() => import('react-bootstrap/Tab'), { ssr: false });
export default function UserProfile() {
    const [key, setKey] = useState('personalInformation');

    const { sessionToken } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dob: '',
        nationalId: '',
        detailAddress: '',
        ward: '',
        district: '',
        city: '',
        email: '',
        driverLicense: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user-info/get-user`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        method: 'GET',
                    },
                );

                if (!userResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const resultUserInfo = await userResponse.json();
                if (resultUserInfo.isSuccess) {
                    const userData = resultUserInfo.body;
                    const formattedApiData = {
                        city: userData.city || '',
                        detailAddress: userData.detailAddress || '',
                        district: userData.district || '',
                        dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '',
                        driverLicense: userData.driverLicense || '',
                        name: userData.name || '',
                        nationalId: userData.nationalId || '',
                        phone: userData.phone || '',
                        ward: userData.ward || '',
                        email: userData.email || '',
                    };
                    setFormData(formattedApiData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, [sessionToken]);

    return (
        <>
            <div className="container-fuild m-3">
                <div className="mb-3">
                    <span className="">
                        <Link href={'/'}>Home</Link>
                        <i className="bi bi-chevron-right"></i>
                        <Link href={'/user-info'}> User Info</Link>
                    </span>
                </div>
                <h2 className="fw-bold">My Profile</h2>
            </div>
            <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
                <Tab eventKey="personalInformation" title="Personal Information">
                    <PersonalInformation data={formData} />
                </Tab>
                <Tab eventKey="personalSecurity" title="Security">
                    <PersonalSecurity data={formData} />
                </Tab>
            </Tabs>
        </>
    );
}
