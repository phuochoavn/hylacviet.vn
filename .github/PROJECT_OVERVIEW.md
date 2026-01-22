# hylacviet.vn - Project Overview & Context

## 🎯 Business Context

**Brand**: Mai Đỗ - Premium Vietnamese Traditional Fashion  
**Products**: Áo Dài & Pháp Phục (Ceremonial Clothing)  
**Market Position**: Premium, Quality-focused, Cultural Storytelling  
**Catalog Size**: ~10 curated products (quality over quantity)

### Owner Philosophy
- **"Quality over Speed"** - Always choose robust, production-ready solutions
- **"Understand, Don't Just Execute"** - Prefer thorough discussion before implementation
- **"Production First"** - No shortcuts, build it right from day 1
- **Time**: Not constrained - willing to invest time for correct solutions

---

## 🏗️ Technical Architecture (Golden Stack)

### Infrastructure Layer ✅ COMPLETE
````
VPS: Hostinger Ubuntu 24.04, 4GB RAM
├── Traefik v2.11 (Reverse Proxy + SSL)
├── PostgreSQL 16 (Production-tuned)
├── Redis 7 (AOF persistence, Event Bus)
├── MinIO (S3-compatible Object Storage)
└── Uptime Kuma (Monitoring)
````

**Deployment**: Docker Compose orchestration  
**Network**: Segmented (traefik-public + medusa-internal)  
**SSL**: Let's Encrypt via Cloudflare DNS challenge

### Backend Layer ✅ COMPLETE
````
MedusaJS v2 (Split Architecture)
├── medusa-server (API + Admin UI)
│   ├── Endpoint: api.hylacviet.vn
│   ├── Admin: api.hylacviet.vn/app
│   └── Role: Handle HTTP requests, synchronous logic
└── medusa-worker (Background Jobs)
    ├── No external exposure
    └── Role: Process events, async tasks, email, indexing
````

**File Storage**: MinIO via `@medusajs/medusa/file-s3` module  
**CDN**: `cdn.hylacviet.vn/medusa-media/`  
**Data**: 5 products with images uploaded and thumbnails set

### Frontend Layer ❌ BROKEN (Current Task)
````
Next.js 15.3.8 (App Router)
├── Domain: hylacviet.vn
├── Design: "Modern Zen" with Vietnamese aesthetics
├── Status: Build fails due to syntax error in product page
└── Issue: getImagesForVariant function has extra closing brace
````

---

## 🚨 Current Critical Issue

**File**: `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`  
**Function**: `getImagesForVariant` (lines ~55-70)  
**Error**: Syntax error - Expression expected at line 71

**Context**: 
- Original code didn't handle `product.images` being undefined
- Attempted to add null-safety (`|| []` fallback)
- Introduced syntax error during manual edit (likely extra `}`)

**API Verification**: Backend returns correct structure:
````json
{
  "images": [{"id": "...", "url": "https://cdn.hylacviet.vn/medusa-media/..."}]
}
````

---

## 📚 MedusaJS v2 Critical Context

### What's Different from v1
1. **Modular Architecture**: Commerce features are isolated modules
2. **Workflows**: State machines for complex operations (e.g., order fulfillment)
3. **Event Bus**: Redis-based for server-worker communication
4. **Split Deployments**: Server and Worker can scale independently
5. **File Module**: New provider system (not plugins anymore)

### Key Gotchas
- ❗ **Shadow Project**: Admin UI builds in `.medusa/server/` directory
- ❗ **Module vs Plugin**: v2 uses `modules` array, not `plugins`
- ❗ **Types**: Import from `@medusajs/types` (e.g., `HttpTypes.StoreProduct`)
- ❗ **File Storage**: Must use `@medusajs/medusa/file-s3` (not `@medusajs/file-s3`)
- ❗ **Publishable Keys**: Required for Store API access

### Working Configuration (Reference)
````typescript
// backend/medusa-config.ts
modules: [
  {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [{
        resolve: "@medusajs/medusa/file-s3",
        id: "s3",
        options: {
          file_url: "https://cdn.hylacviet.vn/medusa-media",
          access_key_id: process.env.S3_ACCESS_KEY_ID,
          secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
          region: "us-east-1",
          bucket: "medusa-media",
          endpoint: "http://minio:9000",
          additional_client_config: { forcePathStyle: true }
        }
      }]
    }
  }
]
````

---

## ✅ Completed Milestones

### Phase 1: Infrastructure Setup ✅
- [x] VPS provisioned and secured
- [x] Docker + Docker Compose installed
- [x] Traefik configured with SSL
- [x] PostgreSQL with production tuning (shared_buffers: 2GB)
- [x] Redis with AOF persistence
- [x] MinIO deployed and accessible via CDN
- [x] Network segmentation (public/internal)
- [x] Monitoring setup (Uptime Kuma)

