# Oakland Genesis Soccer Club

This is a web application that helps the OGSC's participants (players/students, their mentors, their parents, and the donors that support them) find information about the program and see its impact over time on players in the program.

## Technologies

- [Next.js](https://nextjs.org/)
  - NodeJS 12.16.0
  - Yarn 1.22.5
- Typescript

## Getting Started

First install the dependencies

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the file.

## Available Scripts

In the project directory you can run:

```yarn```

Installs all dependencies.<br />

```yarn dev```

Runs the app in the development mode.<br />

```yarn db: seed```

Generates seed data for use in the local environment.<br />

```yarn db:migrate up```

Safely run all migrations and perform the database changes.<br />

```yarn db:migrate down```

Safely reverts all database changes you made.<br />

**You will need to run `yarn prisma introspect ` and `yarn prisma genereate` after running a migration**

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
