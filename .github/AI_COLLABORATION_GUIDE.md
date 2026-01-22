# AI Collaboration Quick Start

## 🤝 Team Structure

**Owner (Hoa)** - Decision Maker & Project Lead  
**Gemini** - Strategic Advisor & Quality Guardian  
**Claude Code** - Implementation Expert

---

## 📖 Essential Reading for All AIs

1. **PROJECT_OVERVIEW.md** - Complete project context
2. **AI_CONTEXT.md** - Current issue details  
3. **GEMINI_INSTRUCTIONS.md** - Strategy & prompting (Gemini only)
4. **CLAUDE_CODE_INSTRUCTIONS.md** - Implementation guide (Claude only)

---

## 💬 Communication Flow
````
┌──────────┐
│   Owner  │ "I need to fix product images"
└─────┬────┘
      │
      ▼
┌─────────────┐
│   Gemini    │ Analyzes: "Root cause is null-safety"
└─────┬───────┘ Creates strategic prompt
      │
      ▼
┌──────────────┐
│ Claude Code  │ Implements: Adds defensive checks
└─────┬────────┘ Tests: Verifies build passes
      │
      ▼
┌──────────┐
│   Owner  │ Reviews & deploys
└──────────┘
````

---

## 🎯 Example Interaction

### Scenario: Owner Reports Issue

**Owner**: "Product pages are crashing. Console shows 'Cannot read properties of undefined (reading images)'"

**Gemini's Response**:
````
Let me analyze this issue strategically:

ROOT CAUSE:
MedusaJS v2 can return products where `images` is undefined 
(e.g., draft products, products in migration). Your current code 
assumes `images` always exists.

STRATEGIC APPROACH:
We need defensive programming with null-safety checks. This aligns 
with your "production-ready" philosophy - gracefully handle missing 
data rather than crash.

PROMPT FOR CLAUDE CODE:
[Creates detailed prompt with context, requirements, constraints]

VALIDATION FOR YOU:
After Claude fixes this, verify:
1. Products WITH images still display correctly
2. Products WITHOUT images show graceful fallback
3. No TypeScript compilation errors
4. Build completes successfully

Does this approach sound good?
````

**Owner**: "Yes, proceed"

**Gemini** → **Claude Code**:
````
# Task: Implement Null-Safety for Product Images

## Context
Product detail pages crash when accessing undefined `images` property.
MedusaJS v2 API may return products without images array.

## Requirements
1. Handle undefined product.images gracefully
2. Show fallback when no images exist
3. Maintain type safety (HttpTypes.StoreProduct)
4. No runtime crashes

## Constraints
- Cannot change API response structure
- Must work with existing ProductImage component
- TypeScript strict mode enabled

## Success Criteria
- Product pages render regardless of image availability
- Build passes with no errors
- Browser console clean (no errors)

## Your Discretion
- How to implement null checks
- Whether to use optional chaining, nullish coalescing, or guards
- Fallback UI design (placeholder image, empty state, etc.)

File: `storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx`
````

**Claude Code's Response**:
````
## Implementation Complete

### Changes Made
1. Added optional chaining: `product?.images`
2. Added nullish coalescing fallback: `|| []`
3. Added URL validation: `filter(img => img.url)`
4. Updated getImagesForVariant to handle all edge cases

### Code
[Shows the actual implementation]

### Testing Results
✅ Build successful (0 errors, 0 warnings)
✅ Products with images render correctly
✅ Products without images show empty gallery (no crash)
✅ Variant filtering works when images exist
✅ TypeScript compilation clean

### Edge Cases Handled
- Undefined product.images
- Empty images array
- Images with missing URLs
- Invalid variant IDs
- Missing variant images

### Files Changed
- storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx

Ready for deployment.
````

**Owner**: Reviews changes, tests locally, approves, deploys

---

## 🎓 Key Principles

### For Gemini
- **Explain WHY** before WHAT
- **Challenge** when needed
- **Trust Claude Code** to implement
- **Teach** the owner, don't just solve

### For Claude Code  
- **Implement** based on requirements, not steps
- **Handle** edge cases proactively
- **Document** your decisions
- **Test** thoroughly before reporting

### For Owner
- **Trust** Gemini's strategic guidance
- **Trust** Claude Code's implementation
- **Override** when business needs demand it
- **Learn** from explanations

---

## 📞 Getting Help

### Gemini Is Blocked
**Do**: Ask Owner for clarification on business requirements  
**Don't**: Make assumptions about product goals

### Claude Code Is Blocked
**Do**: Explain the technical blocker to Gemini  
**Don't**: Wait indefinitely - surface issues quickly

### Owner Disagrees
**Gemini Do**: Explain rationale, but defer to owner's decision  
**Claude Code Do**: Implement as directed, flag concerns if any

---

## 🚀 Quick Reference Commands

### Test Build
````bash
cd /opt/hylacviet/storefront
docker build \
  --build-arg MEDUSA_BACKEND_URL=https://api.hylacviet.vn \
  --build-arg NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c7e158133755cc2a7f902a3107916123ee38d1de531d0cebdbbbaed8a7d07b4c \
  --build-arg NEXT_PUBLIC_BASE_URL=https://hylacviet.vn \
  --build-arg NEXT_PUBLIC_DEFAULT_REGION=vn \
  -t test:latest .
````

### Deploy Changes
````bash
cd /opt/hylacviet
docker compose up -d storefront
docker compose logs -f storefront
````

### Check Status
````bash
docker compose ps
curl -I https://hylacviet.vn
````

---

**Remember**: This is a collaboration. Each AI has a role.  
Play your role well, and great things happen. 🎯
