---
title: "Chương 3: Context & Luật chơi dự án"
description: "Khám phá cách ticket2code quét codebase thông minh, ánh xạ các liên kết API và tự động đọc các tài liệu hướng dẫn viết code trong thư mục docs/ để đồng bộ chất lượng mã nguồn sinh ra."
order: 4
icon: "👑"
---

# Chương 3: Context Is King — Cách dạy AI hiểu đúng "luật chơi" của dự án để viết code đồng nhất

Nỗi đau lớn nhất khi team dùng AI tự phát chính là sự **mất kiểm soát về phong cách và chất lượng code**. 

Mỗi lập trình viên có một thói quen code khác nhau, dẫn đến việc khi họ dùng các câu lệnh (prompts) khác nhau để sinh code từ AI, mã nguồn tạo ra sẽ là một nồi "lẩu thập cẩm": người thì dùng `async/await`, người dùng `Promise.then`, người thì đặt tên biến kiểu `camelCase`, người lại thích `snake_case`. Tệ hơn nữa, các quy chuẩn viết log lỗi hay viết unit test của dự án bị bỏ qua vì AI không hề biết đến sự tồn tại của chúng.

Để giải quyết sự thiếu nhất quán này, ticket2code đã xây dựng cơ chế **Dò tìm quy tắc tự động (Rule Discovery)** và **Quét ngữ cảnh thông minh (Context Scanning)**.

---

## 1. Dạy AI hiểu luật của dự án qua thư mục `docs/`

Thay vì bắt lập trình viên phải nhớ copy quy định viết code của công ty vào prompt mỗi lần chat với AI, ticket2code thiết lập một cơ chế tự động tìm kiếm quy tắc trong repository theo thứ tự ưu tiên:

```
+-------------------------------------------------------------+
| ƯU TIÊN 1: Thư mục docs/ của dự án (Tài liệu nội bộ team)     |
|    - docs/coding_style.md (Quy tắc viết code)                |
|    - docs/logging_policy.md (Quy tắc ghi log)                |
|    - docs/test_rules.md (Quy tắc viết unit test)             |
+-------------------------------------------------------------+
                              | Nếu thiếu, tìm tiếp
                              v
+-------------------------------------------------------------+
| ƯU TIÊN 2: Chỉ thị cấp Repository (Repo Instructions)       |
|    - .github/copilot-instructions.md                        |
+-------------------------------------------------------------+
                              | Nếu thiếu, tìm tiếp
                              v
+-------------------------------------------------------------+
| ƯU TIÊN 3: Luật mặc định của ticket2code (System Prompts)   |
|    - ticket-agent.md, ticket-processor.prompt.md            |
+-------------------------------------------------------------+
```

Bằng cách đưa thư mục `docs/` lên ưu tiên cao nhất, quy trình giải quyết được hai vấn đề:
1.  **Duy nhất một nguồn sự thật (Single Source of Truth):** Đội ngũ chỉ cần cập nhật tài liệu chuẩn trong thư mục `docs/`. AI sẽ tự động đọc và tuân thủ các quy tắc mới nhất mà lập trình viên không cần làm gì thêm.
2.  **Ràng buộc kỷ luật:** Nếu dự án thiếu các file tài liệu này, ticket2code khi thiết lập sẽ phát cảnh báo để thúc đẩy team viết tài liệu chuẩn hóa dự án.

---

## 2. Quét dự án & Ánh xạ API thông minh (Stage 3)

Một lỗi phổ biến khác là AI tự sinh ra các hàm hoặc import các thư viện không tồn tại trong dự án, hoặc viết đè lên các API dùng chung đã có sẵn. 

Để ngăn chặn việc này, Stage 3 (Analyze) thực hiện quét codebase cục bộ theo quy trình:
1.  **Tìm kiếm điểm chạm (Entry Points):** Tìm các file cấu hình định tuyến (routes) hoặc controllers liên quan đến mô tả của ticket JIRA.
2.  **Lần theo Dependency:** Đọc các module import để tìm ra các hàm service hoặc repository hiện tại.
3.  **Lập bản đồ tác động (Impact Flow Mapping):** Đánh giá luồng dữ liệu thay đổi từ màn hình giao diện (UI) qua nghiệp vụ (Business logic) đến cơ sở dữ liệu (Database) để dự báo rủi ro.

Kết quả là bản **Báo cáo Phân tích Ticket & Đánh giá Rủi ro (Ticket Analysis Report)** rõ ràng, liệt kê chính xác các API và các file sẽ tương tác. Cả team sẽ có chung một cái nhìn tổng quan về giải pháp kỹ thuật trước khi gõ code.

---

## 3. Bản hợp đồng ràng buộc (Scope Contract) ở Stage 4

Khi lập trình viên bấm chọn đồng ý kế hoạch ở Stage 3, danh sách các file được liệt kê sẽ trở thành một **Bản hợp đồng ràng buộc (Scope Contract)**. 

Khi AI chuyển sang Stage 4 (Generate) để viết code:
- Nó bị giới hạn nghiêm ngặt, chỉ được sửa các file đã nằm trong hợp đồng.
- Nó không được tự ý sửa đổi cấu hình hệ thống hay các module nhạy cảm khác mà chưa được duyệt.
- Nó bắt buộc phải áp dụng các quy chuẩn thiết kế và hàm helper dùng chung đã tìm thấy ở Stage 3 thay vì tự viết mới một hàm tương tự.

---

## 4. Kết luận

Bằng cách tự động hóa việc đọc tài liệu quy chuẩn (`docs/`) và quét codebase một cách có hệ thống, ticket2code đảm bảo rằng AI luôn viết code đúng chuẩn kiến trúc của dự án, bất kể lập trình viên nào đang chạy lệnh. Sự nhất quán này giúp mã nguồn dự án luôn sạch sẽ, dễ bảo trì và giảm thiểu tối đa nợ kỹ thuật (technical debt).

Ở chương tiếp theo, chúng ta sẽ thảo luận về một chủ đề cực kỳ quan trọng đối với các doanh nghiệp: **Làm sao ứng dụng AI Agent mà không bị lộ dữ liệu nhạy cảm?**
