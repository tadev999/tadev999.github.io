---
title: "Hướng dẫn sử dụng Jules Google để lập trình đa nền tảng kết nối trực tiếp với GitHub"
pubDatetime: 2025-01-30T10:00:00Z
author: "Kiro"
tags: ["ai", "google", "jules", "github", "coding", "productivity", "cloud-development"]
featured: true
draft: false
description: "Khám phá cách sử dụng Jules - AI Agent thế hệ mới từ Google. Lập trình mọi lúc, mọi nơi, trên mọi thiết bị thông qua việc kết nối trực tiếp với codebase trên GitHub."
---

Lập trình viên hiện đại luôn tìm kiếm các giải pháp linh hoạt để làm việc. Giờ đây, bạn không còn bị giới hạn bởi một chiếc laptop cấu hình khủng hay môi trường cài đặt cục bộ phức tạp nữa.

Sự ra mắt của **Jules** (từ Google) mang đến một bước đột phá: một AI Agent mạnh mẽ, có khả năng kết nối trực tiếp với tài khoản GitHub của bạn và thao tác trên codebase như một lập trình viên thực thụ, từ bất kỳ trình duyệt nào.

Trong bài viết này, chúng ta sẽ tìm hiểu cách thiết lập và sử dụng Google Jules để lập trình mọi lúc, mọi nơi.

---

## Google Jules là gì?

Jules là một lập trình viên AI (AI Software Engineer) do Google phát triển. Không giống như các chatbot thông thường (chỉ sinh ra code để bạn copy-paste), Jules hoạt động với tư duy của một agent (tác nhân độc lập).

**Khả năng nổi bật của Jules:**
- **Đọc hiểu Codebase:** Nó quét và hiểu toàn bộ cấu trúc dự án của bạn, không chỉ một file đơn lẻ.
- **Tự động thực thi lệnh:** Có khả năng chạy các lệnh terminal (như `npm install`, `build`, chạy test).
- **Trực tiếp thao tác với Git:** Tạo branch mới, viết code, sửa file và tự động tạo Pull Request.
- **Hoạt động hoàn toàn trên Cloud:** Chỉ cần một thiết bị có trình duyệt (như iPad, điện thoại, hoặc máy tính công ty), bạn đã có một môi trường dev đầy đủ.

---

## Hướng dẫn kết nối Jules với GitHub

Để bắt đầu hành trình "Vibe Coding" với Jules, bạn cần liên kết nó với kho chứa mã nguồn của mình.

### Bước 1: Đăng nhập vào hệ thống Jules
Truy cập vào nền tảng của Jules (thường tích hợp qua Google Cloud Platform, Workspace hoặc giao diện IDE đám mây của Google) bằng tài khoản Google của bạn.

### Bước 2: Ủy quyền kết nối GitHub
1. Trong giao diện cài đặt (Settings) của Jules, tìm phần **Integrations** hoặc **Version Control**.
2. Chọn **Connect GitHub**.
3. Hệ thống sẽ chuyển hướng bạn sang GitHub để xác thực (OAuth).
4. Bạn có thể chọn cấp quyền cho toàn bộ các repositories hoặc chỉ cấp quyền cho một vài repository cụ thể (khuyên dùng vì lý do bảo mật).

### Bước 3: Import Project
1. Từ màn hình chính của Jules, chọn **New Workspace** hoặc **Open Repository**.
2. Chọn repository mà bạn vừa cấp quyền.
3. Jules sẽ khởi tạo một môi trường sandbox an toàn trên cloud, clone code về và bắt đầu index (đọc hiểu) dự án. Quá trình này mất khoảng vài chục giây tùy dung lượng repo.

---

## Workflow lập trình với Jules trên mọi thiết bị

Đây là phần thú vị nhất. Nhờ việc Jules chạy trên cloud, bạn có thể nằm dài trên sofa, dùng iPad mở trình duyệt và yêu cầu Jules lập trình thay mình.

### 1. Phân tích và Viết Spec (Giao việc)
Thay vì gõ từng dòng code, bạn trò chuyện với Jules thông qua khung chat.

> **Prompt:** *"Tôi muốn thêm tính năng 'Dark Mode' vào trang landing page. Bạn hãy phân tích thư mục `src/components` và `tailwind.config.js` để xem cần thay đổi những gì, sau đó liệt kê các bước ra đây trước khi code nhé."*

Jules sẽ đọc codebase và trả lời một bản kế hoạch.

### 2. Yêu cầu thực thi (Execute)
Sau khi đồng ý với kế hoạch, bạn ra lệnh thực hiện.

> **Prompt:** *"Kế hoạch tốt. Hãy tạo một branch mới tên là `feature/dark-mode` và tiến hành viết code. Khi xong, hãy chạy lệnh build để đảm bảo không có lỗi."*

Jules sẽ:
- Tự chạy lệnh `git checkout -b feature/dark-mode`.
- Mở các file tương ứng, thêm classes của Tailwind, cập nhật state của React/Vue.
- Mở terminal ẩn và chạy `npm run build`.
- Báo cáo lại cho bạn kết quả.

### 3. Review Code trực tiếp
Ngay trên giao diện trình duyệt, bạn có thể xem **diff** (sự thay đổi) của các file mà Jules vừa sửa, giống hệt như đang xem một Pull Request trên GitHub.

Nếu thấy màu sắc chưa ưng ý trên iPad, bạn chat tiếp:
> **Prompt:** *"Đổi màu nền tối (dark background) sang mã `#1a202c` thay vì đen tuyền nhé."*

Jules sẽ tự động tìm đúng file CSS/Config để sửa lại.

### 4. Commit và Tạo Pull Request
Khi mọi thứ đã hoàn hảo:

> **Prompt:** *"Hoàn tất. Hãy commit với thông điệp theo chuẩn Conventional Commits và đẩy nhánh này lên GitHub, sau đó tạo một Pull Request giúp tôi."*

Xong! Bạn vừa hoàn thành một tính năng phức tạp chỉ bằng vài dòng chat từ một chiếc máy tính bảng.

---

## Lợi ích khi sử dụng Jules làm Dev Environment

1. **Không giới hạn thiết bị:** Quên đi những buổi tối phải mang theo chiếc laptop nặng nề. Một chiếc tablet hay Chromebook là quá đủ.
2. **Không còn lỗi "It works on my machine":** Vì môi trường (sandbox) của Jules được cấu hình chuẩn trên cloud, mọi package, node version đều được setup chính xác.
3. **Giải phóng năng lực tư duy:** Bạn đóng vai trò là Tech Lead/Architect (người ra quyết định), còn Jules đóng vai trò là Coder (người gõ phím).

## Lưu ý về bảo mật (Security)

Vì AI có quyền truy cập trực tiếp vào source code của bạn:
- Luôn giới hạn quyền truy cập GitHub của Jules ở mức **Specific Repositories** thay vì **All Repositories**.
- Tránh để các file `.env` chứa khóa bí mật (API Keys, Passwords) thực sự trên GitHub. Hãy dùng các công cụ Secret Manager.
- Luôn kiểm tra (Review) code do AI tạo ra trước khi merge vào nhánh `main`.

## Kết luận

Google Jules đang định hình lại khái niệm lập trình đám mây (Cloud Development). Khả năng hiểu codebase sâu sắc kết hợp với khả năng thực thi độc lập biến nó thành một "cộng sự" đắc lực, cho phép bạn làm việc linh hoạt, hiệu quả và rảnh tay hơn bao giờ hết.

Hãy thử kết nối dự án cá nhân của bạn vào Jules ngay hôm nay và trải nghiệm phong cách **Vibe Coding** tương lai!
