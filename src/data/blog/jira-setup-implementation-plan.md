---
title: JIRA Setup & Implementation Plan - Thiết lập Jira từ đầu cho team mới
author: TaDev
pubDatetime: 2023-10-20T09:00:00Z
featured: false
draft: false
tags:
  - jira
  - project-management
  - agile
  - setup
description: Hướng dẫn chi tiết cách setup Jira từ đầu cho team mới - từ tạo project, config workflow, đến integration với GitHub. Áp dụng ngay!
---

Bạn vừa được giao nhiệm vụ setup Jira cho team mới? Hoặc team đang dùng Jira nhưng cảm giác nó... loạn lắm? Bài này sẽ hướng dẫn bạn setup Jira một cách có hệ thống và scalable.

Đây là implementation plan mà mình đã áp dụng cho nhiều teams, từ startup nhỏ đến công ty lớn. Đi thôi!

![Jira Setup](https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80)
*Setup Jira đúng cách ngay từ đầu sẽ giúp team làm việc hiệu quả hơn rất nhiều*

## Table of contents

## Mục tiêu

Xây dựng một hệ thống Jira có cấu trúc và scalable để đảm bảo:

- ✅ Quản lý tasks hiệu quả
- ✅ Ownership rõ ràng
- ✅ Visibility đầy đủ cho Development, QA, và UX
- ✅ Dễ dàng tracking và reporting

## 1. Project Setup

### 1.1 Tạo Project

Trong Jira, chọn **Create Project**:

- **Project type:** Scrum hoặc Kanban (tùy team)
- **Project name:** Tên rõ ràng (ví dụ: "Mobile App", "Web Platform")
- **Project key:** Viết tắt ngắn gọn (ví dụ: "MOB", "WEB")

### 1.2 Access Management

Cấu hình quyền truy cập:

- **Admins:** PO, Scrum Master, Tech Lead
- **Members:** Developers, QA, Designers
- **Viewers:** Stakeholders (chỉ xem, không edit)

**Tip:** Đừng cho quá nhiều người quyền admin, dễ loạn!

![Project Management](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80)
*Phân quyền rõ ràng giúp tránh chaos*

## 2. Issue Type Configuration

Để duy trì sự rõ ràng, sử dụng các issue types sau:

| Issue Type | Mục đích sử dụng |
|------------|------------------|
| **Epic** | Features lớn (ví dụ: Onboarding, Chatbot) |
| **Story** | User-facing features |
| **Task** | Technical implementation hoặc backend work |
| **Bug** | Báo cáo lỗi và system issues |
| **Improvement** | UX/UI enhancements và performance optimizations |
| **Spike** | Research, investigation, feasibility studies |

### Khi nào dùng gì?

- **Epic:** "User Onboarding Flow" (nhóm nhiều stories)
- **Story:** "User can sign up with email"
- **Task:** "Create user registration API"
- **Bug:** "App crashes on signup"
- **Improvement:** "Improve button contrast on signup screen"
- **Spike:** "Research best authentication method"

## 3. Workflow Design

Lifecycle của một task sẽ follow pipeline này:

```
TODO (Backlog) 
  ↓
Selected for Development
  ↓
In Progress
  ↓
Resolve
  ↓
In Review
  ↓
Done
```

### Giải thích các status:

- **TODO (Backlog):** Chưa được chọn vào sprint
- **Selected:** Đã chọn cho sprint hiện tại
- **In Progress:** Đang làm
- **Resolve:** Dev đã xong, chờ review
- **In Review:** Đang QA/Code review
- **Done:** Hoàn thành và deployed

## 4. Field & Data Structure Setup

Để đảm bảo data consistency và reporting tốt, mỗi ticket **BẮT BUỘC** phải có:

### Required Fields:

- ✅ **Assignee:** Người chịu trách nhiệm
- ✅ **Priority:** Low / Medium / High / Critical
- ✅ **Component:** Frontend / Backend / iOS / Design / QA
- ✅ **Description:** Chi tiết theo template chuẩn

### Optional but Recommended:

- **Story Points:** Để estimate effort
- **Sprint:** Sprint nào sẽ làm
- **Due Date:** Deadline (nếu có)

![Data Structure](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)
*Data structure tốt = Reporting dễ dàng*

## 5. Components & Labels

### Components (Theo team/department):

- `Frontend`
- `Backend`
- `iOS`
- `Android`
- `Design`
- `QA`

### Labels (Theo feature/topic):

- `onboarding`
- `chatbot`
- `paywall`
- `ui-ux`
- `performance`
- `security`
- `api`

**Sự khác biệt:**
- **Component:** Ai làm? (team nào)
- **Label:** Liên quan đến gì? (feature/topic gì)

## 6. Issue Creation Templates

### 🟢 Story Template

```markdown
Title: [Feature] User can login

Description:
As a user,
I want to login,
So that I can access my account.

Acceptance Criteria:
- User enters email/password
- Successful login redirects to dashboard
- Display error if credentials are incorrect

Labels: frontend, backend
Component: Frontend
```