### Phase 2: Backend Development ✅
- [x] MedusaJS v2 installed via `create-medusa-app`
- [x] Split architecture configured (server + worker)
- [x] Database migrations successful
- [x] Admin UI built and accessible
- [x] File upload to MinIO working
- [x] 5 products created with Vietnamese product data
- [x] Product images uploaded to CDN
- [x] Thumbnails assigned to products

### Phase 3: Storefront Development 🔄 IN PROGRESS
- [x] Next.js 15 starter template installed
- [x] "Modern Zen" design implemented (4-chapter narrative)
- [x] Docker multi-stage build configured
- [x] Traefik routing configured
- [ ] **BLOCKED**: Product detail page has syntax error
- [ ] Product images not displaying on frontend
- [ ] Checkout flow untested
- [ ] Payment integration pending

---

## 🎯 Next Steps (Priority Order)

### Immediate (Critical Path)
1. **Fix storefront syntax error** in `page.tsx` ⚠️ BLOCKING
2. Verify product images display on homepage
3. Test product detail pages load correctly
4. Verify CDN images render in browser

### Short Term (This Week)
1. Complete storefront visual QA
2. Test checkout flow end-to-end
3. Configure payment gateway (TBD: Stripe? VNPAY?)
4. Set up email notifications (SendGrid or similar)

### Medium Term (This Month)
1. Add Vietnamese localization
2. Implement search (consider MeiliSearch)
3. Add product filtering/sorting
4. Optimize for mobile devices
5. Performance testing and optimization

### Long Term (Future)
1. SEO optimization
2. Marketing integration (Google Analytics, Facebook Pixel)
3. Customer reviews/testimonials
4. Blog/content section
5. Email marketing automation

---

## 🛡️ Quality Gates & Constraints

### Must-Have Before Any Deployment
- [ ] Docker build succeeds without errors
- [ ] All containers report "healthy" status
- [ ] No TypeScript compilation errors
- [ ] No console errors in browser DevTools
- [ ] Images load from CDN (HTTP 200)
- [ ] Product pages render without crashes

### Code Quality Standards
- ✅ TypeScript strict mode
- ✅ Null-safety checks (use `?.` and `|| []`)
- ✅ Error boundaries for React components
- ✅ Proper HTTP error handling
- ✅ Descriptive Git commit messages

### Testing Requirements
- Manual testing before deploy (no automated tests yet)
- Verify on actual domain (not just localhost)
- Check both desktop and mobile viewports
- Test with real product data (not seed data)

---

## 🔑 Important Credentials & Keys

**Medusa Publishable Key**:  
`pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c`

**Admin User**:  
Email: `admin@hylacviet.vn` (password set during first setup)

**Domains**:
- Main Site: `hylacviet.vn`
- API: `api.hylacviet.vn`
- CDN: `cdn.hylacviet.vn`
- MinIO Console: `minio.hylacviet.vn`
- Monitoring: `kuma.hylacviet.vn`

---

## 📖 Decision Log (Why We Chose This Stack)

### Why MedusaJS v2?
- Modern headless commerce framework
- Great for custom storefronts (Mai Đỗ needs unique design)
- Strong API-first approach
- Active community and good documentation
- Open-source with commercial-friendly license

### Why Split Architecture?
- Prevents background jobs from blocking customer requests
- Better resource isolation (API vs workers)
- Easier to scale horizontally in future
- Production best practice from MedusaJS team

### Why MinIO Instead of AWS S3?
- No vendor lock-in (S3-compatible API)
- Lower cost for small catalogs
- Full control over data
- Easy migration path to AWS/Cloudflare R2 later
- Works well on single VPS

### Why Next.js 15?
- React Server Components for better performance
- Great TypeScript support
- Official Medusa storefront starter available
- App Router for modern routing patterns

### Why Docker Compose (not Kubernetes)?
- Appropriate scale for current needs (~10 products)
- Simpler operations for single developer
- Easy local development
- Can migrate to K8s later if needed

---

## 🚧 Known Limitations & Future Considerations

### Current Constraints
- **Single VPS**: No redundancy (but acceptable for MVP)
- **Manual Scaling**: Must resize VPS to scale vertically
- **No CDN Caching**: Using Cloudflare proxy but not optimized
- **No Automated Backups**: Backups are manual via scripts
- **No CI/CD**: Deployments are manual

### Technical Debt (Accept for Now)
- Storefront cache permission errors (non-blocking)
- No automated testing
- No staging environment
- Hard-coded environment variables in Dockerfile

### Migration Path (When Needed)
1. **CDN**: Move MinIO to Cloudflare R2 or AWS S3
2. **Database**: Migrate to managed PostgreSQL (AWS RDS, DO)
3. **Search**: Add MeiliSearch when catalog grows
4. **Hosting**: Move to Kubernetes (GKE, EKS) for multi-region
5. **CI/CD**: Set up GitHub Actions or GitLab CI

---

**Last Updated**: 2026-01-22  
**Current Commit**: 4acaaa8  
**Next Review**: After storefront fix deployed
