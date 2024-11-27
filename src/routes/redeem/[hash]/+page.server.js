import { db } from '$lib/server/db';
import { banknotes, user, transaction } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { TextEncoder } from 'util';
import { redirect, error } from '@sveltejs/kit';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
export const actions = {
    default: async ({ request, params, cookies }) => {
        // Check for token cookie
        const token = cookies.get('token');
        if (!token) {
            throw redirect(302, '/login');
        }

        try {
            const { payload } = await jwtVerify(token, secret);
            const username = payload.username;
            const { hash } = params;

            await db.transaction(async (trx) => {
                const [banknoteResult] = await trx
                    .select()
                    .from(banknotes)
                    .where(eq(banknotes.transactionHash, hash));

                if (!banknoteResult) {
                    throw error(404, 'Transaction not found');
                }

                if (banknoteResult.redeemed) {
                    throw error(400, 'Transaction already redeemed');
                }

                const [userResult] = await trx
                    .select()
                    .from(user)
                    .where(eq(user.username, username));

                if (!userResult) {
                    throw error(404, 'User not found');
                }

                const updatedBalance = userResult.balance + banknoteResult.amount;

                // Update the user's balance with the new value
                await trx
                    .update(user)
                    .set({ balance: updatedBalance })
                    .where(eq(user.username, username));

                // Create a new transaction record
                await trx
                    .insert(transaction)
                    .values({
                        type: 'qrcode_redemption',
                        amount: banknoteResult.amount,
                        username: username,
                        createdAt: new Date()
                    });

                await trx
                    .delete(banknotes)
                    .where(eq(banknotes.transactionHash, hash));
            });

            throw redirect(302, '/dashboard?message=Transaction%20successfully%20redeemed');

        } catch (err) {
            console.error('Redeem error:', err);

            if (err.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
                throw redirect(302, '/login');
            }

            // Rethrow or handle specific errors
            if (err.status) throw err;
            throw error(500, 'Error processing redemption');
        }
    }
};


export const load = async ({ params, cookies }) => {
    // Check for token cookie
    const token = cookies.get('token');
    if (!token) {
        throw redirect(302, '/login');
    }

    try {
        const { payload } = await jwtVerify(token, secret);
        const username = payload.username;
        const { hash } = params;

        const [transaction] = await db.select()
            .from(banknotes)
            .where(eq(banknotes.transactionHash, hash));

        if (!transaction) {
            throw error(404, 'Transaction not found');
        }

        return { transaction, username };

    } catch (err) {
        console.error('Load error:', err);

        if (err.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
            throw redirect(302, '/login');
        }

        throw error(500, 'Error loading transaction');
    }
};