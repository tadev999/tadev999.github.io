---
title: "Git Workflow thực chiến"
description: "Từ commit message đến branching strategy — Git workflow cho team hiện đại."
order: 4
icon: "🌿"
---

# Git Workflow thực chiến

Git là công cụ mọi developer dùng hàng ngày, nhưng ít người dùng đúng cách.

## Trong series này

- Conventional Commits — viết commit message có ý nghĩa
- Branching strategies — Git Flow vs Trunk-based
- Code review best practices
- Xử lý conflict và rebase

## Tại sao Git workflow quan trọng?

Git history tốt = **documentation miễn phí** cho codebase của bạn.

```bash
git log --oneline
# feat: add user authentication
# fix: resolve race condition in payment flow  
# docs: update API reference
# refactor: extract validation logic to separate module
```

Nhìn vào đây, bất kỳ developer nào cũng hiểu project đang ở đâu.
