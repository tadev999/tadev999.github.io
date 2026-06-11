---
title: Scrum Board & Issue Management - Quy trình chuẩn cho team Agile
author: TaDev
pubDatetime: 2023-11-15T10:00:00Z
featured: false
draft: false
tags:
  - scrum
  - agile
  - project-management
  - jira
  - sop
description: Hướng dẫn chi tiết cách quản lý Scrum Board và tạo issues trong Jira - từ Story, Task, Bug đến Improvement. Áp dụng ngay cho team của bạn!
---

Bạn có bao giờ thấy Jira board của team mình loạn như canh hẹ không? Story thì không rõ ràng, Task thì thiếu acceptance criteria, Bug thì không biết reproduce thế nào? Nếu có, thì bài này dành cho bạn!

Đây là một SOP (Standard Operating Procedure) mà mình đã áp dụng cho nhiều team, giúp việc quản lý backlog và sprint trở nên rõ ràng và nhất quán hơn rất nhiều.

![Scrum Board](https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80)
*Scrum Board được quản lý tốt = Team làm việc hiệu quả*

## Table of contents

## 1. Mục đích

SOP này định nghĩa các quy trình chuẩn để:

- Quản lý Product Backlog Items (PBIs)
- Sử dụng Scrum Board hiệu quả
- Tạo issues trong Jira một cách nhất quán

Đảm bảo sự rõ ràng và nhất quán giữa các team: Product, Dev, QA, và UX.

## 2. Áp dụng cho ai?

SOP này dành cho:

- ✅ Product Owner (PO)
- ✅ Developers (Frontend, Backend, Mobile)
- ✅ QA Engineers
- ✅ Designers (UX/UI)

## 3. Định nghĩa các thuật ngữ

Trước khi đi vào chi tiết, hãy hiểu rõ các thuật ngữ:

- **PBI (Product Backlog Item)**: Bất kỳ đơn vị công việc nào trong backlog (Story, Task, Bug, Improvement, Spike)
- **Sprint**: Một chu kỳ làm việc có thời gian cố định (thường 1-2 tuần)
- **Backlog**: Danh sách các PBIs được ưu tiên nhưng chưa được đưa vào sprint

## 4. Hướng dẫn tạo PBI (QUAN TRỌNG!)

### 4.1 Quy tắc chung cho mọi PBI

Mỗi PBI **BẮT BUỘC** phải có:

- ✅ **Title** (rõ ràng và có cấu trúc)
- ✅ **Context / Goal** (Tại sao cần làm?)
- ✅ **Scope** (Làm những gì?)
- ✅ **Acceptance Criteria** (Làm sao biết đã xong?)
- ✅ **Labels** (Để dễ filter và tìm kiếm)
- ✅ **Assignee** (Nếu đã biết ai làm)

![Issue Types](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80)
*Mỗi loại issue có mục đích sử dụng riêng*

### 4.2 Khi nào dùng loại issue nào?

| Issue Type | Khi nào dùng |
|------------|--------------|
| **Epic** | Nhóm nhiều PBIs thành một feature lớn |
| **Story** | Tính năng hướng đến người dùng |
| **Task** | Công việc kỹ thuật (technical implementation) |
| **Bug** | Lỗi hoặc hành vi không mong muốn |
| **Improvement** | Cải thiện UX/UI hoặc performance |
| **Spike** | Nghiên cứu hoặc điều tra kỹ thuật |

### 4.3 Story - Dành cho Product Owner

**Dùng khi:** Tính năng hướng đến người dùng

**Template:**

```markdown
Title: [Feature] User can login

Description:
As a user,
I want to log in,
So that I can access my account

Context:
Giải thích tại sao cần tính năng này

Scope:
- Màn hình login
- Logic validation
- Xử lý lỗi

Acceptance Criteria:
- User có thể nhập email/password
- Login thành công sẽ redirect đến dashboard
- Hiển thị error message nếu thông tin sai

Labels: frontend, backend
```

**👉 Quy tắc:**

- Phải mô tả giá trị cho người dùng
- Phải có acceptance criteria rõ ràng
- PO chịu trách nhiệm tạo Stories

### 4.4 Task - Dành cho Developers

**Dùng khi:** Công việc kỹ thuật (không trực tiếp hướng đến user)

**Template:**

```markdown
Title: [API] Create login endpoint

Description:
Context:
Implement backend API cho login

Scope:
- Tạo POST /login
- Validate input
- Return JWT

Technical Notes:
- Sử dụng auth service hiện có

Acceptance Criteria:
- API trả về 200 khi thành công
- API trả về 401 khi thất bại

Labels: backend, api
```

**👉 Quy tắc:**

- Được tạo từ Story hoặc cho công việc nội bộ
- Phải cụ thể và có thể thực hiện được

### 4.5 Bug - Dành cho QA / Team

**Template:**

```markdown
Title: [Bug] App crash khi login

Context:
App bị crash khi user nhập sai password

Steps to Reproduce:
1. Mở app
2. Nhập sai password
3. Submit

Expected Result:
App hiển thị error message

Actual Result:
App bị crash

Environment:
iOS 17 / iPhone 14 Pro

Labels: mobile, critical
```

**👉 Quy tắc:**

- Phải có các bước reproduce rõ ràng
- Phải định nghĩa rõ Expected vs Actual

![Bug Tracking](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)
*Bug tracking hiệu quả giúp team fix lỗi nhanh hơn*

