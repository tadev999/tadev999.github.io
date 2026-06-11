---
title: "Branching Strategy"
description: "Git Flow vs Trunk-based Development — chọn cái nào?"
order: 3
---

# Branching Strategy

## Git Flow

Phù hợp cho sản phẩm có versioned releases (mobile app, library).

```
main ──────────────────────────────────► production
         ↑                    ↑
develop ─┼────────────────────┼──────►
         ↓                    ↑
      feature/xxx ────────────┘
```

**Nhược điểm**: Phức tạp, merge conflicts nhiều, slow feedback loop.

## Trunk-based Development

Phù hợp cho web app với continuous deployment.

```
main ──────────────────────────────────► production
      ↑    ↑    ↑    ↑
   feat  feat  fix  feat  (short-lived branches, < 1 day)
```

**Ưu điểm**: Simple, fast, ít conflicts, CI/CD friendly.

## Recommendation

- **Web app / SaaS**: Trunk-based + feature flags
- **Mobile / Library**: Git Flow hoặc GitHub Flow
- **Solo project**: Trunk-based, commit thẳng vào main

## Feature Flags

Với trunk-based, dùng feature flags để ship code chưa ready:

```typescript
if (featureFlags.isEnabled('new-checkout')) {
  return <NewCheckout />;
}
return <OldCheckout />;
```
