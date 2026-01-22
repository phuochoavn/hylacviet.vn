# AI Agent Context: hylacviet.vn E-commerce Project

## 🎯 Project Overview
**Brand**: Mai Đỗ - Traditional Vietnamese Áo Dài & Ceremonial Clothing  
**Domain**: hylacviet.vn  
**Philosophy**: Quality over speed - Always choose production-ready solutions  
**Catalog Size**: ~10 premium products

## 🏗️ Architecture (Golden Stack - Production Ready)

### Infrastructure (✅ Working)
- **VPS**: Hostinger KVM1, Ubuntu 24.04, 4GB RAM
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Traefik v2.11 with Let's Encrypt SSL
- **Database**: PostgreSQL 16 (tuned for production)
- **Cache**: Redis 7 with AOF persistence
- **Storage**: MinIO (S3-compatible) at `cdn.hylacviet.vn/medusa-media/`
- **Monitoring**: Uptime Kuma at `kuma.hylacviet.vn`

### Backend (✅ Working)
- **Framework**: MedusaJS v2
- **Architecture**: Split mode (separate server + worker containers)
- **API Endpoint**: `api.hylacviet.vn`
- **Admin UI**: `api.hylacviet.vn/app`
- **File Upload**: Configured with `@medusajs/medusa/file-s3` module
- **Publishable Key**: `pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c`

### Storefront (❌ BROKEN - NEEDS FIX)
- **Framework**: Next.js 15.3.8
- **Domain**: `hylacviet.vn`
- **Design**: "Modern Zen" with Vietnamese aesthetics
- **Issue**: Build fails with syntax error after null-safety fix

## 🐛 CURRENT PROBLEM

### Error Details
```
Error: x Expression expected
./src/app/[countryCode]/(main)/products/[handle]/page.tsx:71:1
```

### Root Cause
Attempted to fix `TypeError: Cannot read properties of undefined (reading 'images')` by adding null-safety to `getImagesForVariant` function, but introduced **syntax error** - likely extra closing brace.

### File Affected
`storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`

### What Was Changed
```typescript
// Original code had no null-safety:
return product.images  // ❌ Crashes if undefined

// Attempted fix:
return product.images || []  // ✅ Safe, but has syntax error
```

### API Response (Reference)
Products API correctly returns images array:
```json
{
  "title": "Áo Dài Cưới Hoàng Gia",
  "thumbnail": "https://cdn.hylacviet.vn/medusa-media/banner-...-01KFJSZJTPK0MBKWA7VPEMX8MX.png",
  "images": [
    {
      "id": "8mfgoh",
      "url": "https://cdn.hylacviet.vn/medusa-media/...",
      "rank": 0
    }
  ]
}
```

## 🎯 TASK FOR AI AGENT

### Primary Goal
Fix the syntax error in `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx` to enable successful Next.js build.

### Requirements
1. ✅ Maintain null-safety for `product.images` (add `|| []` fallback)
2. ✅ Maintain null-safety for `variant.images?.length` (optional chaining)
3. ✅ Ensure no extra closing braces or syntax errors
4. ✅ Keep TypeScript types intact (`HttpTypes.StoreProduct`)
5. ✅ Test that build completes without errors

### Success Criteria
```bash
# Build must succeed:
docker build \
  --build-arg MEDUSA_BACKEND_URL=https://api.hylacviet.vn \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c \
  --build-arg NEXT_PUBLIC_BASE_URL=https://hylacviet.vn \
  --build-arg NEXT_PUBLIC_DEFAULT_REGION=vn \
  -t hylacviet/storefront:latest \
  storefront/

# Should output: "✓ Compiled successfully"
```

### Expected Function After Fix
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

## 📁 Key Files Reference

### Docker Compose
`/opt/hylacviet/docker-compose.yml` - Orchestrates all services

### Environment Variables
- Backend: `/opt/hylacviet/backend/.env`
- Root: `/opt/hylacviet/.env.production`
- Storefront: `/opt/hylacviet/storefront/.env.local`

### Storefront Structure
```
storefront/
├── src/
│   ├── app/
│   │   └── [countryCode]/
│   │       └── (main)/
│   │           └── products/
│   │               └── [handle]/
│   │                   └── page.tsx ⚠️ FIX THIS FILE
│   └── modules/
│       └── products/
│           └── components/
│               └── image-gallery/
│                   └── index.tsx
├── Dockerfile
└── package.json
```

## 🚀 Deployment Process After Fix
```bash
# 1. Rebuild image
cd /opt/hylacviet/storefront
docker build -t hylacviet/storefront:latest \
  --build-arg MEDUSA_BACKEND_URL=https://api.hylacviet.vn \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c \
  --build-arg NEXT_PUBLIC_BASE_URL=https://hylacviet.vn \
  --build-arg NEXT_PUBLIC_DEFAULT_REGION=vn \
  .

# 2. Deploy
cd /opt/hylacviet
docker compose up -d storefront

# 3. Verify
docker compose ps storefront
docker compose logs storefront
```

## 💡 Notes for AI Agent
- Owner prefers **correct solutions** over quick fixes
- Always test builds before committing
- Follow TypeScript best practices
- Maintain null-safety throughout codebase
- Document changes in commit messages
