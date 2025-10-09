# Cloudflare Pages Deployment Guide

**Status:** ✅ Ready for deployment
**Build:** ✅ Tested and passing
**Estimated Migration Time:** 1-2 hours

## Prerequisites Completed

- [x] Upstash Redis account created
- [x] Redis credentials configured in `.env`
- [x] Astro build configuration updated
- [x] Local build tested and passing
- [x] @astrojs/cloudflare adapter installed (for future use)
- [x] @upstash/redis client installed

## Environment Variables

**Required for Cloudflare Pages:**

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID=ej6443ov
PUBLIC_SANITY_DATASET=production
SANITY_PROJECT_ID=ej6443ov
SANITY_DATASET=production
SANITY_API_TOKEN=skQlOpVZPpE7YDDFTGpaOIvvEdlKyL5h03qfVg1yqJkw8k4lhdVDFOeGIBY85t41mGDkduFCokSH8RuMR9dK7rZdcSzpc6dxV9waiMLBD5OwXTjdCgxceB1p5FzQVZtf4HhyLmXMsBZbxQVTV8BT2uGFEKlOJ3HPIyhcemtfFTiRMI8OVznM

# Google Analytics
PUBLIC_GA_MEASUREMENT_ID=G-V74NXPXZWQ

# Email (Resend)
RESEND_API_KEY=re_RTbkduRh_B7joppk42TFMhRDbhH7nZfoA
NOTIFICATION_EMAIL=contribution@noreply.strangewater.xyz
RESEND_FROM_EMAIL=contribution@noreply.strangewater.xyz

# Upstash Redis (for distributed rate limiting)
UPSTASH_REDIS_REST_URL=https://loyal-lionfish-11645.upstash.io
UPSTASH_REDIS_REST_TOKEN=AS19AAIncDIzYjk3NDEzM2ZjYmM0MjFhYmVjNzcxZDM0MjFiOGQzMXAyMTE2NDU

