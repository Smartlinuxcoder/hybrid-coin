import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { TextEncoder } from 'util';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const POST = async ({ request }) => {
    try {
        const { amount } = await request.json();

        if (!amount || isNaN(amount) || amount <= 0) {
            return json({ success: false, message: 'Invalid amount.' }, { status: 400 });
        }

        const depositAmount = parseFloat(amount);

        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return json({ success: false, message: 'Authorization token is required.' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, secret);

        const { username } = payload;
        if (username !== 'admin') {
            return json({ success: false, message: 'Access denied. Admin access required.' }, { status: 403 });
        }

        const existingUser = await db.select({ balance: user.balance })
            .from(user)
            .where(eq(user.username, username));

        if (!existingUser) {
            return json({ success: false, message: 'Admin user not found in the database.' }, { status: 404 });
        }

        const currentBalance = existingUser[0].balance || 0;
        const newBalance = currentBalance + depositAmount;

        const updatedRows = await db
            .update(user)
            .set({ balance: newBalance })
            .where(eq(user.username, username))
            .returning();

        return json({
            success: true,
            message: 'Deposit successful.',
            newBalance: updatedRows[0].balance
        });

    } catch (error) {
        console.error('Deposit Error:', error);
        return json({ success: false, message: 'Error depositing money.' }, { status: 500 });
    }
};