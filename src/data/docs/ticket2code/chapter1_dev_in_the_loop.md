---
title: "Chương 1: Dev-in-the-Loop & Triết lý ticket2code"
description: "Phân tích nỗi đau thực tế khi áp dụng AI tự phát trong team phát triển dự án và lý do tại sao cần đưa lập trình viên làm trung tâm thông qua một quy trình nhất quán."
order: 2
icon: "🔄"
---

# Chương 1: Từ sự hỗn loạn khi "mỗi người dùng AI một kiểu" đến sự ra đời của ticket2code

Trong các đội ngũ phát triển, AI (như GitHub Copilot, ChatGPT, Cursor) đã nhanh chóng trở thành một phần không thể thiếu. Ai cũng thừa nhận AI giúp viết code nhanh hơn. Thế nhưng, sau vài tháng hồ hởi ban đầu, thực tế cho thấy một kết quả phũ phàng: **năng suất thực tế của cả dự án không tăng, thậm chí còn đi xuống, kèm theo vô số lỗi vặt trên production.**

Khi phân tích thực tế, một "nỗi đau" chung được chỉ ra là: **Mỗi thành viên trong team đang sử dụng AI theo một cách hoàn toàn khác nhau, tạo ra một quy trình làm việc vô cùng hỗn loạn từ lúc đọc yêu cầu cho đến khi kiểm thử.**

Bài viết này chia sẻ về hành trình vượt qua sự hỗn loạn đó và lý do ra đời của **ticket2code**.

---

## 1. Nỗi đau: Khi AI tạo ra sự "lệch pha" trong nội bộ team

Khi không có một quy trình chuẩn hóa, việc ứng dụng AI trong team đã diễn ra như thế này:

*   **Lập trình viên A (Thích copy-paste trực tiếp):** Copy toàn bộ mô tả ticket từ JIRA, ném thẳng vào ChatGPT rồi copy đoạn code trả về đè lên file hiện tại. Kết quả: Code chạy được cho tính năng đó, nhưng phá vỡ cấu trúc thư mục và các helper dùng chung của dự án.
*   **Lập trình viên B (Bỏ qua khâu đọc kỹ yêu cầu):** Dùng Copilot sinh code ngay khi mới đọc lướt qua tiêu đề ticket. Đến lúc QC kiểm thử mới phát hiện ra code thiếu mất 3 trên tổng số 5 Tiêu chí nghiệm thu (Acceptance Criteria) của Product Owner.
*   **Lập trình viên C (Quên viết log và test):** Giao phó hoàn toàn việc viết code cho AI. AI viết code logic rất nhanh nhưng bỏ qua việc ghi log lỗi (logging) và viết Unit Test vì "chủ quan" là AI viết thì chắc chắn đúng.
*   **Lập trình viên D (Ngại review code của AI):** Khi AI tự động sửa đổi hàng loạt file, lập trình viên D ngại đọc lại từng dòng thay đổi (diff) mà bấm commit luôn. Hậu quả là những lỗi logic nghiêm trọng bị lọt qua vòng kiểm duyệt.

**Hệ quả chung:** AI giúp từng cá nhân gõ phím nhanh hơn, nhưng lại làm tăng thời gian họp hành để sửa lỗi, làm loãng cấu trúc codebase (codebase drift), và phá vỡ các quy chuẩn chung của dự án.

---

## 2. Ý tưởng: Phải chuẩn hóa "Đầu vào" và "Đầu ra" bằng một Pipeline duy nhất

Thực tế cho thấy: **Vấn đề không nằm ở bản thân AI, mà nằm ở việc thiếu một quy trình làm việc (workflow) nhất quán.** 

Để giải quyết bài toán này, cần xây dựng một công cụ có thể:
1.  **Nhất quán đầu vào:** Tự động lấy thông tin từ JIRA, tự phân tích nghiệp vụ thay vì để mỗi lập trình viên tự copy bằng tay theo các cách hiểu khác nhau.
2.  **Chuẩn hóa quy trình phân tích:** Buộc AI phải quét codebase và đề xuất kế hoạch cụ thể (sẽ sửa những file nào, ảnh hưởng luồng nào) và bắt buộc lập trình viên phải duyệt kế hoạch đó trước khi viết code.
3.  **Tự động hóa đầu ra:** Ép AI phải đối chiếu code vừa viết với các tài liệu quy chuẩn của dự án (Coding style, Logging, Unit Test) để đảm bảo tính nhất quán.

Đó chính là lý do **ticket2code** ra đời. Thay vì để mỗi người dùng AI một kiểu, cả team giờ đây chỉ dùng một lệnh duy nhất: `/ticket TICKET-ID`.

---

## 3. ticket2code thay đổi cách làm việc trong team như thế nào?

Từ khi áp dụng ticket2code, quy trình làm việc với AI của cả team đã được đưa vào khuôn khổ:

*   **Không còn đoán mò yêu cầu:** AI tự kết nối JIRA để lấy Acceptance Criteria gốc, đảm bảo không ai bị sót yêu cầu.
*   **Bắt buộc phải lập kế hoạch:** AI sẽ đưa ra một bản báo cáo phân tích tác động trước. Lập trình viên đóng vai trò kiểm duyệt (Dev-in-the-Loop). Chỉ khi người dùng bấm đồng ý, code mới được tạo ra.
*   **Code luôn đúng chuẩn:** Dù là ai viết hay AI viết, mã nguồn sinh ra đều tự động được đối chiếu với các quy tắc ghi log và kiểm thử của dự án.

---

## 4. Kết luận

Ứng dụng AI vào lập trình không phải là để mỗi người tự do tối ưu hóa cục bộ theo cách riêng của mình, mà là để nâng tầm hiệu suất của toàn đội ngũ thông qua một quy trình chuẩn hóa. ticket2code chính là lời giải cho bài toán đó.

Trong chương tiếp theo, chúng ta sẽ đi sâu vào thiết kế kỹ thuật của **Pipeline 6 giai đoạn** - "xương sống" giúp ticket2code chuyển hóa một ticket JIRA thành code sạch một cách nhất quán.
