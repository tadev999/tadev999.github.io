# tadev999.github.io - Blog & Documentation Platform 🚀

Đây là mã nguồn của trang web cá nhân và hệ thống tài liệu kỹ thuật của **tadev999**. Được xây dựng dựa trên framework **Astro** và thiết kế hiện đại, trang web tối ưu hoá hiệu suất tối đa (Static Site Generation), chuẩn SEO, hỗ trợ tìm kiếm tĩnh và tích hợp hệ thống quản lý nội dung (CMS) chạy trực tiếp trên trình duyệt từ mọi thiết bị.

---

## 🔥 Các Tính Năng Nổi Bật

### 📰 1. Hệ thống Blog
*   **Hỗ trợ Markdown & MDX**: Soạn thảo bài viết linh hoạt với định dạng Markdown tiêu chuẩn hoặc MDX (Components trong Markdown).
*   **Tự động tạo ảnh Cover (Dynamic OG Image)**: Tự động sinh ảnh Open Graph cá nhân hoá cho từng bài viết để tối ưu chia sẻ mạng xã hội.
*   **Hệ thống thẻ (Tags)**: Phân loại bài viết theo chủ đề dễ dàng.
*   **Phân trang & Lưu trữ (Pagination & Archives)**: Quản lý số lượng lớn bài viết khoa học.
*   **RSS Feed & Sitemap**: Tự động cập nhật Sitemap và cấp RSS cho các trình đọc tin tức.

### 📚 2. Hệ thống Tài liệu Nhiều Cấp (Nextra-Style Docs)
*   **Tự động sinh Menu từ thư mục**: Tự động quét cấu trúc thư mục lồng nhau trong `src/data/docs/` để tạo Sidebar điều hướng.
*   **Menu lồng nhau (Multi-level menus)**: Hỗ trợ tạo thư mục lồng nhau không giới hạn cấp độ.
*   **Cấu hình thư mục bằng `_meta.json`**:
    *   Đặt tên hiển thị tùy chỉnh cho các thư mục trên Menu.
    *   Tùy chỉnh thứ tự hiển thị (Ordering) của các chương/bài viết.
    *   Ẩn các trang nháp (`hidden`).

### 🔐 3. Trang Quản Trị Nội Dung Vân Tay (`/admin` - Cloud Git CMS)
Một hệ thống quản lý nội dung (CMS) tự xây dựng tối giản nhưng vô cùng mạnh mẽ được nhúng trực tiếp tại route `/admin`:
*   **Viết bài ở mọi nơi**: Hoạt động 100% phía máy khách (Client-side SPA). Bạn có thể viết bài từ điện thoại, máy tính bảng, máy tính công ty hay khách sạn mà không cần mở code.
*   **Xác thực an toàn**: Sử dụng **GitHub Personal Access Token (PAT)** được lưu trữ cục bộ trong trình duyệt của bạn (`localStorage`). Tuyệt đối không lưu trữ hay gửi token qua máy chủ trung gian nào khác.
*   **Xem trước trực quan (Live Preview)**: Chia đôi màn hình soạn thảo Markdown và xem trước giao diện HTML hiển thị chuẩn xác theo thời gian thực.
*   **Quản lý Menu tự động**:
    *   Cho phép chọn thư mục cha hoặc tạo nhanh thư mục Docs con mới trực tiếp từ CMS.
    *   Tự động sinh và cập nhật file cấu hình `_meta.json` trên GitHub để đồng bộ thứ tự (`order`) và tiêu đề thư mục ngay khi bạn lưu hoặc xoá bài.
*   **Tự động Deploy**: Khi bạn nhấn **Lưu Bài Viết** hoặc **Xoá bài**, CMS sẽ commit trực tiếp lên kho chứa GitHub, kích hoạt **GitHub Actions** tự động biên dịch và cập nhật trang web sau 1-2 phút.

---

## 🛠️ Hướng dẫn cài đặt & Chạy dưới local

### 1. Yêu cầu hệ thống
*   Đã cài đặt **Node.js** (Khuyên dùng v18 hoặc mới hơn).
*   Công cụ quản lý gói **pnpm** hoặc **npm**.

### 2. Khởi chạy dự án
Chạy các lệnh sau trong thư mục dự án:

```bash
# Cài đặt các thư viện phụ thuộc
npm install

# Khởi chạy server phát triển local
npm run dev
```

Truy cập trang web local tại địa chỉ `http://localhost:4321`.

### 3. Biên dịch Production
Để kiểm tra phiên bản build tối ưu hoá hoặc chuẩn bị deploy thủ công:

```bash
npm run build
```
Sản phẩm biên dịch tĩnh sẽ nằm trong thư mục `/dist`.

---

## 📂 Cấu Trúc Thư Mục Dự Án

```bash
/
├── .github/workflows/
│   └── deploy.yml            # Luồng GitHub Actions tự động deploy lên GitHub Pages
├── public/                   # Thư mục chứa tài nguyên tĩnh (ảnh, favicon, pagefind index)
├── src/
│   ├── components/           # Các component tái sử dụng (Header, Footer, Sidebar, Card...)
│   ├── data/
│   │   ├── blog/             # Nơi lưu trữ các file Markdown bài viết Blog (.md)
│   │   └── docs/             # Nơi lưu trữ tài liệu Docs chia theo thư mục và file _meta.json
│   ├── layouts/              # Giao diện khung (Layout chung cho Blog và Docs)
│   ├── pages/
│   │   ├── admin.astro       # Trang quản trị nội dung CMS tại route /admin
│   │   ├── index.astro       # Trang chủ website
│   │   └── ...               # Các trang tĩnh khác (Search, Tags, RSS...)
│   ├── styles/               # File cấu hình CSS (sử dụng TailwindCSS v4)
│   └── utils/                # Các bộ tiện ích xử lý logic, quét file hệ thống sinh menu
├── astro.config.ts           # Cấu hình dự án Astro
└── package.json              # Khai báo thư viện và script chạy
```

---

## 📝 Quy trình viết bài qua Trang Quản Trị (`/admin`)

1. **Khởi tạo quyền**: Truy cập [GitHub Developer Settings](https://github.com/settings/tokens) tạo một **Personal Access Token (classic)** tick chọn quyền **`repo`**.
2. **Đăng nhập**: Mở trang `https://tadev999.github.io/admin` (hoặc chạy dev local tại `/admin`), nhập đoạn token được tạo ở bước 1.
3. **Soạn thảo**:
    *   **Blog**: Nhập Tiêu đề, Mô tả, Tags (gõ và bấm Enter để tạo tag mới) và viết nội dung.
    *   **Docs**: Chọn thư mục lưu trữ (hoặc tạo thư mục mới), nhập số thứ tự và viết nội dung.
    *   **Commit Message**: Bạn có thể điền thông điệp commit hoặc để trống để CMS tự động sinh thông điệp mặc định.
4. **Lưu & Xuất bản**: Bấm **Lưu Bài Viết**. Đợi 1-2 phút để GitHub Actions chạy build xong, bài viết sẽ hiển thị trên trang web chính thức của bạn!

---

## 📜 Giấy Phép & Tác Giả

*   Giao diện gốc dựa trên dự án mã nguồn mở **AstroPaper**.
*   Được tuỳ biến, tích hợp hệ thống **Docs lồng nhau** và **Cloud Git CMS** bởi **tadev999**.
*   Giấy phép mã nguồn: **MIT License**.
