---
title: "Chương 4: Bảo mật & Riêng tư dữ liệu"
description: "Phân tích các giải pháp bảo mật của ticket2code để bảo vệ mã nguồn và dữ liệu nhạy cảm bao gồm: thực thi hoàn toàn cục bộ, bảo vệ credentials (Zero-Commit) và tự động lọc dữ liệu cá nhân (PII)."
order: 5
icon: "🛡️"
---

# Chương 4: Bảo mật & Riêng tư — Cách giải quyết nỗi lo rò rỉ dữ liệu khi dùng AI trong doanh nghiệp

Khi bắt đầu áp dụng AI vào dự án, rào cản lớn nhất đối với các doanh nghiệp không phải là kỹ thuật, mà là **chính sách bảo mật của công ty**. 

Ban quản lý và đội ngũ an ninh thông tin đã gióng lên hồi chuông cảnh báo khi phát hiện lập trình viên:
- Sao chép trực tiếp các thông tin nhạy cảm của khách hàng (tên, email, số điện thoại) từ ticket JIRA dán vào các công cụ AI công cộng để nhờ phân tích nghiệp vụ.
- Chat trực tiếp API key hoặc mật khẩu hệ thống lên cửa sổ chat AI để sửa lỗi kết nối.
- Vô tình để lộ các mã nguồn độc quyền của dự án khi tải toàn bộ codebase lên các dịch vụ AI đám mây không được kiểm soát.

Đây là những mối đe dọa thực tế đối với sự an toàn thông tin của doanh nghiệp. Để giải quyết nỗi lo này, khi xây dựng **ticket2code**, tiêu chuẩn **Security-First (Bảo mật là ưu tiên hàng đầu)** đã được chọn làm gốc.

---

## 1. Cơ chế chạy cục bộ (Local Connection Only) — Không qua máy chủ trung gian

Một số công cụ AI Agent yêu cầu bạn kết nối tài khoản JIRA của dự án và mã nguồn lên máy chủ SaaS của họ để xử lý. Điều này đồng nghĩa với việc bạn phải giao tài khoản và code cho bên thứ ba quản lý.

ticket2code phá vỡ rủi ro này bằng cách **chạy hoàn toàn cục bộ trên máy tính của lập trình viên**:
- Khi bạn chạy lệnh `/ticket`, IDE của bạn (đã được cấu hình an toàn) sẽ trực tiếp kết nối với JIRA REST API và dịch vụ LLM được doanh nghiệp phê duyệt.
- Không có bất kỳ máy chủ trung gian nào của ticket2code đứng giữa để thu thập hay lưu trữ dữ liệu của bạn. Code của dự án và thông tin ticket không bao giờ rời khỏi môi trường làm việc an toàn của bạn.

---

## 2. Bảo vệ thông tin đăng nhập với cơ chế Zero-Commit

Để kết nối với JIRA, lập trình viên cần cấu hình các thông tin đăng nhập trong file cấu hình `.env.local` ở thư mục gốc của dự án. 

Nỗi sợ lớn nhất là ai đó vô tình commit file cấu hình này lên Github/Gitlab công cộng. ticket2code ngăn chặn điều này bằng cách tự động hóa:
- **Tự động cấu hình `.gitignore`:** Script cài đặt của ticket2code sẽ tự động kiểm tra và thêm `.env.local` vào `.gitignore` ngay khi chạy.
- **Ràng buộc kiểm tra nội bộ:** Agent được huấn luyện để từ chối đọc hoặc hiển thị thô các thông tin credentials này lên màn hình chat, đảm bảo không bị lộ thông tin qua ảnh chụp màn hình hoặc log chat.

---

## 3. Bộ lọc PII tự động trước khi gửi lên LLM

Các ticket JIRA thực tế thường chứa thông tin cá nhân của khách hàng (PII - Personally Identifiable Information). 

Ở Stage 2 (Parse), ticket2code thực hiện làm sạch dữ liệu:
- Nó tự động lọc bỏ các tên riêng, địa chỉ email, số điện thoại, hoặc số thẻ tín dụng xuất hiện trong phần mô tả ticket.
- Nó chỉ giữ lại các yêu cầu nghiệp vụ logic cốt lõi (ví dụ: *"Khi người dùng bấm nút checkout thì tính thêm thuế 10%"*) để gửi cho mô hình ngôn ngữ lớn phân tích. Điều này đảm bảo dữ liệu khách hàng luôn được bảo mật tối đa.

---

## 4. Kiểm soát chặt chẽ phạm vi chỉnh sửa (Scope Control)

AI đôi khi tự ý thay đổi hoặc vô hiệu hóa các cơ chế bảo mật (như tắt xác thực JWT, mở rộng quyền truy cập Database) để giải quyết một lỗi nhanh nhất có thể.

Với ticket2code, việc này là bất khả thi nhờ **Cổng phê duyệt ở Stage 3**:
- AI chỉ được phép chỉnh sửa các file nằm trong phạm vi mà lập trình viên đã phê duyệt từ trước.
- Mọi nỗ lực chỉnh sửa các file hệ thống nhạy cảm (như file cấu hình phân quyền, file cấu hình SSL) nằm ngoài danh sách phê duyệt sẽ bị hệ thống chặn lại và báo cáo lỗi ngay lập tức.

---

## 5. Kết luận

Bảo mật không nên là rào cản ngăn chúng ta tiếp cận với công nghệ AI hiện đại. Bằng việc thiết lập quy trình chạy local hoàn toàn, tự động lọc dữ liệu PII và kiểm soát chặt chẽ phạm vi hoạt động của AI, ticket2code giúp đội ngũ phát triển yên tâm tối ưu năng suất làm việc mà vẫn đảm bảo tính an toàn thông tin tối cao của doanh nghiệp.

Trong chương cuối cùng, chúng ta sẽ xem cách đưa ticket2code vào dự án của bạn và vận hành thử nghiệm chỉ trong vòng 5 giây.
