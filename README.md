This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Tournament Logic & Formats

The platform includes built-in logic for optimal tournament formatting (3-32 teams).

### Key Features:
- **Automated Recommendations**: Sugggests pool counts, court counts, and wave distribution based on team count.
- **Paired 3-Team Pools**: Automatically handles "paired" 3-team pool formats with crossovers to ensure a minimum of 4 matches per team.
- **Snake Draft Distribution**: Evenly distributes teams into pools based on their seeds.
- **Edge Case Handling**: Specifically identifies and warns about the "7-team" conflict where no clean format exists under standard rules.

### Ruleset:
- Pool sizes are limited to 3, 4, or 5 teams.
- Lone 3-team pools are prevented (must be paired).
- 5-team pools are assigned to 2 courts to maintain a 5-wave schedule.
- 4-team pools automatically trigger a 6-wave schedule.

---

## Deployment & Stability

To ensure stable builds on Vercel, this project follows specific patterns to handle environment variables that are only available at runtime (like `STRIPE_SECRET_KEY`):

*   **Lazy Initialization**: Do not instantiate third-party SDKs at the module level. Use getter functions (e.g., `getStripe()`).
*   **Force Dynamic**: API routes that rely on runtime secrets should be marked with `export const dynamic = 'force-dynamic'`.
*   **Local Verification**: Test the build locally without an `.env` file (`npm run build`) to ensure no build-time crashes occur.
