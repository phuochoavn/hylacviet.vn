# 🔧 Task: Fix Storefront Build Syntax Error

## Problem
Next.js build fails with syntax error on line 71 of `page.tsx` after attempting to add null-safety to `getImagesForVariant` function.

## Steps to Reproduce
1. Navigate to `storefront/` directory
2. Run `docker build` with proper build args
3. Build fails at compilation stage

## Expected Behavior
- Build completes successfully
- Function handles undefined `product.images` gracefully
- No runtime errors when accessing product detail pages

## Files to Modify
- `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`

## Testing Checklist
- [ ] TypeScript compilation succeeds
- [ ] Next.js build completes without errors
- [ ] Docker image builds successfully
- [ ] Product pages load without errors
- [ ] Images display correctly on storefront

## Priority
🔴 **HIGH** - Blocks production deployment
