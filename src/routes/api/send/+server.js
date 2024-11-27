import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user, transaction } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { TextEncoder } from 'util';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const POST = async ({ request }) => {
    try {
        const { receiver, amount } = await request.json();

        // Validate input
        if (!receiver || !amount || typeof amount !== 'number' || amount <= 0) {
            return json({ success: false, message: 'Invalid data.' }, { status: 400 });
        }

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return json({ success: false, message: 'Authorization token is required.' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, secret);
        const { username: sender } = payload;

        if (!sender) {
            return json({ success: false, message: 'Invalid token payload.' }, { status: 403 });
        }

        // Verify sender exists and balance
        const senderData = await db
            .select({ balance: user.balance })
            .from(user)
            .where(eq(user.username, sender));

        if (!senderData.length) {
            return json({ success: false, message: 'Sender not found.' }, { status: 404 });
        }

        const senderBalance = senderData[0].balance;
        if (senderBalance < amount) {
            return json({ success: false, message: 'Insufficient balance.' }, { status: 400 });
        }

        // Verify receiver exists
        const receiverData = await db
            .select()
            .from(user)
            .where(eq(user.username, receiver));

        if (!receiverData.length) {
            return json({ success: false, message: 'Receiver not found.' }, { status: 404 });
        }

        // Perform transaction in a transaction block
        await db.transaction(async (trx) => {
            // Deduct from sender
            await trx
                .update(user)
                .set({ balance: sql`${user.balance} - ${amount}` })
                .where(eq(user.username, sender));

            // Add to receiver
            await trx
                .update(user)
                .set({ balance: sql`${user.balance} + ${amount}` })
                .where(eq(user.username, receiver));

            // Log the transaction
            await trx.insert(transaction).values({
                sender,
                receiver,
                amount,
            });
        });

        return json({ success: true, message: 'Money sent successfully.' });
    } catch (error) {
        console.error('Send Money Error:', error);
        return json({ success: false, message: 'Error processing the request.' }, { status: 500 });
    }
};
