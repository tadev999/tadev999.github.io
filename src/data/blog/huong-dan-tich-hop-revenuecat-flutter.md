---
title: Hướng dẫn tích hợp RevenueCat cho Flutter - Kiếm tiền từ app không còn là chuyện khó
author: TaDev
pubDatetime: 2024-03-15T10:00:00Z
featured: true
draft: false
tags:
  - flutter
  - revenuecat
  - in-app-purchase
  - monetization
description: Hướng dẫn chi tiết cách tích hợp RevenueCat vào Flutter app để xử lý in-app purchase trên iOS và Android một cách dễ dàng. Từ setup đến code, mọi thứ đều có trong bài này!
---

Nếu bạn đang làm app Flutter và muốn kiếm tiền từ in-app purchase (IAP), chắc hẳn bạn đã từng nghe đến RevenueCat. Đây là một công cụ tuyệt vời giúp bạn quản lý subscription và IAP mà không cần phải vật lộn với những API phức tạp của Apple và Google.

Hôm nay mình sẽ hướng dẫn các bạn tích hợp RevenueCat vào Flutter app từ A đến Z. Đừng lo, mình sẽ viết thật chi tiết và dễ hiểu nhé!

![RevenueCat Integration](https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80)
*Ảnh minh họa: Kiếm tiền từ app không còn khó nữa với RevenueCat*

## Table of contents

## 1. Chuẩn bị - Những thứ bạn cần có trước khi bắt đầu

### 1.1 Tạo tài khoản RevenueCat

Đầu tiên, bạn cần có tài khoản RevenueCat. Đừng lo, họ có gói miễn phí cho những app nhỏ mà:

