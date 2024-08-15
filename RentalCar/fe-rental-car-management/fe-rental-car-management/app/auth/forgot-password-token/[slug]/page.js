'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RootLoading from '@/app/loading';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const token = params.slug;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/forgot-password/${token}`,
                );

                if (response.status === 200) {
                    router.push('/auth/change-password');
                } else {
                    router.push('/404');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [router, token]);

    return <RootLoading />;
}
