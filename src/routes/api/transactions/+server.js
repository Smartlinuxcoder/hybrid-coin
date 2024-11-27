import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { transaction } from '$lib/server/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { jwtVerify } from 'jose';
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

        if (!username) {
            return json({ success: false, message: 'Invalid token payload.' }, { status: 403 });
        }

        // Fetch transactions where the user is either the sender or receiver
        const transactions = await db
            .select()
            .from(transaction)
            .where(or(eq(transaction.sender, username), eq(transaction.receiver, username)))
            .orderBy(desc(transaction.timestamp));

        return json({ success: true, transactions });
    } catch (error) {
        console.error('Transaction Fetch Error:', error);
        return json({ success: false, message: 'Error fetching transaction history.' }, { status: 500 });
    }
};
