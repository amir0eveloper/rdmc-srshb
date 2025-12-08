# RDMC - Somali Regional State Health Bureau Repository

This is a Next.js project for an institutional repository for Somali Regional State Health Bureau. It is designed to store, manage, and disseminate digital assets such as research papers, datasets, and other scholarly materials.

## Key Features

*   **Hierarchical Structure:** The repository is organized into Communities, Collections, and Items, allowing for a flexible and scalable content hierarchy.
*   **Role-Based Access Control:** The system has a role-based access control system with roles like `USER`, `ADMIN`, `SUBMITTER`, and `REVIEWER`.
*   **Metadata:** The application supports flexible metadata for describing digital assets, similar to the Dublin Core standard.
*   **Authentication:** User authentication is handled by NextAuth.js, with support for credentials-based login.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons.

## Getting Started

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up the database:**

    *   Make sure you have a PostgreSQL database running.
    *   Create a `.env` file and set the `DATABASE_URL` environment variable.
    *   Run the following command to sync the database schema:

        ```bash
        npx prisma db push
        ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
.
├── app/
│   ├── (browse)/
│   │   ├── collections/[collectionId]/page.tsx
│   │   ├── communities/[communityId]/page.tsx
│   │   └── items/[itemId]/page.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── repo/
│   │   └── page.tsx
│   ├── signin/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx
│   │   └── UserNav.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── public/
```

## Authentication

Authentication is handled by [NextAuth.js](https://next-auth.js.org/). The configuration is in `app/api/auth/[...nextauth]/route.ts`. The application uses a credentials-based login system.

The `User` model in `prisma/schema.prisma` has a `role` field that can be one of `USER`, `ADMIN`, `SUBMITTER`, or `REVIEWER`. This allows for role-based access control to different parts of the application.

## Database

The database schema is defined in `prisma/schema.prisma`. [Prisma](https://www.prisma.io/) is used as the ORM to interact with the PostgreSQL database.

The schema includes models for:

*   **Authentication:** `User`, `Account`, `Session`, `VerificationToken`
*   **Institutional Repository:** `Community`, `Collection`, `Item`, `MetadataField`, `Bitstream`

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.# rdmc-srshb
