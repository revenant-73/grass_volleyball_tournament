@AGENTS.md

## Build & Lint
- Build: `npm run build`
- Lint: `npm run lint`

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
