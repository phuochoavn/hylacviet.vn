# Thông tin Dự án / Project Audit Report

Báo cáo chi tiết về cấu trúc hệ thống, công nghệ nền tảng và kiến trúc triển khai hiện tại của dự án.

## 1. Thông tin Hạ tầng Máy chủ (VPS/Server Include)
*   **Hệ điều hành (OS):** Ubuntu 24.04 LTS (Linux Kernel 6.8.0-90-generic)
*   **Người dùng hệ thống:** `root` (với quyền quản trị cao nhất)
*   **Môi trường Runtime:**
    *   **Node.js:** v20.20.0
    *   **NPM:** 10.8.2
    *   **Docker:** v29.1.5 (Build 0e6fee6)
    *   **Docker Compose:** v5.0.1

## 2. Kiến trúc Ứng dụng (Application Stack)
Hệ thống được xây dựng theo kiến trúc Headless Commerce, tách biệt hoàn toàn Frontend và Backend.

### 2.1 Backend (MedusaJS)
*   **Framework:** Medusa v2.12.5
*   **Ngôn ngữ:** TypeScript
*   **Cơ sở dữ liệu:** PostgreSQL 16 (Alpine)
*   **Cache & Event Queue:** Redis 7.4 (Alpine)
*   **Storage (Lưu trữ ảnh/file):** MinIO (S3 Compatible)
*   **Chế độ chạy:** Phân tách thành 2 service riêng biệt để tối ưu hiệu năng:
    *   `medusa-server`: Xử lý API requests (Rest API / Admin Dashboard).
    *   `medusa-worker`: Xử lý background jobs (Queue, Scheduled Tasks).
*   **Công cụ Build:** Vite (được tích hợp trong Medusa v2)
*   **Cấu hình tài nguyên:**
    *   Server Limit: 3GB RAM
    *   Worker Limit: 800MB RAM, 0.5 CPU

### 2.2 Storefront (Frontend)
*   **Framework:** Next.js v15.3.8
*   **Thư viện UI:**
    *   React v19.0.3
    *   Tailwind CSS v3.0.23
    *   Medusa UI / Radix UI
*   **Kiến trúc:** App Router (dựa trên dependencies `server-only`)
*   **Cổng hoạt động:** 8000 (Internal Container Port)

## 3. Hạ tầng Triển khai (Infrastructure & DevOps)
Mọi dịch vụ được đóng gói (containerized) và điều phối bởi **Docker Compose**.

### 3.1 Reverse Proxy & Routing (Traefik)
Traefik đóng vai trò là Gateway duy nhất, xử lý SSL và định tuyến domain.
*   **Phiên bản:** Traefik v2.11
*   **SSL:** Tự động hóa qua Let's Encrypt (DNS Challenge với Cloudflare).
*   **Network:** `traefik-public` (Bridge network kết nối Proxy với các dịch vụ public).

### 3.2 Sơ đồ Domain & Routing
| Dịch vụ | Domain | Mô tả |
| :--- | :--- | :--- |
| **Storefront** | `hylacviet.vn`, `www.hylacviet.vn` | Trang mua sắm cho khách hàng. |
| **Backend API** | `api.hylacviet.vn` | API Server và Admin Dashboard. |
| **CDN (MinIO)** | `cdn.hylacviet.vn` | Phục vụ file ảnh/media công khai. |
| **MinIO Console**| `minio.hylacviet.vn` | Giao diện quản lý file (S3 Browser). |
| **Uptime Kuma** | `kuma.hylacviet.vn` | Hệ thống giám sát trạng thái server. |

### 3.3 Hệ thống Giám sát (Monitoring)
*   **Công cụ:** Uptime Kuma (Dockerized)
*   **Chức năng:** Theo dõi uptime của các dịch vụ nội bộ và website public.

## 4. Cấu trúc Thư mục Dự án

```
/opt/hylacviet/
├── backend/               # Mã nguồn Medusa Server & Worker
│   ├── src/               # Logic tùy chỉnh (Subscribers, Loaders, API)
│   ├── medusa-config.ts   # Cấu hình chính của Medusa
│   └── package.json       # Dependencies Backend
├── storefront/            # Mã nguồn Next.js Frontend
│   ├── src/               # Components, App router pages
│   └── package.json       # Dependencies Storefront
├── traefik/               # Cấu hình Reverse Proxy
│   ├── traefik.yml        # Cấu hình tĩnh (Entrypoints, Providers)
│   ├── dynamic/           # Cấu hình động (Middlewares, Routers thêm)
│   └── acme.json          # Chứng chỉ SSL lưu trữ
├── minio/                 # Dữ liệu config MinIO (nếu có mount ngoài)
├── postgres/              # Init scripts cho Database
├── redis/                 # Config Redis custom
├── monitoring/            # Dữ liệu giám sát
├── roadmap/               # Tài liệu dự án
│   ├── medusa_v2_technical_report.md
│   └── thong_tin_du_an.md (Tài liệu này)
├── docker-compose.yml     # File định nghĩa toàn bộ hạ tầng (SSOT)
└── .env.production        # Biến môi trường (Secrets, API Keys) - QUAN TRỌNG
```

## 5. Các cổng kết nối nội bộ (Internal Ports)
*   **Traefik:** 80/443 (Public)
*   **Postgres:** 5432
*   **Redis:** 6379
*   **MinIO:** 9000 (API), 9001 (Console)
*   **Medusa Server:** 9000
*   **Storefront:** 8000
*   **Admin Kuma:** 3001

## 6. Ghi chú Quan trọng về Vận hành
1.  **Chế độ Medusa v2:** Medusa v2 yêu cầu quy trình build (`medusa build`) để tạo ra artifact trong `.medusa/server` trước khi chạy. Dockerfile hiện tại đã xử lý việc này.
2.  **Dữ liệu bền vững (Volumes):**
    *   `postgres_data`: Chứa toàn bộ dữ liệu đơn hàng, sản phẩm.
    *   `minio_data`: Chứa toàn bộ ảnh upload.
    *   *Lưu ý: Cần backup định kỳ các volume này.*
3.  **Bảo mật:**
    *   Hệ thống không expose trực tiếp Database hay Redis ra internet (chỉ nội bộ `medusa-internal` network).
    *   Traefik xử lý HTTPS header security.
