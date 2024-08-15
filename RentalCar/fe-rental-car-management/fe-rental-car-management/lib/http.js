// 'use server';

// import { cookies } from 'next/headers';

export const isClient = () => typeof window !== 'undefined';

// export const getSessionToken = () => {
//     let sessionToken;
//     if (isClient()) {
//         sessionToken = localStorage.getItem('sessionToken');
//     } else {
//         sessionToken = cookies().get('sessionToken');
//     }
//     return sessionToken;
// };
