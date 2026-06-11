---
title: "Ước lượng thời gian"
description: "Cách estimate task chính xác hơn và tránh các bẫy phổ biến"
order: 3
---

# Ước lượng thời gian (Estimation)

Developer nổi tiếng là estimate sai. Đây là cách làm tốt hơn.

## Tại sao estimate luôn sai?

**Planning Fallacy** (Kahneman): Não người tự nhiên optimistic về thời gian.

Thêm vào đó:
- Không tính unknown unknowns
- Quên meetings, reviews, context switching
- "It's just a small change" — không bao giờ nhỏ

## Quy tắc x3

Estimate của bạn × 3 = thực tế.

Nghe vô lý nhưng đúng với hầu hết developer junior/mid.

## Story Points thay vì giờ

Dùng relative sizing (1, 2, 3, 5, 8, 13) thay vì giờ cụ thể:
- **1 point**: Task rõ ràng, đã làm nhiều lần
- **3 points**: Quen thuộc nhưng có vài unknowns
- **8 points**: Phức tạp, cần research
- **13 points**: Quá lớn, cần break down

## Buffer time

Luôn thêm 20-30% buffer cho:
- Code review feedback
- Bug fixes từ QA
- Deploy issues
- Meetings không lên kế hoạch
