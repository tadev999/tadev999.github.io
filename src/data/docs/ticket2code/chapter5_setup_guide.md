---
title: "Chương 5: Hướng dẫn cài đặt & Đưa vào dự án"
description: "Hướng dẫn thực hành chi tiết từ việc chạy câu lệnh cài đặt nhanh, cấu hình JIRA, đồng bộ hóa luật chơi qua thư mục docs/ và chạy thực tế tác vụ đầu tiên trên IDE."
order: 6
icon: "⚡"
---

# Chương 5: Cài đặt và Đưa ticket2code vào dự án của cả team chỉ trong 5 giây

Một công cụ dù có tốt đến đâu nhưng nếu quy trình cài đặt quá phức tạp, mất cả ngày để cấu hình, thì lập trình viên trong team cũng sẽ nhanh chóng từ bỏ và quay lại thói quen dùng AI tự phát cũ.

Để giải quyết vấn đề này và giúp cả team chuyển dịch sang quy trình làm việc chuẩn hóa một cách dễ chịu nhất, ticket2code được thiết kế với tiêu chí **"Cực kỳ dễ dàng cài đặt" (Zero-Friction Adoption)**. 

Bài viết này sẽ hướng dẫn bạn cách thiết lập ticket2code vào dự án của cả team chỉ bằng một câu lệnh duy nhất và chạy thử nghiệm tác vụ đầu tiên.

---

## 1. Cài đặt nhanh bằng 1 dòng lệnh (Quick Installation)

Mở terminal tại thư mục gốc của dự án bạn đang phát triển và chạy câu lệnh tương ứng:

### Trên macOS / Linux / Git Bash (Recommended)
```bash
git clone --depth 1 https://github.com/tadev999/ticket2code.git /tmp/ticket2code && /tmp/ticket2code/bin/setup.sh . && rm -rf /tmp/ticket2code
```

### Trên Windows (PowerShell)
```powershell
git clone --depth 1 https://github.com/tadev999/ticket2code.git $env:TEMP\ticket2code; powershell -ExecutionPolicy Bypass -File "$env:TEMP\ticket2code\bin\setup.ps1" .; Remove-Item -Recurse -Force $env:TEMP\ticket2code
```

**Script setup này tự động hóa toàn bộ các bước tẻ nhạt:**
1.  Tải các prompt và file cấu hình của ticket2code về.
2.  Tạo thư mục cấu hình lệnh `/ticket` của dự án (`.github/prompts/ticket.prompt.md`).
3.  Tạo file mẫu môi trường `.env.local`.
4.  Tự động thêm cấu hình bảo mật vào `.gitignore`.
5.  Kiểm tra sự tồn tại của các file tài liệu hướng dẫn nghiệp vụ trong thư mục `docs/`.

---

## 2. Điền thông tin cấu hình JIRA

Cả team chỉ cần tạo file cấu hình `.env.local` ở máy cá nhân của mình và điền thông tin tài khoản:

```dotenv
JIRA_TOKEN=your_atlassian_api_token
JIRA_EMAIL=your_email@company.com
JIRA_URL=https://your-company.atlassian.net
```

*(Lưu ý: API Token có thể dễ dàng tạo ra bằng cách truy cập trang quản lý tài khoản Atlassian phần Security).*

---

## 3. Đồng bộ hóa luật dự án qua thư mục `docs/`

Để AI hiểu và viết code đúng chuẩn của team, bạn chỉ cần tạo hoặc cập nhật các file hướng dẫn sau trong thư mục `docs/` ở root dự án (nếu dự án chưa có):

*   `docs/coding_style.md`: Quy chuẩn viết code của team (đặt tên biến, cấu trúc dự án).
*   `docs/logging_policy.md`: Quy định về ghi log lỗi, log sự kiện.
*   `docs/test_rules.md`: Quy chuẩn viết unit test và integration test.

Từ nay về sau, khi có bất kỳ thay đổi nào về coding style, bạn chỉ cần sửa file trong thư mục `docs/` này. AI của tất cả các thành viên trong team sẽ tự động cập nhật luật chơi mới mà không cần ai phải cấu hình lại prompt.

---

## 4. Chạy tác vụ đầu tiên trên IDE

Mọi thứ đã sẵn sàng! Bây giờ các thành viên trong team chỉ cần:

1.  Mở IDE của dự án (VS Code, Cursor, JetBrains...).
2.  Mở cửa sổ Chat AI (GitHub Copilot Chat hoặc IDE Chat tích hợp).
3.  Nhập lệnh và bấm Enter:
    ```text
    /ticket TICKET-12345
    ```
    *(Thay `TICKET-12345` bằng mã ticket JIRA thực tế)*

4.  **Luồng chạy thực tế:**
    - AI tự động tải thông tin ticket từ JIRA.
    - AI quét codebase và đưa ra báo cáo phân tích tác động.
    - AI dừng lại để lập trình viên kiểm duyệt và tích chọn `[x] Yes, generate code`.
    - AI viết code, tự động đối chiếu các quy chuẩn ghi log/test trong `docs/` để hoàn thiện và đưa ra gợi ý tin nhắn Git Commit.

---

## 5. Lời kết cho chuỗi bài viết

ticket2code ra đời từ chính nỗi đau thực tế của một đội ngũ phát triển gặp hỗn loạn khi ứng dụng AI một cách tự phát. Bằng cách chuẩn hóa quy trình bằng một Pipeline 6 giai đoạn và một câu lệnh duy nhất, AI được đưa từ một công cụ sinh code tự do trở thành một trợ lý đắc lực, an toàn và kỷ luật của cả team.

Hy vọng ticket2code sẽ giúp dự án của bạn tăng tốc vượt trội và giải quyết được bài toán nhất quán chất lượng mã nguồn. 

Nếu có nhu cầu đóng góp hoặc gặp khó khăn trong quá trình sử dụng, hãy ghé thăm dự án trên Github nhé! Cảm ơn bạn đã theo dõi trọn vẹn chuỗi bài viết này.
