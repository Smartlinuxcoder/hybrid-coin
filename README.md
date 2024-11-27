**The Sigmaest bank: FusionBank**

Welcome to FusionBank, a cool mobile banking app that combines the convenience of online transactions with the security of offline capabilities. 
It is built with SvelteKit, Drizzle ORM, and uses Jose for authenticating.

**The FusionBank Experience**

Let's say you're heading to the market to pick up some groceries. Here's how FusionBank makes your day easier:

1. **Check Your Balance and Send Money**: Before you head out, check your balance and send money to a friend or family member directly from the app. It's as easy as sending a text message, and everything happens online.
2. **Generate a Banknote**: Once you've sent the money, FusionBank generates a banknote - a receipt with a unique QR code that contains all the transaction details. This banknote acts as proof of payment and can be used offline.
3. **Use the Banknote Offline**: Even if you're offline when you receive or generate the banknote, you can still scan the QR code later to retrieve the transaction details. This is perfect for situations where you're not connected to the internet.
4. **Sync When Online**: When you're back online, simply scan the QR code again to validate and complete the transaction. The app will automatically sync the transaction with our servers to ensure everything is up to date.

**Features You'll Love**

- **Secure Login**: FusionBank uses JWT-based authentication to ensure your account is safe and secure.
- **Balance Management**: View and manage your balance with ease.
- **Send Money**: Transfer money to other users with a simple and intuitive interface.
- **Transaction History**: View all your transactions, both sent and received, for easy tracking.
- **PDF Receipt Generation**: Get a PDF receipt with a QR code after each transaction for your records.
- **Admin Features**: Admins can perform special tasks like adjusting balances, managing users, and reviewing transaction history through secure authentication.

**Check Out the Demo**

Want to see FusionBank in action? Check out the live demo at [bank.smart.is-a.dev](https://bank.smart.is-a.dev).

**Technologies Used**

We've built FusionBank using a combination of cool stuff, including:

- **Frontend**: SvelteKit because yes :)
- **Backend**: SvelteKit, because its fullstack duh
- **Database**: Postgresql with Drizzle ORM for database business
- **Authentication**: JWT (JSON Web Tokens) for secure authentication and authorization
- **PDF Generation**: PDFKit and QR Code for generating banknotes and other documents

Come and experience the Sigma power of FusionBank for yourself.