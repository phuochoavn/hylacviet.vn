# Roadmap: Tái cấu trúc Trang chủ "Digital Atelier" (MAI ĐO)

**Mục tiêu:** Chuyển đổi từ giao diện E-commerce truyền thống sang trải nghiệm **Triển lãm Số (Digital Atelier)**.
**Đối tượng:** Nhà thiết kế thời trang trẻ (25 tuổi), dòng sản phẩm Áo Dài & Pháp Phục.
**Số lượng sản phẩm:** < 10 (Luxury/Boutique).

## 1. Triết lý Thiết kế (Design Philosophy)
*   **Từ khóa:** Tĩnh tại (Zen), Bay bổng (Flow), Cá nhân hóa (Personal), Tôn vinh (Celebrate).
*   **Bố cục:** Tạp chí (Editorial Layout). Không dùng lưới dày đặc. Tăng khoảng trắng.
*   **Trải nghiệm:** Kể chuyện (Storytelling) thay vì Bán hàng (Selling).

## 2. Cấu trúc Trang chủ Mới (New Structure)

### 2.1 Hero Section: "Lời chào của sự Tĩnh Lặng"
*   **Hiện tại:** Chữ text trên nền màu. Khô khan.
*   **Thay đổi:**
    *   **Visual:** Hình ảnh tràn màn hình (Full-viewport). Nếu không có video, dùng kỹ thuật "Ken Burns effect" (zoom chậm vào ảnh) để tạo động.
    *   **Nội dung:** Tên thương hiệu "MAI ĐO" nhỏ, tinh tế. Slogan "Di sản trong hơi thở đương đại".
    *   **Cảm xúc:** Bước vào một không gian khác, tách biệt khỏi sự ồn ào.

### 2.2 Introduction: "Chân dung Nhà thiết kế" (New Section)
*   **Mục đích:** Khẳng định thương hiệu cá nhân.
*   **Bố cục:**
    *   Một bên là ảnh chân dung (hoặc ảnh đang làm việc: vẽ, đo vải) - *Tạm thời dùng placeholder nghệ thuật*.
    *   Một bên là tâm thư/triết lý thiết kế. Font chữ Serif (có chân) nghiêng, như chữ viết tay.
*   **Thông điệp:** "Mỗi tấm áo là một cuộc đối thoại giữa quá khứ và hiện tại."

### 2.3 The Spotlight: "Tác phẩm Tiêu biểu" (Thay thế Featured Products)
*   **Hiện tại:** Lưới sản phẩm nhỏ.
*   **Thay đổi:**
    *   Chọn ra **01 sản phẩm đẹp nhất** (Signature Item).
    *   Hiển thị khổ lớn.
    *   Phân tích chi tiết: Chất liệu vải, kỹ thuật thêu, ý nghĩa hoa văn.
    *   Nút CTA: "Chiêm ngưỡng chi tiết" thay vì "Mua ngay".

### 2.4 The Collection: "Dạo bước trong vườn lụa" (Horizontal Scroll)
*   **Giữ lại:** Cơ chế cuộn ngang (đang làm tốt).
*   **Cải tiến:**
    *   Thẻ sản phẩm (Card) làm to hơn.
    *   Bỏ khung viền, để ảnh tràn ra (Bleed layout).
    *   Làm mờ nền xung quanh để tập trung vào sản phẩm.

## 3. Kế hoạch Triển khai Kỹ thuật

### Bước 1: Chuẩn bị Assets (Tài nguyên)
*   Do chưa có ảnh thật của khách, sẽ sử dụng bộ Placeholder nghệ thuật (Gradient/Abstract hoặc ảnh kho có bản quyền miễn phí phù hợp mood).
*   Tạo các Component mới: `CinematicHero`, `DesignerStatement`, `SpotlightShowcase`.

### Bước 2: Refactor Code (`ModernZenHome.tsx`)
*   Loại bỏ `HeroSection` cũ.
*   Thêm section `DesignerStatement`.
*   Chuyển `CollectionPreview` sang chế độ "Immersive".

### Bước 3: Đánh bóng (Polish)
*   Thêm hiệu ứng `Framer Motion`: Text xuất hiện từng dòng, ảnh float nhẹ.
*   Tối ưu Typography: Tăng kích thước font tiêu đề, giãn dòng cho font nội dung.

## 4. Dự kiến Kết quả
Trang web sẽ không còn giống một trang bán hàng online nữa. Nó sẽ giống một **Portfolio điện tử**, nơi khách hàng vào để ngắm nhìn và cảm nhận gu thẩm mỹ của người chủ, từ đó nảy sinh mong muốn sở hữu sản phẩm độc bản.
