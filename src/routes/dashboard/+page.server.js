import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';

export const load = async ({ cookies }) => {
    const token = cookies.get('token');

    if (!token) {
        throw redirect(302, '/login');
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const { username } = payload;

        const result = await db.select({
            balance: user.balance,
            username: user.username
        })
        .from(user)
        .where(eq(user.username, username));

        if (result.length === 0) {
            throw redirect(302, '/login');
        }

        return {
            user: {
                username: result[0].username,
                balance: result[0].balance
            }
        };
    } catch (error) {
        throw redirect(302, '/login');
    }
};

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete('token', { path: '/' });
        throw redirect(302, '/');
    }
};