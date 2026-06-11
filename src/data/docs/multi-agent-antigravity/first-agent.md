---
title: "Phần 2: First Agent"
description: "Hướng dẫn khởi tạo Architect Agent đầu tiên với Gemini 3.5 Flash, cấu hình cửa sổ ngữ cảnh 1M tokens, chạy thử nghiệm phân tích và theo dõi trực quan trên Agent Manager UI."
order: 3
icon: "🤖"
---

# 🤖 Phần 2: First Agent (Architect Agent)

> **"A journey of a thousand miles begins with a single step."** Trước khi xây dựng một tổ hợp hàng chục agent chạy song song, chúng ta cần học cách làm chủ và vận hành thành thạo một agent đơn lẻ. Bài viết này sẽ hướng dẫn bạn thiết lập **Architect Agent** — "Kiến trúc sư trưởng" đặt nền móng cho toàn bộ hệ thống.

---

Trong mô hình Multi-Agent của Antigravity 2.0, **Architect Agent** đóng vai trò tối quan trọng. Agent này sẽ đảm nhận nhiệm vụ tiếp nhận yêu cầu ngôn ngữ tự nhiên từ người dùng, phân tích cấu trúc, thiết kế cơ sở dữ liệu và phân chia hệ thống thành các module nhỏ hơn để các agent code (Frontend, Backend, Data) thực thi ở các bước tiếp theo.

```
                  ┌──────────────────────────┐
                  │   User Requirement Prompt  │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │    Architect Agent       │
                  │   (Gemini 3.5 Flash)     │
                  └─────────────┬────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Technical Spec│       │  Data Schema  │       │ File Structure│
└───────────────┘       └───────────────┘       └───────────────┘
```

---

## 🛠️ Bước 1: Định nghĩa Architect Agent trong Antigravity 2.0

Để khởi tạo Architect Agent, chúng ta cần định nghĩa agent dưới dạng một tệp cấu hình JSON hoặc YAML chuẩn hóa trong thư mục dự án của mình. Tệp cấu hình này giúp Antigravity nhận diện vai trò, mục tiêu và mô hình xử lý cho agent.

Tạo tệp `.antigravity/agents/architect_agent.json` trong thư mục project của bạn:

```json
{
  "agent_id": "architect_agent",
  "name": "iOS System Architect",
  "role": "Senior iOS System Architect & Software Engineer",
  "goal": "Phân tích yêu cầu ứng dụng iOS, thiết kế kiến trúc hệ thống chuẩn MVVM + Repository, tích hợp dịch vụ đám mây Firebase (Auth, Firestore) và hoạch định cấu trúc tệp tin chi tiết.",
  "backstory": "Bạn là một chuyên gia thiết kế hệ thống iOS với hơn 10 năm kinh nghiệm xây dựng các ứng dụng quy mô lớn sử dụng dịch vụ đám mây (Firebase, GCP, AWS) trên App Store. Bạn có kiến thức sâu rộng về SwiftUI, Firebase Authentication, Cloud Firestore, Combine, và các quy chuẩn thiết kế sạch (Clean Architecture). Bạn luôn ưu tiên sự bảo mật, hiệu năng tối ưu, và khả năng mở rộng của hệ thống.",
  "model": "gemini-3.5-flash",
  "temperature": 0.2,
  "max_output_tokens": 16384
}
```

> [!NOTE]
> Thiết lập `temperature: 0.2` (thấp) đảm bảo Architect Agent tư duy một cách logic, nhất quán và hạn chế tối đa sự "sáng tạo quá đà" (hallucination), giúp bản thiết kế kỹ thuật luôn thực tế và chính xác.

---

## 👁️ Bước 2: Cấu hình Cửa sổ Ngữ cảnh 1M Tokens & System Instructions