### 🟡 Task Template

```markdown
Title: [API] Create login endpoint

Description:
Create API POST /login
- Validate input
- Return JWT

Technical Notes:
- Use existing auth service
- Follow REST API conventions

Labels: backend, api
Component: Backend
```

### 🔴 Bug Template

```markdown
Title: [Bug] App crash during login

Steps to Reproduce:
1. Open app
2. Enter wrong password
3. Click submit
4. App crashes

Expected: Should show error message
Actual: App terminates unexpectedly

Environment: iOS 17, iPhone 14 Pro

Labels: mobile, critical
Component: iOS
```

### 🟣 Spike Template

```markdown
Title: [Spike] Research app performance tracking

Goal:
Find ways to measure screen load time

Scope:
- Evaluate available tools
- Compare approaches
- Estimate implementation effort

Output:
- Tool recommendations
- Implementation plan

Time-box: 2 days

Labels: research, performance
```

### 🟠 Improvement Template

```markdown
Title: [UX] Low button visibility on Home screen

Problem:
Button color is too pale; hard for users to see

Suggestion:
- Increase contrast
- Change to primary color

Impact:
Improve conversion rate and user experience

Labels: ux, ui
Component: Design
```

## 7. Ticket Template Standardization

Mỗi ticket nên cover:

1. **Context / Goal:** Tại sao cần làm?
2. **Scope:** Làm những gì?
3. **Technical Notes:** (Optional) Chi tiết kỹ thuật
4. **Acceptance Criteria:** Làm sao biết đã xong?
5. **Test Steps:** (Optional) Cách test

**Template tổng quát:**

```markdown
## Context
[Giải thích background và tại sao cần làm]

## Goal
[Mục tiêu cần đạt được]

## Scope
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Technical Notes (Optional)
[Chi tiết kỹ thuật, constraints, dependencies]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Test Steps (Optional)
1. Step 1
2. Step 2
3. Expected result
```

![GitHub Integration](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80)
*Integration với GitHub giúp track code changes dễ dàng*

## 8. GitHub Integration

### 8.1 Setup Integration

1. Trong Jira: **Settings → Apps → Find new apps**
2. Tìm và cài "GitHub for Jira"
3. Connect với GitHub organization

### 8.2 Branch Naming Convention

Enforce convention sử dụng Jira ticket ID:

```bash
# Format: [TICKET-ID]-[short-description]
MOB-123-login-api
WEB-456-user-profile
MOB-789-fix-crash
```

### 8.3 Commit Message Convention

```bash
git commit -m "MOB-123: Implement login API endpoint"
```

### 8.4 Pull Request Linking

Trong PR description, thêm:

```markdown
Jira: MOB-123

## Changes
- Implemented login API
- Added validation
- Added tests

## Testing
- Unit tests passed
- Manual testing completed
```

Jira sẽ tự động link PR với ticket!

## 9. SOP (Standard Operating Procedure)

Sau khi setup xong, tạo SOP document để:

- ✅ Hướng dẫn team cách sử dụng
- ✅ Định nghĩa quy trình làm việc
- ✅ Standardize cách tạo tickets

**Tham khảo:** [Scrum Board & Issue Management SOP](/posts/scrum-board-issue-management-sop)

## 10. Training & Rollout

### Phase 1: Pilot (1 sprint)

- Chọn 1-2 team members làm pilot
- Thu thập feedback
- Điều chỉnh nếu cần

### Phase 2: Team Rollout

- Training session cho toàn team (1-2 giờ)
- Share SOP document
- Assign "Jira Champions" để support team

### Phase 3: Monitor & Improve

- Review sau mỗi sprint
- Thu thập feedback trong retrospective
- Continuous improvement

![Team Training](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80)
*Training team là bước quan trọng để adoption thành công*

## Checklist trước khi Go-Live

- [ ] Project đã được tạo và config
- [ ] Issue types đã được setup
- [ ] Workflow đã được customize
- [ ] Components và Labels đã được define
- [ ] Templates đã được tạo
- [ ] GitHub integration đã được setup
- [ ] SOP document đã được viết
- [ ] Team đã được training
- [ ] Pilot sprint đã hoàn thành

## Kết luận

Setup Jira đúng cách ngay từ đầu sẽ giúp team tiết kiệm rất nhiều thời gian và công sức sau này. Những điểm quan trọng cần nhớ:

1. **Consistency is key** - Mọi người phải follow cùng một convention
2. **Keep it simple** - Đừng over-complicate
3. **Document everything** - SOP là must-have
4. **Train your team** - Đầu tư thời gian training sẽ pay off
5. **Iterate and improve** - Không có setup nào perfect ngay từ đầu

Chúc bạn setup Jira thành công! Nếu có câu hỏi, cứ comment bên dưới nhé! 🚀

---

*Bài viết được viết dựa trên kinh nghiệm setup Jira cho nhiều teams khác nhau. Nếu thấy hữu ích, đừng quên chia sẻ!*
