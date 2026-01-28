# Báo Cáo Kỹ Thuật & Roadmap - 27/01/2026

## 1. Các Vấn Đề Đã Giải Quyết (Resolved Issues)

### ✅ Vấn Đề 1: Lỗi 401 Unauthorized (Admin Dashboard)
- **Triệu chứng:** Không thể đăng nhập hoặc bị đăng xuất liên tục, API trả về 401 tại `/admin/users/me`.
- **Nguyên nhân gốc:** Traefik (Reverse Proxy) không chuyển tiếp đúng header `X-Forwarded-Proto: https` cho Medusa. Medusa nhận diện request là `http` (không an toàn) nên từ chối cookie có cờ `Secure`.
- **Giải pháp đã áp dụng:**
  - Cấu hình `trustedIPs` cho Cloudflare trong `traefik.yml` để Traefik tin tưởng và chuyển tiếp headers.
  - Đảm bảo `trustProxy: true` trong `medusa-config.ts`.
  - Cố định `COOKIE_SECRET` trong `.env`.

### ✅ Vấn Đề 2: Giới Hạn Upload File 1MB
- **Triệu chứng:** Không thể upload ảnh sản phẩm >1MB, báo lỗi "One or more files exceed the maximum file size of 1MB".
- **Nguyên nhân gốc (2 lớp):**
  1. **Backend:** Middleware mặc định không cấu hình limit cho route `/admin/products/:id/media`.
  2. **Frontend:** Component `FileUpload` của Medusa Admin UI có validation hardcode client-side là 1MB.
- **Giải pháp đã áp dụng:**
  - **Backend:** Thêm middleware config cho `/admin/products/:id/media` và `/admin/uploads/*` với giới hạn **50MB**.
  - **Frontend:** Tạo bản patch Override cho component `FileUpload` nâng giới hạn lên **50MB**.
  - **Build:** Cập nhật `Dockerfile` để copy bản patch vào `node_modules` trước khi build và chạy build `--no-cache`.

---

## 2. Roadmap Tiếp Theo (Pending)

### 🚀 Giai đoạn 4: Tối Ưu Hóa Hiệu Năng (Performance Optimization)
Hiện tại trang web vẫn load chậm bất thường. Cần tập trung vào:

1.  **Frontend Bundling:**
    - Kiểm tra xem Admin Dashboard có đang được build tối ưu (chunk splitting) hay không.
    - Xác nhận `medusa-server` container đang chạy đúng chế độ production với các aset đã build sẵn (Shadow Project architecture).

2.  **Caching Strategy:**
    - Kiểm tra cấu hình Redis Cache cho các query nặng.
    - Cấu hình Cache Headers cho static assets (JS, CSS, Images) để browser cache hiệu quả hơn.

3.  **Storefront Optimization:**
    - (Nếu áp dụng) Kiểm tra Next.js Image Optimization.
    - Review các request blocking main thread khi trang vừa load.

---

## 3. Hướng Dẫn Kỹ Thuật (Cho Dev)
Nếu cần rebuild hệ thống trong tương lai, vui lòng tuân thủ:

1.  **Luôn dùng Dockerfile hiện tại:** Đã bao gồm code copy overrides cho Frontend.
2.  **Lệnh Build:**
    ```bash
    # Khuyến nghị dùng --no-cache khi có thay đổi liên quan đến Admin UI override
    docker compose build --no-cache medusa-server
    docker compose up -d medusa-server
    ```
3.  **Traefik:** Không sửa `traefik.yml` phần `trustedIPs` nếu không hiểu rõ về Cloudflare IP ranges.
