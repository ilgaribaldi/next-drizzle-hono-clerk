
# next-drizzle-hono-clerk

A boilerplate to kickstart your Next.js project with authentication, database, and API routes pre-configured. This starter template is designed to save time by setting up all the essentials for you.

## Features

- **Next.js 14**: App Router for modern and scalable architecture.
- **Clerk**: Authentication made simple with pre-built flows for:
  - Sign-in
  - Sign-up
  - Forgot password
  - Clerk webhook endpoint listener
- **Drizzle ORM**: Schema-first ORM with a pre-configured user table and database setup.
- **Hono**: Lightweight and fast API routing.
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
   - Add your credentials:
     - **Clerk API keys**:
       - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
       - `CLERK_SECRET_KEY`
     - **Database URL**:
       - `DATABASE_URL` (from your Neon PostgreSQL database)

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
│   │   │   └── page.tsx       # Landing page
│   │   ├── (platform)/
│   │   │   ├── admin/          # Admin routes
│   │   │   └── dashboard/      # Dashboard
│   │   ├── api/
│   │   │   ├── [[...route]]/route.ts    # Hono route handler
│   │   │   └── webhooks/clerk/route.ts # Clerk webhook endpoint
├── drizzle/
│   ├── schema.ts               # User table schema
│   ├── db.ts                   # Database connection
│   └── migrations/
├── hooks/
│   └── useGetUser.ts
├── .env.example
├── package.json
└── bun.lockb
```

## Requirements

- **Bun**: For package management and running the project.
- **Clerk Account**: For managing user authentication.
- **Neon PostgreSQL Database**: For database storage.

## Customization

- Update the `drizzle/schema.ts` file to define additional tables or modify the existing `user` schema.
- Customize the authentication flows by editing the pages under the `(auth)` folder.
- Add additional hooks or API routes as needed to extend functionality.

## Contribution

Feel free to submit issues or contribute to this project via pull requests. 

## License

This project is licensed under the [MIT License](LICENSE).
