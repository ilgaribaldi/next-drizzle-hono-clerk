
# next-drizzle-hono-clerk

A boilerplate to kickstart your Next.js project with authentication, database, and API routes pre-configured. Webhook endpoints for Stripe, and clerk included.

## Features

- **[Next.js 14](https://nextjs.org/)**: App Router for modern and scalable architecture.
- **[Neon](https://neon.tech/)**: Serverless Postgres database.
- **[Drizzle ORM](https://orm.drizzle.team/)**: Schema-first ORM with a pre-configured user table and database setup.
- **[Clerk](https://clerk.com/)**: Authentication made simple with pre-built flows for:
  - Sign-in
  - Sign-up
  - Forgot password
  - Clerk webhook endpoint listener
- **[Hono](https://hono.dev/)**: Lightweight and fast API routing.
- **[Shadcn](https://ui.shadcn.com/)**: UI components library.
- **[Stripe](https://stripe.com/)**: Payment processing and subscription management.
- **[Resend](https://resend.com/)**: Email sending service.

## Additional Tools

- **React Query**: Powerful data fetching and caching library.
- **Pre-built db hooks**:
  - Basic `/user` API route to retrieve user information.
  - `useGetUser` hook for fetching db user data.
- **Dashboard Layout**: A basic layout to start building your app.

## Getting Started

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/ilgaribaldi/next-drizzle-hono-clerk.git
   cd next-drizzle-hono-clerk
   ```

2. **Install Dependencies**  
   Make sure you have [Bun](https://bun.sh) installed, then run:
   ```bash
   bun install
   ```

3. **Set Up Environment Variables**  
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your credentials for the following environment variables:
     - **Clerk API keys**:
       - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
       - `CLERK_SECRET_KEY`
       - `CLERK_WEBHOOK_SECRET`
       - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
       - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
       - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
       - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
     - **Database URL**:
       - `DATABASE_URL`
     - **Stripe API keys**:
       - `STRIPE_API_KEY`
       - `STRIPE_WEBHOOK_SECRET`
       - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - **Resend API key**:
       - `RESEND_API_KEY`
     - **Email settings**:
       - `EMAIL_FROM`
       - `EMAIL_TO`

4. **Generate the DB Schema**  
   ```bash
   bun run db:generate
   ```

4. **Run the Development Server**  
   ```bash
   bun run dev
   ```

5. **Explore the Features**  
   - Visit `/sign-in`, `/sign-up`, and `/forgot-password` for authentication flows.
   - Use the `/user` API route to retrieve user data.
   - Utilize the `useGetUser` hook in your components.

## Folder Structure

```plaintext
next-drizzle-hono-clerk/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── forgot-password/
│   │   ├── (marketing)/
│   │   │   └── page.tsx                    # Landing page
│   │   ├── (platform)/
│   │   │   ├── admin/                      # Admin only routes
│   │   │   └── dashboard/                  # Dashboard
│   │   ├── api/    
│   │   │   ├── [[...route]]/route.ts       # Hono route handler
│   │   │   └── webhooks/clerk/route.ts     # Clerk webhook endpoint
│   ├── db/
│   │   ├── drizzle.ts
│   │   └── schema.ts                       # User table schema
│   ├── features/
│   │   └── user/                           
│   │   │   └── api/
│   │   │   │   └── use-get-user.ts         # Example hook to query db user data
├── .env.example
├── package.json
└── bun.lockb
```

## Requirements

- **Bun**: For package management and running the project.
- **Clerk Account**: For managing user authentication.
- **Neon PostgreSQL Database**: For database storage.
- **Stripe Account**: For managing payments.
- **Resend Account**: For sending emails.

## Customization

- Update the `drizzle/schema.ts` file to define additional tables or modify the existing `user` schema.
- Customize the authentication flows by editing the pages under the `(auth)` folder.
- Add additional hooks or API routes as needed to extend functionality.

## Contribution

Feel free to submit issues or contribute to this project via pull requests. 

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.