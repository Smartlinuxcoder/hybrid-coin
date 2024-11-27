# FusionBank

FusionBank is a simple banking app built with SvelteKit, Drizzle ORM, and JWT-based authentication. It's designed for everyday banking tasks. Imagine you're heading to the market to buy groceries – here's how FusionBank helps:

### Use Case: Going to the Market

1. **Check Your Balance**  
   Before you head out, you open FusionBank to check your balance. You want to make sure you have enough funds to buy what you need. The app shows your current balance, which is updated in real time.

2. **Send Money to a Friend**  
   While browsing the aisles, you realize you need to pay your friend for a shared meal. No problem. You quickly send the agreed amount of money via the "Send Money" feature. The app asks for the recipient's username, and you confirm the amount.

3. **Transaction Receipt with QR Code**  
   FusionBank generates a PDF receipt for the transaction with a QR code attached. You scan the QR code later to confirm the payment with your friend.

4. **View Your Transaction History**  
   After the payment, you can check your transaction history to ensure everything is in order. The app shows all recent transactions, including the one you just made to your friend.

5. **Admin Features (Optional)**  
   If you're the admin, you could also make changes to the system like adjusting your balance for any reason, but for the average user, everything is straightforward and intuitive.

## Features

- **User Authentication**: Secure login and logout with JWT tokens.
- **Balance Management**: Users can view and manage their balance.
- **Send Money**: Transfer money to other users with a simple interface.
- **Transaction History**: View all transactions, both sent and received.
- **PDF Receipt Generation**: After each transaction, a PDF with a QR code is generated for tracking.
- **Admin-Only Features**: Admin can perform special operations like depositing funds.

## Demo

Check out the live demo of FusionBank at [bank.smart.is-a.dev](https://bank.smart.is-a.dev).

## Technologies Used

- **Frontend**: SvelteKit
- **Backend**: SvelteKit, duh
- **Database**: Postgresql with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **PDF Generation**: PDFKit & QR Code

