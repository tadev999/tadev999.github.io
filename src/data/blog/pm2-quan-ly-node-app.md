---
title: PM2 - Giữ cho Node.js app của bạn chạy mãi không ngừng nghỉ
author: TaDev
pubDatetime: 2024-02-20T09:00:00Z
featured: false
draft: false
tags:
  - nodejs
  - pm2
  - devops
  - deployment
  - aws
description: Hướng dẫn sử dụng PM2 để quản lý Node.js app như một pro - từ cài đặt, chạy app, đến monitoring và auto-restart. Không còn lo app bị crash nữa!
---

Bạn có bao giờ deploy Node.js app lên server rồi... đi ngủ, sáng dậy thấy app die không? Hoặc server restart mà app không tự động chạy lại? Nếu có, thì PM2 chính là thứ bạn cần!

PM2 là một process manager cực kỳ phổ biến cho Node.js, giúp bạn chạy app như một service thực thụ - tự động restart khi crash, tự động chạy lại sau khi server reboot, và còn nhiều tính năng hay ho khác nữa.

Hôm nay mình sẽ hướng dẫn các bạn sử dụng PM2 từ cơ bản đến nâng cao. Đi thôi!

![PM2 Process Manager](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80)
*Ảnh minh họa: Quản lý processes như một pro với PM2*

## Table of contents

## PM2 là gì và tại sao bạn cần nó?

PM2 (Process Manager 2) là một production process manager cho Node.js applications. Nói đơn giản, nó giúp bạn:

- ✅ **Chạy app như một service** - Không cần mở terminal và giữ nó chạy
- ✅ **Auto-restart khi crash** - App bị lỗi? PM2 tự động khởi động lại
- ✅ **Tự động chạy sau reboot** - Server restart? App vẫn tự động chạy lại
- ✅ **Load balancing** - Chạy nhiều instances để tận dụng multi-core CPU
- ✅ **Monitoring** - Xem CPU, memory usage real-time
- ✅ **Log management** - Quản lý logs dễ dàng

Nghe có vẻ ngon phải không? Bắt đầu thôi!

## Bước 1: Cài đặt PM2

Cài PM2 global bằng npm (hoặc yarn nếu bạn thích):

```bash
npm install -g pm2
```

Hoặc với yarn:

```bash
yarn global add pm2
```

Kiểm tra xem đã cài thành công chưa:

```bash
pm2 --version
```

Nếu thấy version hiện ra là OK rồi! 🎉

![Terminal Setup](https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80)
*Cài đặt PM2 chỉ với một dòng lệnh đơn giản*

## Bước 2: Chạy app với PM2

### Cách 1: Chạy trực tiếp file Node.js

Nếu bạn có file `app.js` hoặc `index.js`:

```bash
pm2 start app.js --name "my-app"
```

### Cách 2: Chạy với npm script (Recommended)

Nếu bạn thường chạy app bằng `npm start`:

```bash
pm2 start npm --name "my-app" -- start
```

Giải thích một chút:
- `npm` - Chạy npm command
- `--name "my-app"` - Đặt tên cho process (để dễ quản lý)
- `-- start` - Arguments truyền cho npm (tức là `npm start`)

### Cách 3: Chạy với ecosystem file (Pro level)

