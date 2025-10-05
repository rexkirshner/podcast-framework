# Product Requirements Document (PRD)
## Podcast Website Framework

---

## 1. Executive Summary

This PRD outlines the development of a **reusable podcast website framework** to replace the current Strange Water podcast site (strangewater.xyz) hosted on PodcastPage.io. The framework will be deployed first for Strange Water (69 episodes, completed series), then reused for future podcasts with customized branding and features.

**Primary Goals:**
- Fast, SEO-optimized, performant website framework
- Easy content management for non-technical users
- Flexible monetization integration (Patreon, pods.media, etc.)
- Platform-agnostic hosting with low costs
- Fully customizable branding per podcast

---

## 2. Background & Current State

### Current Site Analysis (strangewater.xyz)
**Strengths:**
- Clean, modern design
- Comprehensive guest profiles with images
- Multiple platform subscription options
- Responsive mobile layout
- Good episode metadata display

**Limitations:**
- Paid service ($) with limited flexibility
- Performance constraints
- Cannot customize features
- No control over hosting/infrastructure
- Limited monetization options

### User Context
- Site owner: Technical proficiency (can manage complex systems)
- Future operators: Entry-level/junior staff (non-technical)
- Strange Water: 69 episodes, ceased production
- Future podcasts: Active, require growth features

---

## 3. Recommended Technical Architecture

### Core Stack: **Astro + Sanity CMS + Netlify**

#### **Frontend Framework: Astro**
**Why Astro:**
- **SEO Excellence:** Pre-rendered HTML, perfect for content-heavy sites
- **Performance:** Minimal JavaScript shipped to client (faster Time to Interactive)
- **Content-First:** Built specifically for blogs, marketing, and content sites
- **Flexibility:** Supports React/Vue/Svelte components when needed
- **Developer Experience:** Simple, modern, great documentation

**vs Next.js:** While Next.js is feature-rich, Astro's zero-JS-by-default approach delivers superior performance for static podcast content. Next.js shines for apps with heavy interactivity (not our use case).

#### **CMS: Sanity.io**
**Why Sanity:**
- **Real-time Collaboration:** Built-in collaborative editing
- **Customizable Studio:** Tailor admin UI for podcast episodes
- **Developer-Friendly:** Portable content, GROQ query language
- **Free Tier:** Generous limits (100k API requests, 3 users)
- **Flexible Hosting:** Cloud-hosted with self-host option

**vs Contentful:** Contentful is enterprise-focused with higher pricing. Sanity offers more customization at lower cost.

**vs Strapi:** Strapi requires self-hosting/management. Sanity's managed service reduces operational overhead while remaining cost-effective.