Sức mạnh lớn nhất của **Gemini 3.5 Flash** chính là **1M tokens context window** kết hợp với tốc độ phản hồi cực nhanh. Điều này cho phép chúng ta tải toàn bộ quy chuẩn thiết kế của Apple (Human Interface Guidelines), tài liệu SwiftLint, và cấu trúc thư mục hiện tại của dự án vào ngữ cảnh của agent mà không lo bị tràn bộ nhớ.

### Thiết lập System Instructions chuyên sâu:
System Instruction giúp định hình hành vi cốt lõi của Agent. Hãy thêm đoạn prompt dưới đây vào phần cấu hình của Agent trong Antigravity App hoặc tệp cấu hình:

```markdown
Bạn là một AI Agent đóng vai trò Senior iOS Architect. Khi phân tích yêu cầu:
1. LUÔN LUÔN sử dụng kiến trúc MVVM (Model-View-ViewModel) kết hợp với Repository Pattern cho phần Data layer.
2. Các View phải viết hoàn toàn bằng SwiftUI sạch, phân chia thành các component nhỏ tái sử dụng được.
3. Phần Persistence phải sử dụng dịch vụ Firebase: Firebase Authentication để quản lý phiên đăng nhập và Cloud Firestore để đồng bộ lưu trữ dữ liệu thời gian thực.
4. Mọi thao tác Firestore phải được đóng gói trong Repository bất đồng bộ (sử dụng Swift async/await) để tránh block Main Thread.
5. Phải hoạch định rõ ràng danh sách các file cần tạo kèm theo đường dẫn tuyệt đối (ví dụ: `Sources/Views/MainView.swift`).
6. Chỉ ra cụ thể các unit tests cần viết cho từng ViewModel và Repository để đảm bảo coverage > 85%.
```

---

## 🚀 Bước 3: Chạy Thử nghiệm (Test) với Simple iOS App

Hãy thử thách Architect Agent của bạn bằng cách giao cho nó thiết kế cấu trúc cho ứng dụng **Expense Tracker** (Theo dõi chi tiêu) đã đề cập ở phần Overview.

### 1. Gửi Task tới Agent qua CLI của Antigravity:
Chạy lệnh sau trong Terminal để kích hoạt Architect Agent:

```bash
antigravity run --agent architect_agent --task "Thiết kế kiến trúc hệ thống cho ứng dụng Expense Tracker hỗ trợ bảo mật bằng Firebase Authentication, lưu trữ dữ liệu đám mây thời gian thực với Cloud Firestore, vẽ biểu đồ chi tiêu tuần bằng Charts, và hỗ trợ Dark Mode."
```

### 2. Kết quả phân tích (Output của Agent):
Chỉ sau khoảng **8-10 giây** (nhờ tốc độ vượt trội của Gemini 3.5 Flash), Architect Agent sẽ trả về một bản tài liệu kỹ thuật chi tiết:

```markdown
# TECHNICAL SPECIFICATION: EXPENSE TRACKER APP WITH FIREBASE

## 1. Cloud Database Schema (Firestore)
- **Collection: `users`**
  - Document: `{userId}` (Tài liệu người dùng)
    - `uid`: String (Khóa chính liên kết Firebase Auth)
    - `email`: String (Thư điện tử)
    - `createdAt`: Timestamp (Thời gian tạo tài khoản)
- **Sub-collection: `users/{userId}/expenses`**
  - Document: `{expenseId}` (Tài liệu chi tiêu chi tiết)
    - `id`: String (Khóa chính tự động sinh)
    - `amount`: Double (Số tiền chi tiêu)
    - `category`: String (Phân loại: Ăn uống, Di chuyển, Mua sắm...)
    - `date`: Timestamp (Thời gian chi tiêu)
    - `note`: String? (Ghi chú tùy chọn)

## 2. Architecture Map (MVVM + Repository + Firebase Services)
- **Models**:
  - `User.swift` & `Expense.swift` (Swift Structs biểu diễn thực thể dữ liệu)
- **Services**:
  - `FirebaseAuthService.swift` (Bọc các hàm của Firebase SDK như Đăng ký, Đăng nhập, Đăng xuất)
  - `FirebaseFirestoreService.swift` (Bọc các hàm CRUD bất đồng bộ với Firestore)
- **Repositories**:
  - `AuthRepository.swift` (Xử lý xác thực người dùng)
  - `ExpenseRepository.swift` (Truy xuất và thay đổi dữ liệu chi tiêu real-time của user)
- **ViewModels**:
  - `AuthViewModel.swift` (Quản lý trạng thái Auth UI và kiểm tra form đăng nhập)
  - `ExpenseListViewModel.swift` (Lắng nghe snapshot real-time từ Firestore và chuẩn bị dữ liệu cho UI)
- **Views**: 
  - `LoginView.swift` & `RegisterView.swift` (Giao diện xác thực)
  - `ExpenseListView.swift` (Hiển thị danh sách và biểu đồ tuần)
  - `AddExpenseView.swift` (Màn hình thêm mới chi tiêu)

## 3. Proposed File Structure
- 📂 `ExpenseTracker/`
  - 📂 `Services/`
    - 📄 `FirebaseAuthService.swift`
    - 📄 `FirebaseFirestoreService.swift`
  - 📂 `Models/`
    - 📄 `User.swift`
    - 📄 `Expense.swift`
  - 📂 `Repositories/`
    - 📄 `AuthRepository.swift`
    - 📄 `ExpenseRepository.swift`
  - 📂 `ViewModels/`
    - 📄 `AuthViewModel.swift`
    - 📄 `ExpenseListViewModel.swift`
  - 📂 `Views/`
    - 📄 `LoginView.swift`
    - 📄 `RegisterView.swift`
    - 📄 `ExpenseListView.swift`
    - 📄 `AddExpenseView.swift`
    - 📄 `ExpenseChartView.swift`
```

---

## 📊 Bước 4: Giám sát Trực quan trên Agent Manager UI

Khi lệnh thực thi được chạy, bạn hãy mở **Antigravity Desktop App** để quan sát luồng xử lý trực quan:

1. **Thinking Mode Visualizer**: Bạn sẽ nhìn thấy một đồ thị các node suy nghĩ của Agent. Gemini 3.5 Flash sẽ hiển thị các bước "đọc đề bài", "phân tích kiến trúc", "kiểm tra tính hợp lệ của tích hợp Firebase SDK" và "sinh cấu trúc file".
2. **Token Monitoring**: Giao diện hiển thị trực quan lượng token đã tiêu thụ:
   - *Input tokens*: ~4,500 tokens (bao gồm System Instructions + cấu trúc thư mục Xcode mẫu).
   - *Output tokens*: ~1,200 tokens (bản thiết kế chi tiết).
   - *Latency (Độ trễ)*: ~6.2 giây.
3. **Shared Memory Context**: Architect Agent sau khi hoàn thành nhiệm vụ sẽ tự động ghi bản thiết kế này vào vùng nhớ dùng chung **Shared Context Layer** (lưu tại `.antigravity/shared/context.json`) để các agent tiếp theo như *SwiftUI Agent* hay *Data Agent* kế thừa dữ liệu mà không cần người dùng cấu hình lại.

---

## 🎉 Tổng kết Phần 2

Tuyệt vời! Bạn đã khởi tạo, cấu hình và vận hành thành công **Architect Agent** đầu tiên của mình. Sức mạnh suy luận của Gemini 3.5 Flash đã giúp bạn tự động hóa hoàn toàn khâu lên spec kỹ thuật và thiết kế hệ thống chỉ trong vài giây.

👉 **Bước tiếp theo:** Hãy chuyển sang [Phần 3: Multi-Agent System](./multi-agent-system) để học cách kết nối và điều phối **16 specialized agents** chạy song song tạo nên một hệ thống tự động hóa khép kín toàn diện!
