---
title: "Conventional Commits"
description: "Chuẩn hóa commit message với Conventional Commits specification"
order: 2
---

# Conventional Commits

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types

| Type | Khi nào dùng |
|------|-------------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `docs` | Chỉ thay đổi documentation |
| `style` | Format, whitespace (không đổi logic) |
| `refactor` | Refactor code (không feat, không fix) |
| `test` | Thêm hoặc sửa tests |
| `chore` | Build process, dependencies |

## Ví dụ thực tế

```bash
feat(auth): add Google OAuth login
fix(payment): handle timeout in Stripe webhook
docs(api): add rate limiting documentation
refactor(user): extract profile validation to service layer
```

## Tự động hóa với commitlint

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

Kết hợp với Husky để enforce trên mọi commit.