#### **Hosting: Netlify**
**Why Netlify:**
- **Free Tier for Commercial Use:** Unlike Vercel, allows commercial sites on free tier
- **Generous Limits:** 300 build minutes/month, 100GB bandwidth/month
- **Framework Agnostic:** Not tied to specific framework (unlike Vercel/Next.js)
- **Features:** Forms, redirects, edge functions, instant rollbacks
- **Pricing:** $19/month Pro tier if needed (vs Vercel's $20/user/month)

**Cost at Scale:** Bandwidth overages at $55/100GB. For high-traffic podcasts, consider Cloudflare CDN integration or migration to self-hosted (future flexibility built-in).

#### **Additional Services:**
- **Transcription:** OpenAI Whisper API or Together AI ($0.0015/min audio)
- **Analytics:** Google Analytics (required) + Plausible/Fathom (privacy-focused)
- **Email Capture:** ConvertKit, Mailchimp, or Resend API
- **Audio Player:** Embed from podcast host (Spotify, RSS.com) or custom player (Plyr, Howler.js)

---

## 4. Functional Requirements

### 4.1 MVP Features (Phase 1 - Strange Water Launch)

#### **Episode Management**
- Display episode list (reverse chronological)
- Individual episode pages with:
  - Audio player (embedded from podcast host)
  - Show notes (rich text, formatted)
  - Episode metadata (date, duration, episode number)
  - Guest information (linked to guest profiles)
  - Social share buttons
  - YouTube video embed (if available)
- Episode search/filter by title

#### **Guest Profiles**
- Guest directory page
- Individual guest pages with:
  - Photo, bio, social links
  - Episodes featuring guest
  - External links (website, Twitter, LinkedIn)

#### **Core Pages**
- Homepage: Latest episodes, featured content, subscribe CTAs
- About page: Podcast description, host info
- Episodes archive: Full episode list with pagination
- 404 error page

#### **Monetization & CTAs**
- Patreon integration (prominent CTAs, member-only content badges)
- Subscribe links (Spotify, Apple Podcasts, RSS)
- Social media links (footer/header)

#### **SEO Foundation**
- Schema.org markup (PodcastSeries, PodcastEpisode, Person)
- Meta tags (Open Graph, Twitter Cards)
- XML sitemap
- robots.txt
- Fast Core Web Vitals scores

### 4.2 Phase 2 Features (Post-MVP, New Podcast)

- **Audience Interaction:**
  - "Request an Episode" form (Netlify Forms or Airtable)
  - "Ask a Question" submission
  - Comments (Giscus/GitHub Discussions or Disqus)

- **Newsletter:**
  - Email signup form (header/footer)
  - ConvertKit/Mailchimp integration
  - Automated episode notifications

- **Enhanced Discovery:**
  - Topic/category tagging
  - Related episodes
  - Transcript search (full-text)

- **Content Enrichment:**
  - Episode transcripts (Whisper API)
  - Chapter markers in player
  - Key takeaways/highlights

### 4.3 Phase 3 Features (Future)

- Multi-language support (i18n)
- Premium content tiers (members-only episodes)
- Advanced analytics dashboard
- Guest submission portal
- Automated social media clips/audiograms
- Integration with additional monetization (pods.media, Buy Me a Coffee)

---

## 5. Content Migration Strategy

### Strange Water (69 Episodes)

**Data Sources:**
1. **Primary:** Spotify for Podcasters dashboard export
2. **Secondary:** Scrape strangewater.xyz for show notes/metadata
3. **Tertiary:** Local assets (images, transcripts, supplementary files)

**Migration Tools:**
- Build custom migration script (Node.js) to:
  - Parse Spotify API/CSV export
  - Extract metadata from existing site
  - Transform to Sanity schema
  - Upload via Sanity API

**Content Checklist per Episode:**
- ✅ Episode title, number, date
- ✅ Audio file URL (from Spotify)
- ✅ Show notes (HTML/Markdown)
- ✅ Guest information
- ✅ Episode artwork/thumbnail
- ✅ YouTube video URL (if exists)
- ✅ Duration, file size

---

## 6. Design & UX Requirements

### 6.1 Design Principles
- **Minimalist:** Clean, content-focused layouts
- **Mobile-First:** Optimized for phone/tablet consumption
- **Fast:** Minimal animations, optimized images, lazy loading
- **Accessible:** WCAG 2.1 AA compliance, keyboard navigation

### 6.2 Branding Customization
Each podcast deployment should support:
- **Theme Configuration File** (JSON/YAML):
  - Primary/secondary/accent colors
  - Typography (Google Fonts, custom fonts)
  - Logo (SVG, PNG)
  - Favicon, social sharing image
  - Layout preferences (sidebar vs. no sidebar)

### 6.3 Research Insights (Best Practices)

**From Top Podcast Sites 2025:**
- **Ahrefs Podcast:** Bold, high-energy branding
- **Huberman Lab:** Clean, science-backed, credible design
- **99% Invisible:** Strong visual identity, excellent typography

**Key Design Patterns:**
- Embedded audio players on every episode page
- Sticky subscribe bar or floating CTA
- Guest photos in grid layout
- Episode cards with hover states
- Search bar prominently placed

---

## 7. SEO & Performance Strategy

### 7.1 SEO Requirements

**Technical SEO:**
- ✅ Schema.org markup (JSON-LD):
  - `PodcastSeries` (homepage)
  - `PodcastEpisode` (individual episodes)
  - `Person` (guest profiles, host)
- ✅ Unique meta titles/descriptions per page
- ✅ Canonical URLs
- ✅ Open Graph + Twitter Cards
- ✅ XML sitemap (auto-generated)
- ✅ robots.txt configuration

**Content SEO:**
- ✅ Keyword-optimized episode titles
- ✅ Descriptive URLs (e.g., `/episodes/episode-title-slug`)
- ✅ Alt text for all images
- ✅ Internal linking (episodes ↔ guests)
- ✅ Transcripts (future: full-text search)

**Validation:**
- Google Structured Data Testing Tool
- Lighthouse SEO audit (score >95)
- Screaming Frog SEO Spider (pre-launch crawl)

### 7.2 Performance Targets

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Page Speed:**
- Lighthouse Performance score: >90
- Time to Interactive: <3s
- Total page size: <500KB (excluding audio)

**Optimization Tactics:**
- Image optimization (WebP, AVIF, responsive images)
- Lazy loading (images, iframes, audio players)
- CDN for static assets (Netlify Edge, Cloudflare)
- Minimal third-party scripts
- Critical CSS inlining
- Font subsetting/preloading

---

## 8. CMS Schema Design (Sanity)

### Content Types

#### **Podcast** (Singleton)
```
- name: string
- tagline: string
- description: text
- coverArt: image
- hostName: string
- hostBio: text
- hostPhoto: image
- socialLinks: array (platform, url)
- subscribeLinks: array (platform, url)
- primaryColor: color
- secondaryColor: color
```

#### **Episode**
```
- title: string
- slug: slug
- episodeNumber: number
- publishDate: datetime
- audioUrl: url (from podcast host)
- duration: string
- showNotes: richText
- guests: array (reference to Guest)
- youtubeUrl: url
- transcript: text
- featuredImage: image
- tags: array (string)
```

#### **Guest**
```
- name: string
- slug: slug
- bio: text
- photo: image
- socialLinks: array (platform, url)
- website: url
- episodes: array (reference to Episode)
```

#### **Page** (Flexible Content)
```
- title: string
- slug: slug
- content: richText
- seoTitle: string
- seoDescription: string
```

---

## 9. Phased Implementation Plan

### **Phase 1: MVP (Weeks 1-4) - Strange Water Launch**

**Week 1: Foundation**
- [ ] Initialize Astro project with TypeScript
- [ ] Set up Sanity Studio with schema
- [ ] Configure Netlify deployment
- [ ] Implement design system (Tailwind CSS)

**Week 2: Core Features**
- [ ] Homepage (latest episodes, subscribe CTAs)
- [ ] Episodes archive page
- [ ] Individual episode pages (player, show notes)
- [ ] Guest directory & individual pages
- [ ] About page

**Week 3: Content & SEO**
- [ ] Content migration script (Spotify → Sanity)
- [ ] Migrate all 69 Strange Water episodes
- [ ] Implement Schema.org markup
- [ ] Add meta tags, sitemap, robots.txt
- [ ] Google Analytics integration

**Week 4: Polish & Launch**
- [ ] Performance optimization (images, lazy loading)
- [ ] Accessibility audit (WCAG compliance)
- [ ] Cross-browser/device testing
- [ ] SEO validation (Lighthouse, structured data)
- [ ] Deploy to strangewater.xyz
- [ ] Monitor analytics, Core Web Vitals

### **Phase 2: Enhancement (Weeks 5-8) - New Podcast Features**

- [ ] "Request an Episode" form
- [ ] "Ask a Question" form
- [ ] Email newsletter signup (ConvertKit)
- [ ] Episode search & filtering
- [ ] Related episodes algorithm
- [ ] Transcript generation (Whisper API)
- [ ] pods.media integration exploration

### **Phase 3: Scale (Weeks 9-12) - Second Podcast Deployment**

- [ ] Abstract theme configuration (multi-podcast support)
- [ ] Document deployment process
- [ ] Create new podcast instance (new branding)
- [ ] Test content management workflow for non-technical users
- [ ] Advanced analytics (privacy-focused alternative)
- [ ] A/B testing framework (CTAs, layouts)

---

## 10. Success Metrics

### Launch Metrics (Week 4)
- ✅ Lighthouse Performance: >90
- ✅ Lighthouse SEO: >95
- ✅ Page load time: <3s
- ✅ All 69 episodes migrated successfully
- ✅ Zero broken links/images
- ✅ Mobile usability: 100%

### Growth Metrics (Ongoing)
- Organic search traffic (Google Analytics)
- Episode page views
- Subscriber conversions (clicks on platform links)
- Patreon referral traffic
- Email newsletter signups
- Average session duration

### Technical Metrics
- Core Web Vitals (RUM data from Google)
- Uptime (Netlify status)
- Build times (<5 minutes)
- CMS editor satisfaction (qualitative feedback)

---

## 11. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Content migration errors** | High | Medium | Build validation script, manual QA sample |
| **CMS too complex for non-technical users** | Medium | Low | Simplify Sanity Studio, create documentation/video tutorials |
| **Hosting costs spike with traffic** | Medium | Low | Monitor bandwidth, implement CDN, plan migration to self-hosted |
| **Podcast host API changes** | Low | Medium | Abstract audio source URLs, use fallback embedding |
| **SEO ranking doesn't transfer** | High | Medium | 301 redirects from old URLs, submit new sitemap to Google |
| **Performance degrades with more episodes** | Medium | Low | Implement pagination, optimize queries, use incremental static regeneration |

---

## 12. Open Questions & Decisions Needed

1. **Audio Player:** Custom build (Plyr, Howler.js) or embed from podcast host?
   - **Recommendation:** Embed from podcast host for MVP (simplicity), build custom player in Phase 2 (more control, chapters)

2. **Transcripts:** Auto-generate with Whisper or manual?
   - **Recommendation:** Auto-generate for new podcasts (Whisper API), manually add for Strange Water (69 episodes = ~$70-100 cost)

3. **Comments:** Enable for new podcasts?
   - **Recommendation:** Yes, use Giscus (GitHub Discussions, free, privacy-friendly)

4. **Newsletter Platform:** ConvertKit, Mailchimp, or Resend API?
   - **Recommendation:** Start with ConvertKit (generous free tier, podcast-friendly features)

---

## 13. Appendix: Research Findings

### A. Competitive Analysis
- **Best-in-class examples:** Ahrefs Podcast (bold design), Huberman Lab (clean, credible), 99% Invisible (strong branding)
- **Key features:** Embedded players, episode transcripts, guest profiles, search, subscribe CTAs

### B. Technical Research
- **Astro vs Next.js:** Astro wins for content-heavy, static sites (better SEO, performance)
- **CMS Comparison:** Sanity chosen for real-time collaboration, customization, cost
- **Hosting:** Netlify chosen for free commercial tier, platform agnostic, great DX

### C. SEO Best Practices
- Schema.org markup critical: PodcastSeries, PodcastEpisode, Person
- Individual episode pages with unique URLs essential for ranking
- Transcripts dramatically improve search visibility
- Google prioritizes fast-loading, mobile-optimized content

---

## Next Steps

Once approved, we'll proceed with Phase 1 implementation:
1. Initialize Astro + Sanity + Netlify stack
2. Build core pages (homepage, episodes, guests)
3. Migrate Strange Water content
4. Optimize for SEO & performance
5. Launch to strangewater.xyz

**Estimated Timeline:** 4 weeks to Strange Water launch, then iterate based on analytics and user feedback.
