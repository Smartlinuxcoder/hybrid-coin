import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, transaction } from '$lib/server/db/schema';
import { eq, or, desc } from 'drizzle-orm';
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

        // Fetch user details
        const userResult = await db
            .select({
                balance: user.balance,
                username: user.username
            })
            .from(user)
            .where(eq(user.username, username));

        if (userResult.length === 0) {
            throw redirect(302, '/login');
        }

        const userDetails = {
            username: userResult[0].username,
            balance: userResult[0].balance
        };

        // Fetch transactions for the user
        const transactionsResult = await db
            .select()
            .from(transaction)
            .where(or(eq(transaction.sender, username), eq(transaction.receiver, username)))
            .orderBy(desc(transaction.timestamp));

        return {
            user: userDetails,
            transactions: transactionsResult
        };
    } catch (error) {
        console.error('Error loading user or transactions:', error);
        throw redirect(302, '/login');
    }
};

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete('token', { path: '/' });
        throw redirect(302, '/');
    }
};
