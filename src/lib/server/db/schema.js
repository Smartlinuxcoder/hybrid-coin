import { pgTable, serial, text, real, unique, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
    id: serial('id').primaryKey(),          
    username: text('username').unique(),    
	name: text('name'),
    password: text('password'),            
    balance: real('balance').default(100),    
	createdAt: timestamp('created_at').defaultNow(),
});

export const transaction = pgTable('transactions', {
    id: serial('id').primaryKey(),             
    sender: text('sender'),                      
    receiver: text('receiver'),                  
    amount: real('amount'),                     
    timestamp: timestamp('timestamp').defaultNow(),
});

export const banknotes = pgTable('banknotes', {
    id: serial('id').primaryKey(),
    sender: text('sender'),
    receiver: text('receiver'),
    amount: real('amount'),
    transactionHash: text('transaction_hash'),
    timestamp: timestamp('timestamp').defaultNow(),
});