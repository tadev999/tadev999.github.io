---
title: Sử dụng Flutter Version Manager (FVM) - Quản lý nhiều phiên bản Flutter dễ dàng
author: TaDev
pubDatetime: 2024-01-10T14:00:00Z
featured: false
draft: false
tags:
  - flutter
  - fvm
  - tools
  - development
description: Hướng dẫn nhanh sử dụng FVM để quản lý nhiều phiên bản Flutter trong cùng một máy. Chuyển đổi giữa các version chỉ với vài dòng lệnh!
---

Bạn có nhiều Flutter projects, mỗi project dùng một version Flutter khác nhau? Việc cài đặt và chuyển đổi giữa các version thủ công khá mệt mỏi. FVM (Flutter Version Manager) sinh ra để giải quyết vấn đề này!

![Flutter Development](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80)
*Quản lý nhiều phiên bản Flutter dễ dàng với FVM*

## Table of contents

## FVM là gì?

FVM (Flutter Version Manager) là công cụ giúp bạn:

- ✅ Cài đặt và quản lý nhiều phiên bản Flutter
- ✅ Chuyển đổi nhanh giữa các versions
- ✅ Mỗi project có thể dùng version riêng
- ✅ Không ảnh hưởng đến Flutter global

## Cài đặt FVM

Cài đặt FVM global bằng Dart:

```bash
dart pub global activate fvm
```

Kiểm tra đã cài thành công:

```bash
fvm --version
```

## Sử dụng FVM cho project

### 1. Cài đặt Flutter version

Ví dụ cài Flutter 3.24.5 (version ổn định cuối của 3.24.x):

```bash
fvm install 3.24.5
```

FVM sẽ tải và cài đặt version này vào thư mục riêng.

### 2. Sử dụng version cho project

Trong thư mục project, chạy:

```bash
fvm use 3.24.5
```

Lệnh này tạo file `.fvm/fvm_config.json` trong project để lưu version đang dùng.

### 3. Chạy Flutter commands

Sau khi đã setup, thêm `fvm` trước các lệnh Flutter:

```bash
# Build APK debug
fvm flutter build apk --debug

# Run app
fvm flutter run

# Get packages
fvm flutter pub get

# Clean project
fvm flutter clean
```

![Terminal Commands](https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80)
*Chạy Flutter commands với FVM prefix*

## Các lệnh FVM hữu ích

### Xem danh sách versions đã cài

```bash
fvm list
```

### Xem version đang dùng trong project

```bash
fvm use
```

### Cài version mới nhất

```bash
fvm install stable
```

### Xóa version không dùng

```bash
fvm remove 3.24.5
```

### Xem tất cả versions có sẵn

```bash
fvm releases
```

## Setup IDE (VS Code / Android Studio)

### VS Code

Thêm vào `.vscode/settings.json`:

```json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk",
  "search.exclude": {
    "**/.fvm": true
  },
  "files.watcherExclude": {
    "**/.fvm": true
  }
}
```

### Android Studio

1. Preferences → Languages & Frameworks → Flutter
2. Flutter SDK path: `[project-path]/.fvm/flutter_sdk`

## Tips nhỏ

**1. Thêm .fvm vào .gitignore:**

```gitignore
.fvm/flutter_sdk
```

Nhưng **commit** file `.fvm/fvm_config.json` để team cùng dùng chung version.

**2. Tạo alias cho tiện:**

Thêm vào `.bashrc` hoặc `.zshrc`:

```bash
alias fl="fvm flutter"
alias flr="fvm flutter run"
alias flb="fvm flutter build"
```

Giờ bạn có thể gõ `flr` thay vì `fvm flutter run`!

![Success](https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80)
*Quản lý Flutter versions như một pro!*

## Kết luận

FVM giúp việc quản lý nhiều phiên bản Flutter trở nên đơn giản. Đặc biệt hữu ích khi:

- Bạn maintain nhiều projects với các Flutter versions khác nhau
- Team cần đảm bảo mọi người dùng cùng version
- Bạn muốn test app trên nhiều Flutter versions

Tóm tắt các lệnh quan trọng:

```bash
# Cài FVM
dart pub global activate fvm

# Cài Flutter version
fvm install 3.24.5

# Dùng version cho project
fvm use 3.24.5

# Chạy Flutter commands
fvm flutter [command]
```

Đơn giản vậy thôi! Chúc bạn code Flutter vui vẻ! 🚀

---

*Bài viết ngắn gọn nhưng đủ để bạn bắt đầu với FVM. Nếu có thắc mắc, cứ để lại comment nhé!*
