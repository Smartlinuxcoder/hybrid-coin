import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema'; // Assuming user table is defined here
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose'; // To verify JWT
import { TextEncoder } from 'util';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const GET = async ({ request }) => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return json({ success: false, message: 'Authorization token is required.' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const { payload } = await jwtVerify(token, secret);

        const { username } = payload;

        const result = await db.select({
            balance: user.balance 
        })
        .from(user)
        .where(eq(user.username, username));

        if (result.length === 0) {
            return json({ success: false, message: 'User not found.' }, { status: 404 });
        }

        return json({ success: true, balance: result[0].balance });

    } catch (error) {
        console.error('Balance Fetch Error:', error);
        return json({ success: false, message: 'Failed to fetch balance.' }, { status: 500 });
    }
};
