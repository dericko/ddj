# Setup
`.env` with postgres url
`npx prisma migrate --name init` creates table and adds pgvector
`npx prisma db seed` seeds the db
`npm run dev` to run app

Built with next.js, on [pgvector starter](https://vercel.com/templates/next.js/postgres-pgvector)
