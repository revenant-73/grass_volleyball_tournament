@AGENTS.md

## Build & Test
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test` (Playwright E2E)
- Specific Test: `npx playwright test tests/filename.spec.ts`

## Pilot Simulation
- Command: `node scripts/simulate-pilot.mjs <EVENT_ID> <DIVISION_ID>`
- Setup: Use `scripts/seed-pilot.mjs` to generate a fresh 8-team event for simulation.

## Development Guidelines (Build Safety)
To avoid Vercel build failures caused by missing environment variables during static optimization:

1. **Lazy Initialization**: Never instantiate third-party SDKs (Stripe, AWS, etc.) at the module level. Use a getter function:
   ```typescript
   export function getStripe() {
     return new Stripe(process.env.STRIPE_SECRET_KEY!, { ... })
   }
   ```
2. **Dynamic Routes**: Explicitly force dynamic rendering for API routes or pages that rely on runtime secrets:
   ```typescript
   export const dynamic = 'force-dynamic'
   ```
3. **Build Testing**: Verify stability by running `npm run build` locally without a `.env` file.