Tạo file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'npm',
    args: 'start',
    instances: 2, // Chạy 2 instances
    exec_mode: 'cluster', // Cluster mode để load balancing
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false, // Không watch files trong production
    max_memory_restart: '1G' // Restart nếu dùng quá 1GB RAM
  }]
};
```

Sau đó chạy:

```bash
pm2 start ecosystem.config.js
```

Cách này pro hơn vì bạn có thể config mọi thứ trong file, dễ quản lý và version control!

## Bước 3: Tự động khởi động sau khi reboot

Đây là phần quan trọng! Nếu không làm bước này, khi server restart thì app của bạn sẽ không tự động chạy lại.

### 3.1 Tạo startup script

```bash
pm2 startup
```

PM2 sẽ in ra một dòng lệnh, copy và chạy nó. Ví dụ:

```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-username --hp /home/your-username
```

### 3.2 Save danh sách processes

Sau khi đã start tất cả apps, chạy:

```bash
pm2 save
```

Lệnh này sẽ lưu lại danh sách các processes đang chạy. Khi server restart, PM2 sẽ tự động chạy lại các processes này.

**Lưu ý:** Mỗi khi bạn thêm/xóa app, nhớ chạy `pm2 save` lại nhé!

![Server Monitoring](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)
*Monitoring app của bạn 24/7 với PM2*

## Bước 4: Quản lý app

### Xem danh sách apps đang chạy

```bash
pm2 list
# hoặc
pm2 ls
```

Bạn sẽ thấy bảng đẹp đẽ với thông tin về tất cả apps:
- ID
- Name
- Status (online/stopped/errored)
- CPU usage
- Memory usage
- Uptime

### Xem thông tin chi tiết

```bash
pm2 show my-app
```

Lệnh này hiển thị mọi thông tin về app: path, arguments, environment variables, logs location, v.v.

### Restart app

```bash
pm2 restart my-app
```

Hoặc restart tất cả:

```bash
pm2 restart all
```

### Stop app

```bash
pm2 stop my-app
```

### Delete app khỏi PM2

```bash
pm2 delete my-app
```

### Reload app (zero-downtime)

```bash
pm2 reload my-app
```

`reload` khác với `restart` ở chỗ nó sẽ reload từng instance một, đảm bảo luôn có ít nhất một instance đang chạy. Rất hữu ích cho production!

## Bước 5: Xem logs

### Xem logs real-time

```bash
pm2 logs
```

Xem logs của một app cụ thể:

```bash
pm2 logs my-app
```

Xem chỉ error logs:

```bash
pm2 logs my-app --err
```

### Xóa logs cũ

```bash
pm2 flush
```

Lệnh này xóa tất cả logs. Hữu ích khi logs quá nhiều làm đầy ổ cứng.

![Logs Monitoring](https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&q=80)
*Theo dõi logs real-time để debug nhanh chóng*

## Bước 6: Monitoring

### Monitoring trong terminal

```bash
pm2 monit
```

Lệnh này mở một dashboard real-time trong terminal, hiển thị:
- CPU usage
- Memory usage
- Logs stream

Rất tiện để theo dõi app!

### Web-based monitoring (PM2 Plus)

PM2 có service monitoring trên web (trước đây gọi là Keymetrics):

```bash
pm2 link [secret-key] [public-key]
```

Bạn có thể đăng ký miễn phí tại [pm2.io](https://pm2.io) để có dashboard đẹp mắt trên web.

## Tips và tricks từ kinh nghiệm thực tế

### 1. Sử dụng cluster mode để tận dụng multi-core

```bash
pm2 start app.js -i max
```

`-i max` sẽ tạo số instances bằng số CPU cores. Ví dụ server có 4 cores thì sẽ chạy 4 instances.

### 2. Giới hạn memory để tránh memory leak

```bash
pm2 start app.js --max-memory-restart 500M
```

App sẽ tự động restart nếu dùng quá 500MB RAM. Rất hữu ích để handle memory leaks!

### 3. Watch mode cho development

```bash
pm2 start app.js --watch
```

PM2 sẽ tự động restart app khi có file thay đổi. Tiện cho development, nhưng **đừng dùng trong production** nhé!

### 4. Cron restart

Restart app vào thời điểm cố định:

```bash
pm2 start app.js --cron-restart="0 0 * * *"
```

Lệnh này restart app lúc 00:00 mỗi ngày. Hữu ích nếu app có memory leak nhẹ.

### 5. Update PM2

```bash
pm2 update
```

Chạy lệnh này sau khi update PM2 để đảm bảo daemon được update.

## Troubleshooting - Những lỗi thường gặp

### App không tự động start sau reboot

- Kiểm tra đã chạy `pm2 startup` và `pm2 save` chưa
- Thử chạy lại `pm2 startup` và copy/paste lệnh nó in ra
- Kiểm tra `pm2 list` xem app có trong danh sách không

### App bị restart liên tục

- Xem logs: `pm2 logs my-app`
- Có thể app bị crash ngay khi start
- Kiểm tra environment variables, database connection, v.v.

### PM2 dùng quá nhiều memory

- Xóa logs cũ: `pm2 flush`
- Giảm số instances nếu đang chạy quá nhiều
- Update PM2 lên version mới nhất

![Success Deployment](https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80)
*Deploy thành công! App chạy ổn định 24/7*

## Kết luận

PM2 là một công cụ không thể thiếu khi bạn deploy Node.js app lên production. Nó giúp app của bạn chạy ổn định, tự động recover khi có lỗi, và dễ dàng quản lý.

Tóm tắt các lệnh quan trọng:

```bash
# Cài đặt
npm install -g pm2

# Chạy app
pm2 start npm --name "my-app" -- start

# Setup auto-start
pm2 startup
pm2 save

# Quản lý
pm2 list
pm2 restart my-app
pm2 logs my-app
pm2 monit

# Update PM2
pm2 update
```

Một vài best practices cuối cùng:

1. **Luôn dùng ecosystem file** cho production - dễ quản lý và version control
2. **Setup monitoring** - Dùng PM2 Plus hoặc tích hợp với monitoring tools khác
3. **Giới hạn memory** - Tránh app dùng hết RAM server
4. **Backup logs** - Logs rất quan trọng cho debugging
5. **Test trước khi deploy** - Test kỹ trên staging trước khi lên production

Chúc bạn deploy thành công! Nếu có thắc mắc gì về PM2, cứ để lại comment nhé! 🚀

---

*Bài viết được viết dựa trên kinh nghiệm thực tế deploy hàng chục Node.js apps lên production. Nếu thấy hữu ích, đừng quên chia sẻ cho team nhé!*
