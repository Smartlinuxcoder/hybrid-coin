import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db'; 
import bcrypt from 'bcrypt'; 
import { user } from '$lib/server/db/schema';
export const POST = async ({ request }) => {
    try {
        const formData = await request.json();
        const { username, name, password } = formData;
        
        if (!username || !password) {
            return json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }
        
        console.log('Form Data:', formData);

        const hashedPassword = await bcrypt.hash(password, 10);
        let modifiedName = name || username;
        await db.insert(user).values({
            username,
            "name": modifiedName,
            password: hashedPassword
        });

        return json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration Error:', error);
        if (error.code === '23505') {
            return json({ success: false, message: 'Username or email already exists.' }, { status: 400 });
        }

        return json({ success: false, message: 'Registration failed.' }, { status: 500 });
    }
};