- Truy cập [RevenueCat Dashboard](https://app.revenuecat.com)
- Đăng ký tài khoản miễn phí (chỉ cần email thôi)
- Tạo project mới cho ứng dụng của bạn

### 1.2 Cấu hình App Store Connect (iOS)

Phần này hơi mệt một chút, nhưng bắt buộc phải làm nếu bạn muốn bán hàng trên iOS:

1. Đăng nhập vào [App Store Connect](https://appstoreconnect.apple.com)
2. Tạo app mới hoặc chọn app hiện có
3. Vào phần **Features → In-App Purchases**
4. Tạo các sản phẩm in-app purchase (Auto-Renewable Subscriptions hoặc Non-Consumable)
5. **Quan trọng:** Lưu lại **Product ID** của từng sản phẩm (ví dụ: `premium_monthly`, `premium_yearly`)

![App Store Connect](https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80)
*Giao diện App Store Connect - nơi bạn tạo các sản phẩm IAP*

### 1.3 Cấu hình Google Play Console (Android)

Tương tự với iOS, bạn cũng cần setup trên Google Play:

1. Đăng nhập vào [Google Play Console](https://play.google.com/console)
2. Chọn app của bạn
3. Vào **Monetize → Products → In-app products** hoặc **Subscriptions**
4. Tạo các sản phẩm tương ứng với iOS
5. Lưu lại **Product ID** (nên giống với iOS cho dễ quản lý)

## 2. Cài đặt và cấu hình RevenueCat

### 2.1 Thêm dependency vào Flutter

Mở file `pubspec.yaml` và thêm package RevenueCat:

```yaml
dependencies:
  purchases_flutter: ^6.20.0
```

Sau đó chạy lệnh:

```bash
flutter pub get
```

### 2.2 Cấu hình iOS

#### 2.2.1 Thêm Capabilities trong Xcode

1. Mở project iOS trong Xcode (mở file `.xcworkspace` nhé, không phải `.xcodeproj`)
2. Chọn target app của bạn
3. Vào tab **Signing & Capabilities**
4. Click nút **+ Capability** và thêm **In-App Purchase**

![Xcode Capabilities](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80)
*Thêm In-App Purchase capability trong Xcode*

#### 2.2.2 Cấu hình StoreKit (iOS 15+)

Nếu bạn muốn test trên simulator (rất tiện), hãy tạo file StoreKit:

1. Trong Xcode: **File → New → File → StoreKit Configuration File**
2. Đặt tên file là `Products.storekit`
3. Thêm các sản phẩm với Product ID tương ứng

### 2.3 Cấu hình Android

#### 2.3.1 Thêm Permissions

Mở file `android/app/src/main/AndroidManifest.xml` và thêm:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
<uses-permission android:name="android.permission.INTERNET" />
```

#### 2.3.2 ProGuard (nếu bạn dùng)

Nếu app của bạn có bật ProGuard, thêm rule này vào `android/app/proguard-rules.pro`:

```proguard
-keep class com.revenuecat.purchases.** { *; }
```

## 3. Cấu hình RevenueCat Dashboard

### 3.1 Tạo App trong RevenueCat

1. Trong RevenueCat Dashboard, chọn **Apps**
2. Thêm app mới cho iOS và Android
3. Điền **Bundle ID** (iOS) và **Package Name** (Android)

### 3.2 Cấu hình Products

1. Vào **Products** trong dashboard
2. Thêm các sản phẩm với Product ID từ App Store và Google Play
3. **Lưu ý:** Product ID phải khớp chính xác, sai một ký tự là không hoạt động đâu nhé!

### 3.3 Tạo Offerings

Offerings là cách RevenueCat nhóm các sản phẩm lại với nhau. Ví dụ bạn có thể tạo offering "Premium" với 2 packages: monthly và yearly.

1. Vào **Offerings**
2. Tạo offering mới (ví dụ: `premium_subscription`)
3. Thêm các packages với sản phẩm đã tạo

### 3.4 Lấy API Keys

1. Vào **API keys**
2. Copy **Public API key** cho iOS và Android
3. Lưu lại để sử dụng trong code (đừng share lên GitHub nhé!)

![RevenueCat Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80)
*RevenueCat Dashboard - nơi bạn quản lý mọi thứ*

## 4. Triển khai code Flutter - Phần thú vị nhất đây!

### 4.1 Khởi tạo RevenueCat

Tạo file `lib/services/revenuecat_service.dart`:

```dart
import 'dart:io';
import 'package:purchases_flutter/purchases_flutter.dart';

class RevenueCatService {
  static const String _apiKeyIOS = 'YOUR_IOS_API_KEY';
  static const String _apiKeyAndroid = 'YOUR_ANDROID_API_KEY';
  
  static Future<void> initialize() async {
    // Bật debug mode để dễ debug (nhớ tắt khi release nhé)
    await Purchases.setLogLevel(LogLevel.debug);
    
    PurchasesConfiguration configuration;
    if (Platform.isIOS) {
      configuration = PurchasesConfiguration(_apiKeyIOS);
    } else if (Platform.isAndroid) {
      configuration = PurchasesConfiguration(_apiKeyAndroid);
    } else {
      throw UnsupportedError('Platform not supported');
    }
    
    await Purchases.configure(configuration);
  }
}
```

### 4.2 Gọi khởi tạo trong main.dart

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    await RevenueCatService.initialize();
    print('RevenueCat initialized successfully! 🎉');
  } catch (e) {
    print('RevenueCat initialization failed: $e');
  }
  
  runApp(MyApp());
}
```

### 4.3 Lấy danh sách sản phẩm

Tạo file `lib/services/purchase_service.dart`:

```dart
import 'package:purchases_flutter/purchases_flutter.dart';

class PurchaseService {
  // Lấy tất cả offerings
  static Future<Offerings?> getOfferings() async {
    try {
      final offerings = await Purchases.getOfferings();
      return offerings;
    } catch (e) {
      print('Error getting offerings: $e');
      return null;
    }
  }
  
  // Lấy danh sách sản phẩm từ offering hiện tại
  static Future<List<StoreProduct>> getProducts() async {
    try {
      final offerings = await getOfferings();
      if (offerings?.current != null) {
        return offerings!.current!.availablePackages
            .map((package) => package.storeProduct)
            .toList();
      }
      return [];
    } catch (e) {
      print('Error getting products: $e');
      return [];
    }
  }
}
```

### 4.4 Thực hiện mua hàng

Thêm vào `PurchaseService`:

```dart
class PurchaseService {
  // ... code trước đó
  
  // Mua một package
  static Future<CustomerInfo?> purchasePackage(Package package) async {
    try {
      final customerInfo = await Purchases.purchasePackage(package);
      print('Purchase successful! 🎊');
      return customerInfo;
    } on PlatformException catch (e) {
      final errorCode = PurchasesErrorHelper.getErrorCode(e);
      
      if (errorCode == PurchasesErrorCode.purchaseCancelledError) {
        print('User cancelled purchase');
      } else if (errorCode == PurchasesErrorCode.paymentPendingError) {
        print('Payment pending - chờ xử lý');
      } else {
        print('Purchase error: ${e.message}');
      }
      return null;
    }
  }
  
  // Restore purchases (quan trọng cho iOS)
  static Future<CustomerInfo?> restorePurchases() async {
    try {
      final customerInfo = await Purchases.restorePurchases();
      print('Purchases restored! 🔄');
      return customerInfo;
    } catch (e) {
      print('Error restoring purchases: $e');
      return null;
    }
  }
}
```

### 4.5 Kiểm tra trạng thái subscription

```dart
class PurchaseService {
  // ... code trước đó
  
  // Kiểm tra user có premium không
  static Future<bool> isPremiumUser() async {
    try {
      final customerInfo = await Purchases.getCustomerInfo();
      // Nếu có bất kỳ entitlement nào active = user là premium
      return customerInfo.entitlements.active.isNotEmpty;
    } catch (e) {
      print('Error checking premium status: $e');
      return false;
    }
  }
  
  // Lấy thông tin chi tiết customer
  static Future<CustomerInfo?> getCustomerInfo() async {
    try {
      return await Purchases.getCustomerInfo();
    } catch (e) {
      print('Error getting customer info: $e');
      return null;
    }
  }
}
```

### 4.6 Widget hiển thị sản phẩm

Tạo màn hình để hiển thị các gói premium:

```dart
import 'package:flutter/material.dart';
import 'package:purchases_flutter/purchases_flutter.dart';
import 'package:your_app/services/purchase_service.dart';

class PurchaseScreen extends StatefulWidget {
  @override
  _PurchaseScreenState createState() => _PurchaseScreenState();
}

class _PurchaseScreenState extends State<PurchaseScreen> {
  List<Package> _packages = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadOfferings();
  }

  Future<void> _loadOfferings() async {
    try {
      final offerings = await PurchaseService.getOfferings();
      if (offerings?.current != null) {
        setState(() {
          _packages = offerings!.current!.availablePackages;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải sản phẩm: $e')),
      );
    }
  }

  Future<void> _purchasePackage(Package package) async {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Center(child: CircularProgressIndicator()),
    );
    
    final customerInfo = await PurchaseService.purchasePackage(package);
    
    // Hide loading
    Navigator.of(context).pop();
    
    if (customerInfo != null) {
      // Mua hàng thành công
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Mua hàng thành công! Chào mừng bạn đến với Premium 🎉'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.of(context).pop(); // Quay lại màn hình trước
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text('Gói Premium')),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Nâng cấp Premium'),
        actions: [
          TextButton(
            onPressed: () async {
              await PurchaseService.restorePurchases();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Đã khôi phục gói đã mua')),
              );
            },
            child: Text('Khôi phục', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: _packages.length,
        itemBuilder: (context, index) {
          final package = _packages[index];
          final product = package.storeProduct;
          
          return Card(
            elevation: 4,
            margin: EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.title,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    product.description,
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        product.priceString,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).primaryColor,
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () => _purchasePackage(package),
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                            horizontal: 32,
                            vertical: 12,
                          ),
                        ),
                        child: Text('Mua ngay'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
```

![Flutter App Purchase Screen](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80)
*Màn hình mua hàng trong app - đơn giản và dễ sử dụng*

## 5. Test và Debug - Đừng bỏ qua phần này!

### 5.1 Test trên iOS

- Sử dụng **TestFlight** hoặc **iOS Simulator**
- Test với **sandbox account** (tạo trong App Store Connect)
- Kiểm tra **StoreKit testing** trong Xcode (rất tiện cho việc test nhanh)

### 5.2 Test trên Android

- Sử dụng **internal testing track** trên Google Play Console
- Test với **test account** (thêm trong Google Play Console)
- Kiểm tra **Google Play Billing Library**

### 5.3 Debug thường gặp

Nếu gặp lỗi, hãy kiểm tra những điểm sau:

- ✅ API keys đúng platform chưa?
- ✅ Product IDs có khớp chính xác không? (case-sensitive đấy nhé)
- ✅ Bundle ID/Package name có đúng không?
- ✅ Xem logs trong RevenueCat Dashboard để biết chi tiết lỗi

## 6. Production Checklist - Trước khi release

### 6.1 Những việc cần làm

- [ ] Test tất cả luồng mua hàng (mua, hủy, restore)
- [ ] Test restore purchases (quan trọng cho iOS)
- [ ] Kiểm tra receipts trong RevenueCat Dashboard
- [ ] Test trên nhiều thiết bị khác nhau
- [ ] Đổi log level thành `LogLevel.info` hoặc `LogLevel.error`

```dart
// Trong production, đổi thành:
await Purchases.setLogLevel(LogLevel.info);
```

### 6.2 Monitoring

Sau khi release, đừng quên:

- Theo dõi **RevenueCat Dashboard** để xem analytics
- Kiểm tra **revenue** và **conversion rates**
- Monitor **customer support tickets** liên quan đến payment

## 7. Tính năng nâng cao

### 7.1 User Identification

Nếu app của bạn có hệ thống đăng nhập, nên link user với RevenueCat:

```dart
// Khi user đăng nhập
await Purchases.logIn('user_id_123');

// Khi user đăng xuất
await Purchases.logOut();
```

### 7.2 Promo Codes (iOS)

Cho phép user nhập promo code:

```dart
// Hiển thị sheet nhập promo code (chỉ iOS)
await Purchases.presentCodeRedemptionSheet();
```

### 7.3 Webhooks

Cấu hình webhooks trong RevenueCat Dashboard để nhận notifications về các sự kiện purchase. Rất hữu ích nếu bạn cần sync với backend của mình.

![Success](https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80)
*Thành công! App của bạn giờ đã có thể kiếm tiền rồi đấy!*

## Kết luận

Vậy là xong! Với hướng dẫn này, bạn đã có thể tích hợp hoàn chỉnh RevenueCat vào Flutter app của mình. RevenueCat giúp việc xử lý in-app purchase trở nên đơn giản hơn rất nhiều so với việc dùng trực tiếp API của Apple và Google.

Một vài tips cuối cùng từ kinh nghiệm của mình:

1. **Test kỹ trước khi release** - IAP là phần nhạy cảm, lỗi ở đây sẽ ảnh hưởng trực tiếp đến doanh thu
2. **Luôn có nút "Restore Purchases"** - Apple yêu cầu điều này và user cũng cần nó
3. **Monitor thường xuyên** - Theo dõi dashboard để phát hiện vấn đề sớm
4. **Đọc docs của RevenueCat** - Họ có docs rất chi tiết và hay

Chúc bạn thành công với app của mình! Nếu có thắc mắc gì, cứ để lại comment nhé! 🚀

---

*Bài viết được viết dựa trên kinh nghiệm thực tế và tài liệu chính thức của RevenueCat. Nếu thấy hữu ích, đừng quên chia sẻ cho đồng nghiệp nhé!*
