# 🤖 AI Agent Context: hylacviet.vn

## 📊 Project Status Dashboard

### ✅ Working Components
- **Backend API**: `api.hylacviet.vn` - MedusaJS v2 split architecture
- **Admin UI**: `api.hylacviet.vn/app` - Product management working
- **CDN**: `cdn.hylacviet.vn/medusa-media/` - MinIO S3-compatible storage
- **Database**: PostgreSQL with 5 products, thumbnails configured
- **Infrastructure**: Traefik, Redis, MinIO all healthy

### ❌ Broken Component
- **Storefront**: `hylacviet.vn` - Next.js build fails (syntax error)

---

## 🎯 Critical Issue: Storefront Build Error

### Problem Statement
Next.js 15.3.8 build fails with **syntax error** in product detail page after adding null-safety fix.

### Error Message
```
Error: x Expression expected
./src/app/[countryCode]/(main)/products/[handle]/page.tsx:71:1
   71 | }
      : ^
Caused by: Syntax Error
```

### Root Cause
- Original code: `product.images` could be undefined → runtime crash
- Fix attempt: Added `|| []` fallback for null-safety
- Result: Introduced syntax error (likely extra `}` closing brace)

### File to Fix
`storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`

**Function:** `getImagesForVariant` (lines 55-70)

---

## 🏗️ Technical Architecture

### Stack
- **Frontend**: Next.js 15 App Router + TypeScript + Tailwind
- **Backend**: MedusaJS v2 (Node.js, Express)
- **Database**: PostgreSQL 16
- **Storage**: MinIO (S3-compatible)
- **Proxy**: Traefik v2.11
- **Cache**: Redis 7

### API Integration
**Publishable Key**: `pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c`

**Sample API Response** (working correctly):
```json
{
  "title": "Áo Dài Cưới Hoàng Gia",
  "thumbnail": "https://cdn.hylacviet.vn/medusa-media/banner-...-01KFJSZJTPK0MBKWA7VPEMX8MX.png",
  "images": [
    {
      "id": "8mfgoh",
      "url": "https://cdn.hylacviet.vn/medusa-media/...",
      "rank": 0,
      "product_id": "prod_01KFJCZPVD0NQJ8WKR3RV4X61Q"
    }
  ]
}
```

---

## 🔧 Task for AI Agent

### Objective
Fix syntax error in `getImagesForVariant` function while maintaining null-safety.

### Requirements
1. ✅ Fix syntax error (likely extra closing brace)
2. ✅ Maintain `|| []` fallback for `product.images`
3. ✅ Maintain `?.` optional chaining for `variant.images?.length`
4. ✅ Keep TypeScript types: `HttpTypes.StoreProduct`
5. ✅ Ensure Docker build succeeds

### Expected Code (Reference)
```typescript
function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images || []
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images || []
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return (product.images || []).filter((i) => imageIdsMap.has(i.id))
}
```

### Testing Commands
```bash
# Build storefront
cd /opt/hylacviet/storefront
docker build \
  --build-arg MEDUSA_BACKEND_URL=https://api.hylacviet.vn \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c \
  --build-arg NEXT_PUBLIC_BASE_URL=https://hylacviet.vn \
  --build-arg NEXT_PUBLIC_DEFAULT_REGION=vn \
  -t hylacviet/storefront:latest .

# Expected output: "✓ Compiled successfully"

# Deploy
cd /opt/hylacviet
docker compose up -d storefront

# Verify
curl -I https://hylacviet.vn
docker compose logs storefront
```

---

## 📁 Project Structure
```
/opt/hylacviet/
├── backend/                    # MedusaJS v2 (✅ Working)
│   ├── src/
│   ├── medusa-config.ts
│   └── .env
├── storefront/                 # Next.js (❌ Broken)
│   ├── src/
│   │   ├── app/
│   │   │   └── [countryCode]/
│   │   │       └── (main)/
│   │   │           └── products/
│   │   │               └── [handle]/
│   │   │                   └── page.tsx  ⚠️ FIX HERE
│   │   └── modules/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.production
└── .github/
    └── AI_CONTEXT.md          # This file
```

---

## 💡 Development Notes

### Owner Preferences
- **Philosophy**: Quality over speed
- **Approach**: Production-ready solutions from day 1
- **Testing**: Always verify before deploying
- **Documentation**: Clear commit messages required

### Deployment Flow
1. Fix code locally
2. Test Docker build
3. Commit with descriptive message
4. Push to GitHub
5. Deploy to production VPS

### Important Files Changed Today
- `docker-compose.yml`: S3_FILE_URL now includes `/medusa-media`
- `backend/.env`: S3_FILE_URL updated
- `storefront/.../page.tsx`: Null-safety added (has syntax error)

---

## 🚦 Success Criteria

### Definition of Done
- [ ] Syntax error resolved in `page.tsx`
- [ ] Docker build completes without errors
- [ ] Storefront container starts and becomes healthy
- [ ] Product pages load at `https://hylacviet.vn/vn/products/*`
- [ ] Product images display from CDN
- [ ] No console errors in browser DevTools

### Verification Steps
```bash
# 1. Build succeeds
docker build storefront/ -t test:latest

# 2. Container healthy
docker compose ps storefront
# Expected: STATUS = Up (healthy)

# 3. Images load
curl -I https://cdn.hylacviet.vn/medusa-media/banner-quang-cao-my-pham-cho-nu-gioi_083548160-01KFJSZJTPK0MBKWA7VPEMX8MX.png
# Expected: HTTP/2 200

# 4. Page accessible
curl -I https://hylacviet.vn/vn/products/ao-dai-cuoi-hoang-gia
# Expected: HTTP/2 200 (not 500)
```

---

## 📚 Additional Context

### Why This Architecture?
- **Split Architecture**: Isolates API traffic from background jobs
- **MinIO**: S3-compatible storage ready for AWS migration
- **Traefik**: Automatic SSL, easy routing
- **Docker**: Consistent environments, easy scaling

### Key Decisions Made
1. Chose MedusaJS v2 for modern commerce features
2. Split server/worker for stability under load
3. MinIO for cloud-agnostic object storage
4. Next.js 15 for modern React patterns

### Related Documentation
- MedusaJS v2 Docs: https://docs.medusajs.com/v2
- Next.js App Router: https://nextjs.org/docs/app
- MinIO S3 API: https://min.io/docs/minio/linux/developers/

---

**Last Updated**: 2026-01-22  
**Git Commit**: 4988ee9  
**VPS**: Hostinger Ubuntu 24.04, 4GB RAM  
**Deployment**: Docker Compose orchestration
