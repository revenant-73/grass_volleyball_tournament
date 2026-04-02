<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Build Safety (Vercel)
To prevent build failures from missing runtime environment variables (e.g., `STRIPE_SECRET_KEY`):
1. **Lazy Initialization**: Use getter functions for third-party SDKs (e.g., `getStripe()`) instead of module-level instantiation.
2. **Force Dynamic**: Mark API routes relying on secrets with `export const dynamic = 'force-dynamic'`.
3. **Local Check**: Always run `npm run build` without `.env` to verify build stability.
<!-- END:nextjs-agent-rules -->
