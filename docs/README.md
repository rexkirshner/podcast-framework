# Documentation Index

This directory contains comprehensive documentation for hosting migrations, troubleshooting, and platform-specific configurations.

---

## 📚 Documentation Files

### Migration & Deployment

- **[HOSTING_MIGRATION_CHECKLIST.md](./HOSTING_MIGRATION_CHECKLIST.md)**
  - Complete checklist for migrating between hosting platforms
  - Pre-migration assessment
  - Step-by-step migration process
  - Rollback procedures
  - Post-migration validation
  - **Use this for:** Any future hosting platform migration

- **[CLOUDFLARE_TROUBLESHOOTING.md](./CLOUDFLARE_TROUBLESHOOTING.md)**
  - All issues encountered during Netlify → Cloudflare migration
  - Root causes and solutions
  - Platform-specific differences
  - Debugging tips
  - **Use this for:** Cloudflare-specific issues or understanding platform differences

### Project Root Documentation

See also the main project documentation:
- `../CLOUDFLARE_DEPLOYMENT.md` - Step-by-step Cloudflare deployment guide
- `../README.md` - Project overview and setup
- `../context/` - Project context and session documentation

---

## 🚀 Quick Start: Hosting Migration

When migrating to a new platform:

1. **Read the checklist:** [HOSTING_MIGRATION_CHECKLIST.md](./HOSTING_MIGRATION_CHECKLIST.md)
2. **Check troubleshooting:** [CLOUDFLARE_TROUBLESHOOTING.md](./CLOUDFLARE_TROUBLESHOOTING.md)
3. **Use the hosting adapter:** `src/lib/hosting-adapter.ts`
4. **Test thoroughly** before DNS cutover

---

## 🔧 Hosting Abstraction Layer

### Key Utilities

The project includes a hosting abstraction layer to handle platform differences:

**Location:** `src/lib/hosting-adapter.ts`

**Key Functions:**
```typescript
// Get environment variables (works on all platforms)
import { getEnvironmentVariables } from '@/lib/hosting-adapter';

export const POST: APIRoute = async (context) => {
  const env = getEnvironmentVariables(context);
  const apiKey = env.API_KEY; // Works on Netlify, Cloudflare, Vercel
}

// Get service configuration
import { getServiceConfig } from '@/lib/hosting-adapter';

const config = getServiceConfig(context);
// Returns: { sanity, email, analytics, redis }

// Platform-agnostic error logging
import { logError } from '@/lib/hosting-adapter';

logError(error, { context: 'additional info' }, apiContext);

// Detect platform
import { detectPlatform } from '@/lib/hosting-adapter';

const platform = detectPlatform(context);
// Returns: 'cloudflare' | 'netlify' | 'vercel' | 'local' | 'unknown'
```

**Benefits:**
- ✅ Write once, deploy anywhere
- ✅ Platform-specific optimizations handled automatically
- ✅ Easier testing and local development
- ✅ Simplified future migrations

---

## 📋 Platform Comparison

| Feature | Netlify | Cloudflare Pages | Vercel |
|---------|---------|------------------|--------|
| **Runtime** | Node.js | V8 Isolates | Node.js / Edge |
| **Env Vars** | `process.env` | `locals.runtime.env` | `process.env` |
| **Functions** | `/functions` | API routes | `/api` |
| **Cold Start** | ~200ms | ~5ms | ~50ms |
| **Free Tier** | 100GB bandwidth | Unlimited | 100GB bandwidth |
| **Build Time** | 300 min/mo | 500 builds/mo | 6000 min/mo |

---

## 🐛 Common Issues

### Environment Variables Undefined
**Platform:** Cloudflare
**Solution:** Use `getEnvironmentVariables(context)` from hosting adapter

### Module Not Found
**Platform:** Cloudflare
**Solution:** Check if package uses Node.js APIs, find V8-compatible alternative

### Window/Document Not Defined
**Platform:** SSR (all)
**Solution:** Use `typeof window !== 'undefined'` checks, see `src/lib/utils.ts`

### Service Initialization Fails
**Platform:** Cloudflare
**Solution:** Move initialization inside request handlers (lazy loading)

---

## 📖 Related Resources

### External Documentation
- [Astro Adapters](https://docs.astro.build/en/guides/deploy/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Vercel Edge Runtime](https://vercel.com/docs/functions/edge-functions/edge-runtime)

### Internal Documentation
- [Context Documentation](../context/CONTEXT.md)
- [Session History](../context/SESSIONS.md)
- [Project Status](../context/STATUS.md)

---

## 🤝 Contributing

When encountering new platform-specific issues:

1. Document the issue in the appropriate troubleshooting guide
2. Update the hosting adapter if needed
3. Add to the migration checklist
4. Update this README if adding new docs

---

**Last Updated:** 2025-10-09
**Maintainers:** Project team
**Contact:** See project README