### 4.6 Improvement - Dành cho UX / PO / Team

**Template:**

```markdown
Title: [UX] Nút bấm khó nhìn trên Home screen

Context:
Users khó nhận ra nút primary button

Problem:
Màu nút thiếu contrast

Suggestion:
- Tăng contrast
- Dùng màu primary

Impact:
Cải thiện usability và conversion rate

Acceptance Criteria:
- Nút đạt chuẩn accessibility contrast
- Rõ ràng trên mọi thiết bị

Labels: ux, ui
```

**👉 Quy tắc:**

- Tập trung vào cải thiện trải nghiệm hiện có
- Phải mô tả vấn đề + impact

### 4.7 Spike - Dành cho Research

**Template:**

```markdown
Title: [Spike] Research performance tracking

Goal:
Tìm phương pháp đo screen load time

Scope:
- Đánh giá các tools
- So sánh approaches

Output:
- Recommendation
- Implementation plan

Time-box: 2 days

Labels: research, spike
```

**👉 Quy tắc:**

- Phải có output rõ ràng
- Phải có time-box (giới hạn thời gian)

## 5. Sử dụng Scrum Board

### 5.1 Quy tắc vàng: Backlog vs Sprint

**QUAN TRỌNG:**

- ❌ Issues trong **Backlog** KHÔNG được update status
- ✅ Chỉ issues trong **Active Sprint** mới được thay đổi status

### 5.2 Sprint Flow

```
Backlog → Sprint Planning → Active Sprint → Review → Close
```

### 5.3 Workflow Status

Các status chuẩn trong một sprint:

1. **Backlog** - Chưa được chọn vào sprint
2. **Selected** - Đã chọn cho sprint
3. **In Progress** - Đang làm
4. **Resolve** - Dev đã xong
5. **In Review** - Đang review/QA
6. **Done** - Hoàn thành

### 5.4 Daily Operations

Mỗi ngày, team members cần:

- ✅ Move issue sang **In Progress** khi bắt đầu làm
- ✅ Move sang **Resolve** khi dev xong
- ✅ Move sang **In Review** để QA/Review
- ✅ Move sang **Done** sau khi validate xong

### 5.5 WIP Limit

**Work In Progress Limit:**

- Max **1-2 issues** đang làm cùng lúc mỗi người
- Giúp tập trung và hoàn thành nhanh hơn

![Sprint Board](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80)
*Sprint board với WIP limit giúp team focus hơn*

## 6. Definition of Done (DoD)

Một issue được coi là **Done** khi:

- ✅ Code hoàn thành
- ✅ Code đã được review
- ✅ QA đã pass
- ✅ Không có critical bugs
- ✅ Đã deploy (nếu cần)

## 7. Backlog Grooming

PO + team thực hiện định kỳ:

- Làm rõ requirements
- Thêm acceptance criteria
- Gán labels
- Estimate effort

**Tần suất:** 1-2 lần/sprint

## 8. Sprint Commitment

- ✅ Team commit trong Sprint Planning
- ❌ Không thêm issues mới sau khi sprint bắt đầu
- ⚠️ Ngoại lệ: Chỉ critical bugs

## 9. GitHub Integration (Recommended)

### Branch naming

Sử dụng Jira Issue ID trong tên branch:

```bash
# Format: [ISSUE-ID]-[description]
FE-123-login-api
BE-456-user-service
```

### Pull Request

- Link PR với Jira issue
- Đảm bảo traceability giữa code và task

## 10. Vai trò & Trách nhiệm

### Product Owner (PO)

- Tạo và ưu tiên Stories
- Định nghĩa acceptance criteria
- Đảm bảo backlog sẵn sàng

### Developers

- Tạo Tasks
- Update status hàng ngày
- Follow workflow

### QA

- Tạo Bugs
- Validate issues
- Đảm bảo quality trước khi Done

### UX/Design

- Tạo Improvements
- Provide UX recommendations

## 11. Kết quả mong đợi

Khi áp dụng SOP này, team sẽ có:

- ✅ Backlog rõ ràng và có cấu trúc
- ✅ Issues được tạo nhất quán
- ✅ Sprint execution minh bạch
- ✅ Collaboration tốt hơn giữa các teams

![Team Collaboration](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80)
*Team làm việc hiệu quả hơn với quy trình rõ ràng*

## Kết luận

SOP này có vẻ dài và chi tiết, nhưng tin mình đi, khi team đã quen thì mọi thứ sẽ trở nên tự nhiên. Điều quan trọng là:

1. **Consistency** - Mọi người làm theo cùng một cách
2. **Clarity** - Issues rõ ràng, dễ hiểu
3. **Traceability** - Dễ dàng track công việc

Một vài tips cuối:

- 📌 In SOP này ra và dán lên tường (hoặc share link cho team)
- 📌 Review lại SOP trong retrospective
- 📌 Điều chỉnh cho phù hợp với context của team
- 📌 Đừng quá cứng nhắc - SOP là để giúp đỡ, không phải để gò bó

Chúc team bạn làm việc hiệu quả! Nếu có câu hỏi hoặc muốn chia sẻ kinh nghiệm, cứ comment bên dưới nhé! 🚀

---

*Bài viết được viết dựa trên kinh nghiệm thực tế quản lý nhiều Scrum teams. Nếu thấy hữu ích, đừng quên chia sẻ cho team nhé!*
