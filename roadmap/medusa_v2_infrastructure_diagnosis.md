# Báo cáo chẩn đoán kỹ thuật: Khả năng tương tác giữa cơ sở hạ tầng và phần mềm trung gian trong Medusa V2

## Tóm tắt
Việc hiện đại hóa cơ sở hạ tầng thương mại điện tử thông qua kiến trúc Headless mang lại sự phức tạp đáng kể trong các lớp quản lý lưu lượng và điều phối phần mềm trung gian. Tình huống được trình bày – một ứng dụng Medusa v2.12.5 được triển khai thông qua Docker Compose phía sau máy chủ proxy ngược Traefik, gặp phải đồng thời các lỗi xác thực (HTTP 401) và các vấn đề hạn chế tải trọng – đóng vai trò là một nghiên cứu điển hình về những thách thức trong cấu hình hệ thống phân tán.

Báo cáo này cung cấp một phân tích toàn diện về các chế độ lỗi đã được báo cáo. Cuộc điều tra xác định rằng lỗi xác thực không phải là hậu quả trực tiếp của `defineMiddlewares`, mà là tác dụng phụ của vòng đời triển khai (xây dựng lại phần phụ trợ) đã áp đặt các ràng buộc bảo mật nghiêm ngặt đối với cookie phiên trong môi trường sản xuất mà không có cấu hình tin cậy proxy cần thiết ở lớp ứng dụng Node.js. Đồng thời, lỗi tải lên tập tin được xác định là vấn đề thực thi ràng buộc đa lớp, trong đó việc sửa đổi Medusa `bodyParser` là một bước cần thiết nhưng chưa đủ; sự hạn chế được thực thi ở cấp độ Proxy ngược (Traefik) và trình xử lý Multipart (Multer), tạo ra sự tắc nghẽn "ba cổng".

## 1. Bối cảnh kiến trúc và mô hình lỗi
Để hiểu rõ nguyên nhân cụ thể của lỗi xác thực và cơ chế tải lên tập tin trên Bảng điều khiển quản trị, điều cần thiết là phải xác định bối cảnh kiến trúc của khung Medusa V2 và sự tương tác của nó với cơ sở hạ tầng container hóa. Quá trình chuyển đổi từ Medusa V1 sang V2 đã mang đến những thay đổi cơ bản trong cách ứng dụng xử lý các tuyến đường, phần mềm trung gian và sự cô lập mô-đun, ảnh hưởng trực tiếp đến cách thức cấu hình cơ sở hạ tầng phải được áp dụng.

### 1.1 Kiến trúc mô-đun Medusa V2
Medusa V2 thể hiện sự chuyển đổi từ kiến trúc dựa trên dịch vụ nguyên khối sang thiết kế mô-đun, hướng theo miền. Trong mô hình này, các chức năng thương mại cốt lõi (Xác thực, Giỏ hàng, Đơn hàng, Kho hàng) được đóng gói trong các mô-đun riêng biệt. Tính mô-đun này mở rộng đến lớp HTTP, nơi khung phần mềm sử dụng phương pháp khai báo để định tuyến và phần mềm trung gian thông qua Khung Medusa (thường được nhập dưới dạng `@medusajs/framework`).

Ứng dụng của người dùng bao gồm ba thành phần chính được điều phối trong mạng Docker:
*   **Storefront (Next.js):** Sử dụng API Store (`/store`).
*   **Phần Backend (Node.js/Medusa):** Cung cấp API quản trị (`/admin`) và API cửa hàng (`/store`), đồng thời quản lý trạng thái cơ sở dữ liệu.
*   **Máy chủ proxy ngược (Traefik):** Quản lý lưu lượng truy cập đến, chấm dứt TLS (HTTPS) và định tuyến các yêu cầu đến các cổng container thích hợp.

Trong cấu trúc này, "Backend" là trung tâm của các vấn đề được báo cáo. Nó chịu trách nhiệm tạo cookie phiên cho Bảng điều khiển quản trị và xử lý các luồng tệp đến. Việc tích hợp `defineMiddlewares` trong `src/api/middlewares.ts` tương tác trực tiếp với điểm truy cập HTTP của backend, về cơ bản là đưa logic vào ngăn xếp ứng dụng Express.js cung cấp sức mạnh cho Medusa.

### 1.2 Công cụ điều phối phần mềm trung gian
Một điểm gây nhầm lẫn quan trọng trong truy vấn của người dùng là liệu `defineMiddlewares` "có ngầm vô hiệu hóa các middleware xác thực toàn cục hay không". Để trả lời câu hỏi này, chúng ta cần phân tích thứ tự thực thi của ngăn xếp middleware Medusa V2.

Medusa V2 không dựa vào một danh sách các middleware cố định. Thay vào đó, nó xây dựng một "Chuỗi Middleware" dựa trên việc khớp tuyến đường. Khi ứng dụng khởi động, nó sẽ đăng ký các middleware theo một trình tự cụ thể:

