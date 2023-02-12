# VC Roles Website

## [Website](https://vcroles.com)

This is the website for the [VC Roles Discord Bot](https://github.com/CDE90/VCRoles).

This is based off the [T3 Stack](https://create.t3.gg/).

## Tech Stack

-   [Next.js](https://nextjs.org)
-   [NextAuth.js](https://next-auth.js.org)
-   [Prisma](https://prisma.io)
-   [Tailwind CSS](https://tailwindcss.com)
-   [tRPC](https://trpc.io)
-   [Markdoc](https://markdoc.dev)
-   [Upstash Redis](https://upstash.com)

Deployed on [Vercel](https://vercel.com).

### Databases

-   Self-hosted [PostgreSQL](https://www.postgresql.org) database for storing bot data --> uses the `prisma/schema.prisma` schema
-   Upstash [Redis](https://redis.io) database for caching discord data
-   Planetscale [MySQL](https://www.mysql.com) database for storing authentication data --> uses the `prisma/auth.prisma` schema

## Development

### Prerequisites

-   [Node.js](https://nodejs.org/en/)
-   [PNPM](https://pnpm.io)
-   [PostgreSQL](https://www.postgresql.org)
-   [Upstash Redis](https://upstash.com)
-   [MySQL](https://www.mysql.com)

### Setup

1. Clone the repository
2. Create a `.env` file in the root directory and add the following environment variables:

```env
# Prisma
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
AUTH_DATABASE_URL=mysql://mysql:mysql@localhost:3306/mysql

# Next Auth
# You can generate the secret via 'openssl rand -base64 32' on Linux
# More info: https://next-auth.js.org/configuration/options#secret
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Next Auth Discord Provider
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Discord Integration
DISCORD_BOT_TOKEN=
DISCORD_BOT_INVITE=
SUPPORT_SERVER_INVITE=

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

3. Run `pnpm install` to install dependencies
4. Begin development by running `pnpm dev`

## Images

### Home Page

![Home Page](/public/homepage.png)

### Dashboard

![Dashboard Settings](/public/dashboard-settings.png)

![Dashboard Links](/public/dashboard-links.png)

![Dashboard Generators](/public/dashboard-generators.png)

### Documentation

![Documentation (Light Mode)](/public/docs-light.png)

![Documentation (Dark Mode)](/public/docs-dark.png)

## How to Contribute

If you want to contribute to this project, feel free to open an issue to propose a change or open a pull request to add a change.

If you want to contribute to the documentation, you can find the documentation in the [`src/pages/docs`](/src/pages/docs/) folder. The documentation is written in [Markdoc](https://markdoc.dev) and is compiled to HTML at build time.

Feel free to reach out to me in the [support server](https://vcroles.com/support) if you have any questions.

## License

This project is licensed under the [Apache 2.0 with Commons Clause](LICENSE).
