import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import { TextEncoder } from 'util';
import bcrypt from 'bcrypt';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const POST = async ({ request }) => {
    try {
        const formData = await request.json();
        const { username, password } = formData;

        if (!username || !password) {
            return json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }

        const result = await db.select({
            password: user.password
        })
        .from(user)
        .where(eq(user.username, username));

        if (result.length === 0) {
            return json({ success: false, message: 'Invalid username or password.' }, { status: 401 });
        }

        if (!bcrypt.compareSync(password, result[0].password)) {
            return json({ success: false, message: 'Invalid username or password.' }, { status: 401 });
        }

        const token = await new SignJWT({ username, role: 'user' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(secret);

        return json({ success: true, token });
        
    } catch (error) {
        console.error('Login Error:', error);
        return json({ success: false, message: 'Login failed.' }, { status: 500 });
    }
};