1.  **Các Middleware Toàn cục Cốt lõi:** Bao gồm xử lý CORS (`cors`), tiêu đề bảo mật (`helmet`) và nén. Khởi tạo dựa trên `projectConfig` trong `medusa-config.ts`.
2.  **Các Middleware Toàn cục Do Người Dùng Định nghĩa:** Được định nghĩa `src/api/middlewares.ts` bằng các bộ so khớp rộng (ví dụ: `*` hoặc `/admin*`).
3.  **Middleware xác thực:** Medusa tự động chèn `authenticate` middleware cho các tuyến đường được bảo vệ (như `/admin` và `/store/customers/me`).
4.  **Middleware dành riêng cho từng tuyến đường:** Được định nghĩa `src/api/middlewares.ts` bằng các bộ so khớp cụ thể.
5.  **Trình xử lý tuyến đường:** Logic API thực tế (ví dụ: `GET /admin/users/me`).

**Kết luận:** `defineMiddlewares` có tính chất **bổ sung**. Việc định nghĩa middleware tùy chỉnh không loại bỏ auth middleware.

### 1.3 Mô hình tương tác proxy ngược
Sự hiện diện của Traefik là biến số quan trọng nhất. Traefik hoạt động như một proxy lớp 7, nhận HTTPS và chuyển tiếp HTTP tới container.

*   Traefik nhận: `HTTPS://admin.example.com`
*   Medusa nhận: `HTTP://medusa-backend:9000`

Nếu ứng dụng Medusa không nhận biết được nó đang đứng sau Proxy, nó sẽ thấy giao thức là `http` (không an toàn) và từ chối thiết lập/đọc cookie `Secure`. Đây là nguyên nhân chính của lỗi 401.

## 2. Phân tích chuyên sâu: Lỗi xác thực (HTTP 401)
Triệu chứng: Lỗi Global 401 trên tất cả các tuyến đường của Bảng điều khiển quản trị sau khi xây dựng lại.

### 2.1 Vật lý của cookie bảo mật trong môi trường proxy
Cookie phiên (`connect.sid`) thường có cờ `Secure` (chỉ gửi qua HTTPS) và `SameSite=None` (cho phép đa miền).
Medusa kiểm tra `req.protocol`. Nếu thấy `http`, nó từ chối cookie `Secure`.
Do Traefik gửi `http` tới Medusa (TLS Termination), Medusa mặc định từ chối xác thực.

### 2.2 `trust proxy` Chỉ thị
Giải pháp là bật `trust proxy` trong Express/Medusa.
*   **Không có Trust Proxy:** Medusa thấy `req.protocol = 'http'`. Từ chối cookie.
*   **Có Trust Proxy:** Medusa đọc header `X-Forwarded-Proto: https` từ Traefik. Nó ghi đè `req.protocol` thành `'https'`. Chấp nhận cookie.

Vấn đề xuất hiện sau khi "xây dựng lại" có thể do biến môi trường `NODE_ENV=production` được áp dụng chặt chẽ hơn, buộc dùng `Secure: true`.

### 2.3 Xoay vòng bí mật (Secret Rotation)
Nếu `COOKIE_SECRET` không được cố định trong `docker-compose.yml` hoặc `.env`, mỗi lần rebuild Medusa có thể tạo secret mới -> Vô hiệu hóa toàn bộ session cũ -> Gây lỗi 401 ngay lập tức.

## 3. Tìm hiểu sâu: Giới hạn tải lên tệp (50MB)
Việc tăng giới hạn thất bại do mô hình "Phòng thủ nhiều lớp".

### 3.1 Cổng 1: Máy chủ proxy ngược (Traefik)
Traefik có giới hạn `maxRequestBodyBytes` (mặc định thường thấp, ví dụ 2MB).
Nếu gửi file 50MB, Traefik chặn ngay lập tức (413 Payload Too Large) trước khi đến Medusa.
**Giải pháp:** Cần thêm label Traefik middleware để tăng giới hạn buffering.

### 3.2 Cổng 2: Bộ phân tích nội dung ứng dụng (Medusa/Express)
Đây là nơi ta dùng `defineMiddlewares` để set `bodyParser.sizeLimit`.
Tuy nhiên, `bodyParser` chỉ xử lý JSON/Row.
`multipart/form-data` (upload file) được xử lý bởi thư viện khác (Multer). Cần đảm bảo cấu hình đúng cho cả Multer.

## 5. Chiến lược khắc phục (Đề xuất)

### Bước 1: Giải quyết xác thực (TRUST PROXY)
Cập nhật `medusa-config.ts`:
```typescript
http: {
  trustProxy: true, // QUAN TRỌNG: Tin tưởng header từ Traefik
  cookieSecret: process.env.COOKIE_SECRET,
  // ...
}
```

### Bước 2: Điều chỉnh giới hạn tải lên (TRAEFIK + MEDUSA)
1.  **Traefik Label:** Thêm `traefik.http.middlewares.limit.buffering.maxRequestBodyBytes=52428800` vào `docker-compose.yml`.
2.  **Medusa Middleware:** Giữ nguyên cấu hình `src/api/middlewares.ts` hiện tại (đã đúng hướng).

## 7. Kết luận
Lỗi 401 là do **thiếu cấu hình `trustProxy`** khiến Medusa không nhận diện được giao thức HTTPS từ Traefik.
Lỗi Upload thất bại là do **Traefik chặn** hoặc cấu hình Multer chưa đồng bộ.
Hai vấn đề này tách biệt nhưng cùng xuất hiện.