# AssemblyAI (transcript generation)
ASSEMBLYAI_API_KEY=161bb5f1bb4a461bb36bc6d4e41b2fa4
```

## Deployment Steps

### Phase 1: Create Cloudflare Pages Project (30 minutes)

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Click **Pages** in the sidebar
   - Click **Create a project**

2. **Connect GitHub Repository**
   - Select **Connect to Git**
   - Authorize Cloudflare to access your GitHub account
   - Select repository: `podcast-website` (or your repo name)
   - Click **Begin setup**

3. **Configure Build Settings**
   ```
   Production branch:       main
   Build command:           npm run build
   Build output directory:  dist
   Root directory:          (leave empty)
   ```

4. **Framework Preset**
   - Select: **Astro**
   - Cloudflare will auto-detect the settings

5. **Environment Variables**
   - Click **Add variable** for each variable listed above
   - Copy/paste from your `.env` file
   - **Important:** Add all 12 environment variables before deploying

6. **Deploy**
   - Click **Save and Deploy**
   - Wait for first build to complete (~2-3 minutes)
   - You'll get a URL like: `podcast-website-abc.pages.dev`

### Phase 2: Test Preview Deployment (30-60 minutes)

1. **Access Preview URL**
   - Visit your `*.pages.dev` URL
   - Test all functionality:

2. **Functional Testing Checklist**
   - [ ] Homepage loads correctly
   - [ ] Episode pages render with full content
   - [ ] Guest pages display properly
   - [ ] Episode search/filter works
   - [ ] Newsletter signup form works
   - [ ] Contribute form submission works
   - [ ] Images load from Sanity CDN
   - [ ] Google Analytics tracking fires
   - [ ] All navigation links work
   - [ ] Sitemap.xml is accessible
   - [ ] 404 page displays correctly

3. **Performance Testing**
   - Run Lighthouse audit
   - Check PageSpeed Insights
   - Compare with current Netlify performance

4. **Troubleshooting**
   - If build fails: Check build logs in Cloudflare Dashboard
   - If pages don't load: Verify environment variables are set
   - If images broken: Check Sanity CMS connection

### Phase 3: DNS Cutover (15-30 minutes)

**⚠️ WARNING: This will switch your production site to Cloudflare**

1. **Add Custom Domain**
   - In Cloudflare Pages project settings
   - Click **Custom domains**
   - Click **Set up a custom domain**
   - Enter: `strangewater.xyz`
   - Cloudflare will auto-configure DNS (since you already use Cloudflare DNS)

2. **Verify DNS Records**
   - Go to **DNS** section in Cloudflare
   - Verify CNAME record points to `podcast-website-abc.pages.dev`
   - Record should be **Proxied** (orange cloud icon)

3. **Wait for DNS Propagation**
   - Usually takes 1-5 minutes with Cloudflare
   - Check status: `dig strangewater.xyz`

4. **Verify Production Site**
   - Visit https://strangewater.xyz
   - Should now load from Cloudflare Pages
   - Run through functional testing checklist again

### Phase 4: Post-Migration Validation (30-60 minutes)

1. **Monitor Analytics**
   - Cloudflare Pages Analytics dashboard
   - Google Analytics (verify events still tracking)
   - Check for 404s or errors

2. **Performance Baseline**
   - Run Lighthouse audit on production
   - Compare with pre-migration metrics
   - Document improvements

3. **Verify Forms**
   - Test newsletter signup → Check ConvertKit
   - Test contribute form → Check email delivery
   - Verify rate limiting works (if applicable)

4. **Monitor for 24 Hours**
   - Watch Cloudflare Analytics for anomalies
   - Check error logs
   - Monitor uptime

## Rollback Plan

**If anything goes wrong, you can instantly rollback:**

1. **Via DNS (Fastest - 5 minutes)**
   - Go to Cloudflare DNS settings
   - Change CNAME from `podcast-website-abc.pages.dev` back to Netlify URL
   - Wait 1-5 minutes for propagation
   - Site will serve from Netlify again

2. **Keep Netlify Active**
   - Do NOT delete Netlify site for at least 2 weeks
   - Keep as backup/rollback option
   - Disable auto-deploys on Netlify to avoid conflicts

## Post-Migration Cleanup (After 2 Weeks)

Once you're confident the migration is successful:

1. **Netlify Cleanup**
   - Stop Netlify site (don't delete yet)
   - Remove auto-deploy from GitHub
   - Keep site paused for 1 month as emergency backup

2. **Documentation Updates**
   - Update README with new deployment info
   - Archive this migration guide
   - Update context/STATUS.md

3. **Cost Monitoring**
   - Both platforms should remain $0/month
   - Monitor Cloudflare usage dashboard
   - Verify no unexpected charges

## Key Differences from Netlify

| Feature | Netlify | Cloudflare Pages |
|---------|---------|------------------|
| Bandwidth | 100GB/month free | Unlimited |
| Builds | 300 min/month | 500/month |
| Cold Start | ~200ms | ~5ms |
| Edge Locations | ~40 | ~300 |
| Build Time | ~30s | ~30s |
| SSG Support | ✅ Excellent | ✅ Excellent |

## Notes

- **This is a pure SSG deployment** - No serverless functions required
- **Cloudflare adapter is installed** but not actively used (kept for future enhancements)
- **Upstash Redis configured** but only needed if you add server-side features later
- **Build time is identical** - Same Astro static build process
- **No code changes required** - Just deployment platform change

## Support

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Astro on Cloudflare:** https://docs.astro.build/en/guides/deploy/cloudflare
- **Troubleshooting:** Check build logs in Cloudflare Dashboard > Pages > [Project] > Deployments

---

**Last Updated:** 2025-10-09
**Status:** Ready for deployment
**Next Step:** Phase 1 - Create Cloudflare Pages project
