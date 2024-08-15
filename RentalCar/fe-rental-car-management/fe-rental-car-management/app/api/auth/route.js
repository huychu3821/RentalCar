export async function POST(request) {
    const res = await request.json();

    const sessionToken = res.payload?.token;

    if (!sessionToken) {
        return Response.json(
            {
                message: 'No session token received!',
            },
            {
                status: 400,
            },
        );
    }
    return Response.json(res.payload, {
        status: 200,
        headers: {
            'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly`,
        },
    });
}
