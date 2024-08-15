import { cookies } from 'next/headers';

export async function POST(request) {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('sessionToken');

    if (!sessionToken) {
        return Response.json(
            { message: 'No session token received!' },
            {
                status: 401,
            },
        );
    }
    try {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/logout`, {
            method: 'GET',
        });

        return Response.json(result.body, {
            status: 200,
            headers: {
                // Xóa cookie sessionToken
                'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            },
        });
    } catch (error) {
        if (error.payload && error.status) {
            return Response.json(error.payload, {
                status: error.status,
            });
        } else {
            return Response.json(
                {
                    message: 'Unknown error',
                },
                {
                    status: 500,
                },
            );
        }
    }
}
