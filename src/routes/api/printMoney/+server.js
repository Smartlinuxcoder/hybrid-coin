import { db } from '$lib/server/db';
import { user, transaction, banknotes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { TextEncoder } from 'util';
import PDFDocument from 'pdfkit';
import qr from 'qrcode';
import crypto from 'crypto';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);


const generateHash = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};


const generateSalt = (length) => {
    return crypto.randomBytes(length).toString('hex');
};


export const POST = async ({ request }) => {
    try {
        const { amount } = await request.json();
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response('Authorization token is required.', { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const { payload } = await jwtVerify(token, secret);
        const sender = payload.username;

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return new Response('Invalid amount.', { status: 400 });
        }

        const receiver = 'qrcode';
        const numAmount = Number(amount);

        const senderData = await db.select({ balance: user.balance }).from(user).where(eq(user.username, sender));
        if (!senderData.length || senderData[0].balance < numAmount) {
            return new Response('Insufficient balance.', { status: 400 });
        }

        // Generate transaction details before the transaction
        const timestamp = new Date();
        const salt = generateSalt(16);
        const transactionDetails = `${sender}-${receiver}-${numAmount}-${timestamp.getTime()}-${salt}`;
        const hash = generateHash(transactionDetails);
        const qrUrl = `https://bank.smart.is-a.dev/redeem/${hash}`;

        const transactionResult = await db.transaction(async (trx) => {
            await trx.update(user)
                .set({ balance: senderData[0].balance - numAmount })
                .where(eq(user.username, sender));

            const receiverData = await trx.select({ balance: user.balance })
                .from(user)
                .where(eq(user.username, receiver));
            
            if (receiverData.length) {
                await trx.update(user)
                    .set({ balance: receiverData[0].balance + numAmount })
                    .where(eq(user.username, receiver));
            } else {
                await trx.insert(user).values({ 
                    username: receiver, 
                    balance: numAmount 
                });
            }

            await trx.insert(transaction).values({ 
                sender, 
                receiver, 
                amount: numAmount 
            });

            await trx.insert(banknotes).values({
                sender,
                receiver,
                amount: numAmount,
                transactionHash: hash,
                timestamp
            });

            const qrCode = await qr.toDataURL(qrUrl);

            return new Promise((resolve, reject) => {
                const doc = new PDFDocument();
                const pdfBuffer = [];

                doc.on('data', (chunk) => pdfBuffer.push(chunk));
                doc.on('end', () => {
                    resolve(Buffer.concat(pdfBuffer));
                });

                doc.image(qrCode, { 
                    width: 200, 
                    height: 200, 
                    align: 'center', 
                    valign: 'center' 
                });
                doc.rect(50, 70, 500, 200).stroke();

                doc.fontSize(40).text(`${numAmount} $FUSION`, 350, 170);
                doc.fontSize(20).text('Transaction Details', 50, 300);
                doc.fontSize(15).text(`Sender: ${sender}`, 50, 350);
                doc.fontSize(15).text(`Receiver: ${receiver}`, 50, 380);
                doc.fontSize(15).text(`Amount: ${numAmount} $FUSION`, 50, 410);
                doc.fontSize(15).text(`Transaction Hash: ${hash}`, 50, 440);

                doc.end();
            });
        });

        return new Response(transactionResult, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${hash}.pdf"`,
            }
        });
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        return new Response('Error processing the transaction.', { status: 500 });
    }
};