# Báo cáo kỹ thuật: Kiến trúc triển khai sản phẩm Medusa v2 và giải pháp giao diện người dùng quản trị

## Tóm tắt
Sự chuyển đổi từ Medusa v1 sang Medusa v2 đánh dấu một bước ngoặt quan trọng trong triết lý kiến trúc của các framework thương mại điện tử không giao diện người dùng (headless commerce), chuyển từ kiến trúc nguyên khối dựa trên plugin và được thông dịch trong thời gian chạy sang kiến trúc mô-đun, được biên dịch trước (AOT). Sự phát triển này, trong khi mang lại những lợi ích đáng kể về tính an toàn kiểu dữ liệu, tính mô-đun và hiệu suất, đã tạo ra một vòng đời xây dựng phức tạp, làm thay đổi cơ bản cách thức đóng gói và triển khai ứng dụng trong môi trường sản xuất.

Một điểm gây khó khăn quan trọng trong quá trình chuyển đổi này—có thể xác định là một lỗi hệ thống trong các nhóm người dùng đầu tiên—là việc máy chủ Medusa không thể định vị được các tài nguyên tĩnh của giao diện người dùng quản trị, biểu hiện dưới dạng lỗi dai dẳng: `Could not find index.html in the admin build directory`. Lỗi này không chỉ đơn thuần là sự sai lệch đường dẫn tệp mà là triệu chứng của sự không tương thích sâu sắc hơn giữa các mô hình triển khai Node.js cũ và kiến trúc "Shadow Project" mới được giới thiệu trong Medusa v2.

Báo cáo này cung cấp phân tích kỹ thuật toàn diện về các thành phần xây dựng của Medusa v2, đặc biệt là `.medusa/server` cấu trúc thư mục tạm thời. Nó phân tích hoạt động của cấu trúc này `@medusajs/admin-bundler`, xem xét sự tương tác giữa container hóa Docker và trình tải thời gian chạy Medusa, đồng thời đề xuất một tiêu chuẩn kiến trúc cấp độ sản xuất dứt khoát để triển khai Medusa v2. Phân tích này tổng hợp dữ liệu từ việc kiểm tra mã nguồn, trình theo dõi sự cố cộng đồng và tài liệu chính thức để hướng dẫn các kỹ sư DevOps trong việc triển khai các quy trình triển khai mạnh mẽ, bất biến, phù hợp với mô hình biên dịch mới của framework.

## 1. Sự chuyển đổi mô hình: Sự tiến hóa kiến trúc của Medusa v2
Để chẩn đoán và giải quyết chính xác các lỗi triển khai trong Medusa v2, trước tiên cần phải hiểu rõ mức độ khác biệt về kiến trúc so với phiên bản tiền nhiệm. Lỗi liên quan đến tập `index.html` bị thiếu thực chất là một "đèn báo lỗi động cơ", cho thấy cơ sở hạ tầng triển khai đang xử lý ứng dụng v2 như thể đó là ứng dụng v1.

### 1.1 Từ diễn giải thời gian chạy đến biên dịch
Ở thế hệ trước (Medusa v1), vòng đời ứng dụng tuân theo mô hình Node.js truyền thống. Nhà phát triển viết mã trong `src/`, và có thể biên dịch nó sang `dist/`, nhưng thư mục gốc của ứng dụng vẫn là thư mục gốc của dự án. Tệp `package.json` trong thư mục gốc quản lý các phụ thuộc thời gian chạy, và `medusa-config.js` được đọc trực tiếp từ ngữ cảnh gốc.

Medusa v2 giới thiệu phương pháp "Khung sườn" mô phỏng các ngôn ngữ biên dịch. `medusa build` Lệnh này không còn là một bước tối ưu hóa tùy chọn nữa; nó là một bước biên dịch bắt buộc tạo ra một sản phẩm có thể chạy hoàn toàn khác biệt. Vật phẩm này không chỉ đơn thuần là một tập hợp `.js` các tệp tin; nó là một "Dự án Bóng tối" độc lập nằm trong `.medusa/server` thư mục đó.

Sự thay đổi này tạo ra sự phân nhánh trong cấu trúc dự án:

*   **Thư mục Nguồn (Gốc):** Thư mục này chứa ý định của nhà phát triển—các tệp mã nguồn TypeScript, thư mục gốc `package.json` và mã nguồn `medusa-config.ts`. Đây là không gian làm việc để phát triển .
*   **Dự án Artifact (`.medusa/server`):** Đây là không gian làm việc của máy để thực thi . Nó chứa một tệp được tạo ra `package.json` dành riêng cho sản xuất, một tệp đã biên dịch `medusa-config.js` và các tài sản Giao diện người dùng Quản trị được đóng gói đầy đủ.

Lỗi cơ bản mà các kỹ sư DevOps thường mắc phải là cố gắng chạy Dự án Nguồn trong môi trường sản xuất, thay vì Dự án Thành phẩm . Khi máy chủ khởi động từ thư mục gốc của Dự án Nguồn, nó thiếu khả năng nhận biết ngữ cảnh để định vị các tài nguyên nằm sâu bên trong cấu trúc thành phẩm, dẫn đến lỗi "index.html không tìm thấy".

### 1.2 Cấu trúc của `.medusa` thư mục
Thư `.medusa` mục là cốt lõi của mô hình triển khai v2. Không giống như một `dist/` thư mục đơn giản, có thể chỉ chứa mã JavaScript đã được biên dịch, `.medusa` thư mục được cấu trúc như một ứng dụng độc lập.

| Thư mục/Tệp | Chức năng trong kiến trúc v2 | Mức độ quan trọng đối với việc triển khai |
| :--- | :--- | :--- |
| `.medusa/server/package.json` | Một bản kê khai được tạo ra chỉ chứa các phụ thuộc sản xuất. Nó khác với bản kê khai gốc. | **Mức độ ưu tiên cao**: Cần cài đặt các gói phụ thuộc tại đây để máy chủ hoạt động. |
| `.medusa/server/public/admin` | Đây là thư mục đích lưu trữ các tệp giao diện người dùng quản trị (HTML, CSS, JS) được đóng gói trong Vite. | **Lỗi nghiêm trọng**: Đây là thư mục mà máy chủ không tìm thấy. |
| `.medusa/server/src` | Logic phía máy chủ đã được biên dịch (các tuyến API, dịch vụ, quy trình làm việc). | **Cao**: Chứa logic nghiệp vụ cốt lõi. |
| `.medusa/server/medusa-config.js` | Tệp cấu hình đã biên dịch, được chuyển đổi từ TS sang JS. | **Cao**: Máy chủ đọc cấu hình từ đây, chứ không phải từ thư mục gốc. |
| `.medusa/types` | Các định nghĩa TypeScript được tạo tự động cho Mô hình dữ liệu và Mô-đun. | **Thấp**: Chủ yếu dành cho tính năng gợi ý mã trong quá trình phát triển. |

Sự tồn tại của thư mục này `.medusa/server/package.json` là một chi tiết quan trọng thường bị bỏ qua. Trong quá trình xây dựng sản phẩm, Medusa sẽ cắt tỉa `devDependencies` và tạo ra một manifest gọn nhẹ. Điều này có nghĩa là container sản xuất phải thực hiện bước cài đặt trong thư mục này, hoặc quy trình xây dựng phải điền thông tin chính xác tương đối `node_modules` so với đường dẫn này.

### 1.3 Khái niệm "Dự án Bóng tối"
Chúng ta cần hình dung nó `.medusa/server` như một "Dự án Bóng". Đó là một thực thể tạm thời, được tạo ra và chỉ tồn tại sau quá trình xây dựng. Trong một quy trình CI/CD, Dự án Nguồn là đầu vào, và Dự án Bóng là sản phẩm đầu ra.

Khái niệm này phản ánh các mô hình được thấy trong các framework hiện đại khác như Next.js (với `.next`) hoặc Nuxt (với `.output`), trong đó đơn vị triển khai là một thư mục con của không gian làm việc. Tuy nhiên, không giống như Next.js, thường xử lý việc phân giải đường dẫn một cách minh bạch thông qua chế độ độc lập của nó, Medusa v2 hiện yêu cầu toán tử phải chuyển ngữ cảnh thực thi (Thư mục làm việc) một cách rõ ràng vào Dự án Bóng để đảm bảo phân giải đường dẫn chính xác cho các tài sản tĩnh.

## 2. Phân tích pháp y kỹ thuật: Chế độ lỗi của "Index.html"
Thông báo lỗi `Could not find index.html in the admin build directory` khá chính xác nhưng thường bị hiểu sai. Nó cho thấy có một tập tin bị thiếu, khiến các kỹ sư phải kiểm tra sự tồn tại của tập tin đó. Trong hầu hết các trường hợp được báo cáo, tập tin đó thực sự tồn tại. Thất bại nằm ở **sự thiếu quyết tâm**, chứ không phải **sự tồn tại**.

### 2.1 Logic phân giải gói quản trị
Để hiểu lý do tại sao quá trình phân giải thất bại, chúng ta phải phân tích hành vi của `@medusajs/admin-bundler` gói này. Thành phần này chịu trách nhiệm tích hợp quy trình xây dựng Vite với hệ thống phụ trợ Medusa.

Trong giai đoạn phát triển (`medusa develop`), trình đóng gói chạy máy chủ phát triển Vite cung cấp giao diện người dùng quản trị từ bộ nhớ, sử dụng Hot Module Replacement (HMR). Việc phân giải đường dẫn là động và tương đối dễ dàng.

Trong giai đoạn sản xuất (`medusa start`), máy chủ Vite động được thay thế bằng logic máy chủ tệp tĩnh được nhúng trong trình tải Medusa. Trình tải này được khởi tạo khi phần phụ trợ bắt đầu. Nó cố gắng xác định một điểm gắn kết tĩnh cho giao diện người dùng quản trị, thường được ánh xạ tới tuyến `/app` đường.

Trình tải sẽ tính toán đường dẫn tuyệt đối đến các tài nguyên tĩnh dựa trên `process.cwd()` (Thư mục làm việc hiện tại).

*   **Kịch bản A (Sai):** Người dùng chạy `medusa start` từ thư mục gốc của dự án (`/app`). Trình tải tìm kiếm `./public/admin`. Nó không tìm thấy vì các tài sản thực sự nằm ở `./.medusa/server/public/admin`.
*   **Kịch bản B (Đúng):** Người dùng chạy `medusa start` từ thư mục gốc của hiện vật (`/app/.medusa/server`). Trình tải tìm kiếm `./public/admin`. Nó tìm thấy thư mục thành công vì nó hoàn toàn cục bộ với ngữ cảnh thực thi.

Mã nguồn của trình tải quản trị dựa trên giả định rằng "Thư mục gốc dự án" khi chạy là thư mục chứa các tệp đã biên dịch `package.json` và `medusa-config.js`. Khi giả định này bị vi phạm do chạy từ thư mục gốc nguồn, logic phân giải đường dẫn sẽ lệch khỏi cấu trúc tệp vật lý.

### 2.2 Hiện tượng xây dựng "Dương tính giả"
Một yếu tố quan trọng góp phần gây ra sự khó chịu xung quanh lỗi này là quá trình biên dịch "sai lệch". Các kỹ sư quan sát nhật ký biên dịch thấy xác nhận rõ ràng: `Frontend build completed successfully`.

Việc xác nhận này dẫn đến bế tắc trong việc chẩn đoán. Kỹ sư lập luận: "Quá trình biên dịch thành công, do đó tệp tin tồn tại. Nếu tệp tin tồn tại, lỗi 'Không tìm thấy tệp tin' chắc chắn là do vấn đề về quyền truy cập hoặc một lỗi ảo." Điều này dẫn đến các chu kỳ gỡ lỗi không cần thiết `chmod`, bao gồm việc kiểm tra nhóm người dùng hoặc nghi ngờ các lớp Docker bị hỏng.

Thực tế là công cụ biên dịch (CLI) và trình tải thời gian chạy (Máy chủ) có những kỳ vọng tách biệt. CLI đặt tệp chính xác vào Dự án Bóng (Shadow Project). Trình tải thời gian chạy, nếu được khởi chạy không chính xác, sẽ tìm kiếm tệp đó trong Dự án Nguồn (Source Project). "Thành công" của quá trình biên dịch không có ý nghĩa gì nếu ngữ cảnh thời gian chạy bị sai lệch.

### 2.3 Vai trò của các biến môi trường trong quá trình biên dịch so với quá trình chạy
Một lớp phức tạp khác là việc xử lý các biến môi trường. `medusa build` Lệnh này tạo ra tệp tin, nhưng liệu nó có tích hợp các biến môi trường vào đó không?

Trong Medusa v2, giao diện quản trị là một ứng dụng trang đơn (SPA). Trong quá trình xây dựng (Vite), một số biến nhất định (thường là những biến có tiền tố `MEDUSA_ADMIN_` hoặc `VITE_`) có thể được mã hóa cứng vào gói JavaScript. Tuy nhiên, cấu hình phía máy chủ dựa trên các biến có mặt trong quá trình chạy.

Nếu `medusa start` lệnh được thực thi mà không có tệp `.env.production` tin bên trong thư `.medusa/server` mục (hoặc các biến môi trường cấp hệ thống tương đương), máy chủ có thể không khởi tạo được kết nối cơ sở dữ liệu hoặc kết nối Redis cần thiết để thậm chí đạt đến giai đoạn hiển thị giao diện người dùng quản trị. Mặc dù thông báo lỗi nêu rõ điều này `index.html`, nhưng đôi khi đây có thể là triệu chứng thứ cấp của việc máy chủ không khởi động đầy đủ trình tải cấu hình.

Ví dụ, nếu máy chủ mặc định sử dụng cấu hình phát triển vì `NODE_ENV` không được đặt thành `production`, nó có thể cố gắng tìm quản trị viên trong đường dẫn phát triển thay vì trong tệp tin xây dựng sản xuất.

### 2.4 Chế độ người dùng và khả năng hiển thị của quản trị viên
Medusa v2 giới thiệu sự phân tách nghiêm ngặt các mối quan tâm thông qua `WORKER_MODE`.

*   **Chế độ máy chủ (`workerMode: "server"`):** Phiên bản này chịu trách nhiệm xử lý các yêu cầu HTTP, bao gồm API Cửa hàng và Bảng điều khiển quản trị.
*   **Chế độ Worker (`workerMode: "worker"`):** Phiên bản này xử lý các công việc nền, tác vụ theo lịch trình và quy trình công việc. Nó không phục vụ giao diện người dùng quản trị.

Một lỗi cấu hình thường gặp trong môi trường container liên quan đến việc sử dụng một biến môi trường dùng chung được thiết lập trong đó `WORKER_MODE` được đặt thành `worker` cho container web chính. Trong trạng thái này, phần phụ trợ Medusa sẽ vô hiệu hóa các trình lắng nghe HTTP cho giao diện người dùng quản trị để tiết kiệm tài nguyên. Nếu người dùng cố gắng truy cập bảng điều khiển quản trị, yêu cầu sẽ thất bại, mặc dù thường là lỗi kết nối hoặc lỗi 404 chứ không phải `index.html` lỗi cụ thể. Tuy nhiên, nếu tập lệnh khởi động cố gắng xác thực bản dựng quản trị trước khi vô hiệu hóa nó, lỗi có thể xuất hiện.

## 3. Chiến lược container hóa: Kiến trúc Docker tối ưu
Việc triển khai Medusa v2 yêu cầu một chiến lược Docker tuân thủ kiến trúc "Shadow Project". Các Dockerfile "sao chép và chạy" tiêu chuẩn được sử dụng cho các ứng dụng Node.js thông thường—và thực tế là cho Medusa v1—là không đủ. Chúng ta phải áp dụng chiến lược Xây dựng Đa Giai đoạn (Multi-Stage Build) để cô lập rõ ràng sản phẩm xây dựng và thiết lập ngữ cảnh thời gian chạy chính xác.

### 3.1 Sự thất bại của các phương pháp xây dựng một giai đoạn
Một Dockerfile đơn giản cho Medusa v2 có thể trông như thế này (và sẽ bị lỗi):

**Dockerfile (MẪU CHỐNG - KHÔNG SỬ DỤNG)**

```dockerfile
# ANTI-PATTERN: DO NOT USE
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npx medusa build
CMD ["npx", "medusa", "start"]
```

**Lý do thất bại:**
1.  **Ngữ cảnh:** Quá `CMD` trình thực thi diễn ra trong `/app`. Bản dựng nằm trong `/app/.medusa/server`. Trình tải không tìm thấy các tệp quản trị.
2.  **Kích thước:** Hình ảnh chứa `src/`, `node_modules` (bao gồm cả các phụ thuộc phát triển) và các tạo phẩm xây dựng. Nó cồng kềnh và không an toàn.
3.  **Các phụ thuộc:** Thư mục gốc `node_modules` có thể chứa các phụ thuộc không tương thích với bản dựng sản xuất, hoặc bản dựng sản xuất có thể yêu cầu các phụ thuộc được nâng cấp cụ thể mà không thể giải quyết được từ thư mục gốc.

### 3.2 Giải pháp đa giai đoạn mạnh mẽ
Cách tiếp cận đúng đắn bao gồm hai giai đoạn riêng biệt: `builder` giai đoạn tạo ra Dự án Bóng (Shadow Project) và `runner` giai đoạn thực thi dự án đó.

**Giai đoạn 1: Người xây dựng**
Mục tiêu chính của giai đoạn này là tạo ra `.medusa/server` thư mục.

```dockerfile
# STAGE 1: Builder
FROM node:20-alpine AS builder

# Set working directory for the source project
WORKDIR /app

# Install system dependencies required for native modules (e.g., sharp, python)
RUN apk add --no-cache python3 make g++ git

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json yarn.lock ./

# Install ALL dependencies (including devDependencies needed for the build)
# We use frozen-lockfile to ensure reproducibility
RUN yarn install --frozen-lockfile

# Copy the full source code
COPY . .

# Set environment variables required for the build process
# Note: ADMIN_CORS or generic build flags might be needed here depending on Vite config
ENV NODE_ENV=production

# Execute the build. This creates .medusa/server
RUN npx medusa build
```

**Giai đoạn 2: Người chạy**
Mục tiêu chính của giai đoạn này là tạo ra một môi trường chạy nhẹ, an toàn, tập trung hoàn toàn vào Dự án Bóng (Shadow Project).

```dockerfile
# STAGE 2: Runner
FROM node:20-alpine AS runner

# Set working directory.
# CRITICAL DECISION: We set the workdir to where we will place the artifact.
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the artifact from the builder stage.
# We explicitly copy ONLY the contents of .medusa/server into /app.
# This effectively promotes the Shadow Project to be the Root Project in the container.
COPY --from=builder /app/.medusa/server /app

# Install production dependencies.
# The .medusa/server directory contains a generated package.json.
# We must install dependencies based on THIS manifest.
RUN npm install --omit=dev

# Optional: Copy the .env file if you are using file-based config (not recommended for K8s)
# COPY .env.production .env

# Expose the application port
EXPOSE 9000

# Start command.
# Because we copied the server files to /app, and WORKDIR is /app,
# we are now in the correct context.
CMD ["npm", "run", "start"]
```

**Phân tích giải pháp:**
Bằng cách sao chép `.medusa/server` nội dung vào `/app` giai đoạn Runner:
1.  Chúng ta loại bỏ vấn đề lồng nhau trong thư mục. `process.cwd()` trở thành `/app`.
2.  Các tài nguyên quản trị nằm tại `/app/public/admin`.
3.  Máy xúc tìm kiếm vị trí `./public/admin` tương đối so với `/app`.
4.  Giải quyết thành công: Các đường dẫn khớp nhau và lỗi đã được khắc phục.

### 3.3 Phương án thay thế: Bảo toàn cấu trúc thư mục
Một số nhóm DevOps thích duy trì `.medusa` cấu trúc để giữ cho hệ thống tệp của container nhất quán với môi trường phát triển cục bộ nhằm mục đích gỡ lỗi. Trong trường hợp này, `CMD` cần phải điều chỉnh.

```dockerfile
# Alternative Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy the entire .medusa directory
COPY --from=builder /app/.medusa ./.medusa

# We do NOT copy the source src/ files, only the build artifact.

# Switch context to the server directory
WORKDIR /app/.medusa/server

# Install dependencies for the artifact
RUN npm install --omit=dev

# Start from within the directory
CMD ["npm", "run", "start"]
```

Cách này đạt được kết quả tương tự bằng cách thay đổi đường `WORKDIR` dẫn thư mục thay vì di chuyển các tập tin. Cả hai cách đều hợp lệ, nhưng cách đầu tiên (nâng quyền lên root) thường sạch sẽ hơn đối với các công cụ giám sát container tiêu chuẩn, vốn mong đợi ứng dụng nằm ở đường dẫn thư mục gốc `/app`.

### 3.4 Xử lý việc cài đặt các gói phụ thuộc trong môi trường sản xuất
Một điểm tinh tế trong kiến trúc v2 là quản lý phụ thuộc. Tập `package.json` tin được tạo ra `.medusa/server` là một tập con của tập tin gốc `package.json`. Nó bao gồm `dependencies` nhưng loại trừ `devDependencies`.

Tuy nhiên, điều quan trọng cần hiểu là `medusa build` **không** đóng gói `node_modules` vào artifact (không giống như gói Webpack). Các câu lệnh `import` trong mã đã biên dịch vẫn tham chiếu đến `node_modules`

Do đó, giai đoạn Runner PHẢI chạy `npm install`. Việc chỉ sao chép `node_modules` từ `builder` giai đoạn này là rủi ro vì:
1.  Giai đoạn này `builder` bao gồm các thư viện phụ thuộc phát triển khổng lồ (TypeScript, ESLint, Vite) làm phình to kích thước của ảnh hệ thống.
2.  Giai đoạn này `builder` có thể sử dụng hệ điều hành nền khác (nếu không cẩn thận), mặc dù việc sử dụng `alpine` cả hai sẽ giảm thiểu rủi ro này.
3.  Việc cắt tỉa cành `node_modules` rất chậm và dễ xảy ra lỗi.

Việc cập nhật mới `npm install --omit=dev` ở giai đoạn chạy đảm bảo cây phụ thuộc sạch sẽ, chỉ dành cho môi trường sản xuất.

## 4. Điều phối và tích hợp cơ sở hạ tầng
Sau khi ảnh container được xây dựng chính xác, trọng tâm chuyển sang khâu điều phối. Cho dù sử dụng Docker Compose để mô phỏng sản xuất cục bộ hay Kubernetes cho quy mô lớn, cấu hình triển khai phải tuân thủ các ràng buộc của v2.

### 4.1 Docker Compose để mô phỏng môi trường sản xuất
Docker Compose thường được sử dụng để điều phối máy chủ Medusa cùng với PostgreSQL và Redis. Một lỗi thường gặp là ghi đè giá trị `command` trong tệp compose bằng một giá trị khiến nó quay trở lại ngữ cảnh gốc.

**Cấu hình Docker Compose chính xác:**

```yaml
version: '3.8'

services:
  medusa:
    # Use the image built from our multi-stage Dockerfile
    build:
      context: .
      target: runner
    container_name: medusa_backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://postgres:password@postgres:5432/medusa
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=something_secure
      - COOKIE_SECRET=something_secure
      - ADMIN_CORS=https://admin.mydomain.com
      - STORE_CORS=https://store.mydomain.com
      # Explicitly set server mode
      - WORKER_MODE=server
    ports:
      - "9000:9000"
    depends_on:
      - postgres
      - redis
    # DO NOT mount the local directory in production mode!
    # volumes:
    #   - .:/app   <-- This would overwrite the build artifact with source files
```

**Cảnh báo nghiêm trọng về Volumes:**
Trong quá trình phát triển, chúng tôi ánh xạ `.:/app` để cho phép tải lại nóng (hot reloading). Trong môi trường sản xuất (hoặc khi kiểm thử bản dựng sản xuất cục bộ), bạn **phải vô hiệu hóa việc gắn kết volume này** . Nếu bạn gắn kết thư mục mã nguồn của máy chủ `/app` vào container, bạn đang che giấu `.medusa` thư mục đã biên dịch được tạo ra bên trong ảnh (trừ khi nó cũng có trên máy chủ của bạn, điều này không được đảm bảo). Hơn nữa, bạn đang thay thế dữ liệu sản xuất `node_modules` bằng dữ liệu cục bộ của mình `node_modules` (hoặc che giấu chúng), dẫn đến lỗi "module not found" hoặc "index.html not found".

### 4.2 Chiến lược triển khai Kubernetes
Trong môi trường Kubernetes, lỗi "index.html" có thể gây ra `readinessProbes` sự cố nếu chúng nhắm mục tiêu vào đường dẫn quản trị, khiến pod rơi vào vòng lặp CrashLoopBackOff hoặc không bao giờ nhận được lưu lượng truy cập.

**Những điều cần cân nhắc khi lập danh sách triển khai:**
1.  **Thư mục làm việc:** Nếu sử dụng chiến lược "Trình chạy thay thế" (Mục 3.3), hãy đảm bảo rằng `workingDir` trong thông số kỹ thuật của Pod được đặt thành `/app/.medusa/server`.
2.  **Kiểm tra trạng thái hoạt động/sẵn sàng:** Hãy nhắm mục tiêu vào `/health` điểm cuối thay vì `/app` điểm cuối gốc (quản trị) để kiểm tra trạng thái hoạt động. Giao diện người dùng quản trị có thể tải chậm hoặc nằm sau một lệnh chuyển hướng xác thực.

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 9000
  initialDelaySeconds: 30
```

**Khởi tạo Container cho Di chuyển:**
Vì container sản xuất được tối ưu hóa để chạy máy chủ, việc chạy di chuyển cần phải cẩn thận. Lệnh di chuyển (`npx medusa db:migrate`) cũng phải được thực thi từ ngữ cảnh chính xác (`.medusa/server`).

```yaml
initContainers:
  - name: migrations
    image: my-medusa-image:latest
    command: ["sh", "-c", "cd .medusa/server && npx medusa db:migrate"]
    envFrom:
      - configMapRef:
          name: medusa-config
```

### 4.3 Chi tiết cụ thể về PaaS: Railway, Render và Heroku
Các nền tảng dưới dạng dịch vụ (PaaS) thường cố gắng tự động phát hiện loại ứng dụng. Chúng thấy một tệp `package.json` trong thư mục gốc và giả định một trình tự khởi động Node.js tiêu chuẩn (`npm install` -> `npm start`).

**Ghi đè lệnh "Khởi động":**
Đối với các nền tảng này, bạn phải ghi đè lệnh Khởi động một cách rõ ràng trong cài đặt bảng điều khiển.

*   Sai: `npm start` (Thực thi tập lệnh package.json gốc).
*   Chính xác: `cd .medusa/server && npm install && npm run start`.

**Ghi đè lệnh "Build Command":**
Tương tự, lệnh xây dựng phải đảm bảo nó được chạy từ thư mục gốc.

*   Yêu cầu: `npm install && npx medusa build`
*   Thư mục đầu ra: Nền tảng PaaS có thể mong đợi thư mục đầu ra là `dist` hoặc `build`. Bạn có thể cần cấu hình PaaS để coi `.medusa/server` là thư mục xuất bản, hoặc sử dụng Dockerfile tùy chỉnh (được khuyến nghị) để bỏ qua các quy tắc thư mục cứng nhắc của nền tảng.

## 5. Quản lý cấu hình và biến môi trường
Lỗi "Index.html" về cơ bản là vấn đề về phân giải tệp, nhưng nó thường do các lỗi cấu hình khiến máy chủ không thể khởi tạo đúng đường dẫn tệp gây ra.

### 5.1 `medusa-config.ts` Vòng đời
Trong phiên bản v2, cấu hình được định nghĩa bằng TypeScript. `medusa build` Lệnh này được biên dịch `medusa-config.ts` thành `.medusa/server/medusa-config.js`.

**Thông tin quan trọng:** Máy chủ sản xuất đọc cấu hình **JavaScript đã được biên dịch** , chứ không phải cấu hình TypeScript gốc. Nếu bạn thực hiện thay đổi `medusa-config.ts` nhưng không biên dịch lại, máy chủ sản xuất sẽ chạy với cấu hình lỗi thời. Điều này bao gồm các thay đổi đối với `admin.path` hoặc `admin.backendUrl`.

**Đối tượng cấu hình quản trị:**

```typescript
module.exports = defineConfig({
  admin: {
    disable: false,
    // The path where the admin is served. Default is "/app".
    // If you change this, the loader looks for assets in a different sub-path.
    path: "/app",
    // This URL is used by the Admin UI to talk to the backend.
    // In production, this must be the public URL, not localhost.
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  }
})
```

Nếu `backendUrl` cấu hình sai (ví dụ: để nguyên như `localhost:9000` trong môi trường Docker), giao diện người dùng quản trị có thể tải `index.html` (khắc phục lỗi) nhưng sau đó không thể lấy dữ liệu, hiển thị màn hình trắng trống. Điều này khác với lỗi "Không tìm thấy index.html" nhưng thường bị nhầm lẫn với lỗi đó.

### 5.2 Sự lan truyền của biến môi trường
Một yêu cầu quan trọng đối với `.medusa/server` hiện vật này là sự hiện diện của các biến môi trường.

*   **Docker:** Các biến được truyền qua `ENV` hoặc `env_file` có sẵn cho tiến trình.
*   **Tệp tin:** Nếu bạn phụ thuộc vào `.env` các tệp tin, bạn phải sao chép chúng vào thư mục chứa sản phẩm.
*   **Phát triển:** Root `.env` đã được tải.
*   **Sản xuất (`.medusa/server`):** Máy chủ tìm kiếm `.env` tương đối so với chính nó .
*   **Thao tác:** Trong Dockerfile hoặc tập lệnh khởi động, hãy thực thi lệnh này `cp ../../.env .env.production` nếu không sử dụng các biến môi trường hệ thống.

### 5.3 Cấu hình CORS
Mặc dù CORS không gây ra lỗi "missing index.html" (đây là lỗi hệ thống tệp phía máy chủ), nhưng nó là trở ngại tiếp theo ngay lập tức.

*   `ADMIN_CORS`: Phải bao gồm URL mà trình duyệt truy cập vào trang quản trị.
*   `AUTH_CORS`: Phải bao gồm URL quản trị.

Nếu `index.html` tìm thấy yêu cầu nhưng CORS không chính xác, bảng điều khiển trình duyệt sẽ hiển thị nhiều lỗi khi tìm nạp.

## 6. Chẩn đoán và khắc phục sự cố vận hành
Khi gặp lỗi "Không tìm thấy index.html", hãy làm theo quy trình chẩn đoán nghiêm ngặt này để xác định nguyên nhân gây lỗi.

### 6.1 Giai đoạn chẩn đoán 1: Xác minh hiện vật
Trước khi đổ lỗi cho runtime, hãy kiểm tra lại bản dựng. Truy cập vào shell của container:

```bash
docker exec -it <container_id> /bin/sh
```

Điều hướng đến vị trí tài sản dự kiến:

```bash
# If using the "Root Promotion" strategy:
ls -la /app/public/admin/index.html

# If using the "Subdirectory" strategy:
ls -la /app/.medusa/server/public/admin/index.html
```

*   **Kết quả A:** Tệp tin tồn tại. Vấn đề nằm ở Thư mục làm việc (Ngữ cảnh).
*   **Kết quả B:** Tệp không tồn tại. Vấn đề nằm ở Quy trình xây dựng hoặc Dockerignore .

### 6.2 Giai đoạn chẩn đoán 2: Xác minh bối cảnh
Kiểm tra xem tiến trình đang chạy từ đâu:

```bash
# Inside the container
pwdx <pid_of_node_process>
# OR check process env
cat /proc/1/cwd
```

Nếu thư mục làm việc hiện tại (CWD) là `/app` nhưng các tệp tin nằm trong `.medusa/server` (và chưa được sao chép), điều đó có nghĩa là bạn đã xác nhận sự sai lệch.

### 6.3 Giai đoạn chẩn đoán 3: Phân tích nhật ký
Bật chế độ ghi nhật ký chi tiết cho giao diện dòng lệnh Medusa và máy chủ:

```bash
# Set this env var
LOG_LEVEL=debug
```

Hãy tìm các dòng cho biết "Admin loader initialized". Nếu dòng này bị thiếu, `admin` mô-đun có thể đã bị vô hiệu hóa trong tệp cấu hình hoặc `WORKER_MODE` có thể được đặt thành `worker`.

### 6.4 Những luận điểm đánh lạc hướng thường gặp
*   **Quyền hạn:** Người dùng thường chạy lệnh này `chmod 777` trong tuyệt vọng. Đây hiếm khi là nguyên nhân gốc rễ. `node` Người dùng mặc định trong ảnh hệ điều hành Alpine thường có đủ quyền nếu `COPY --chown=node:node` được sử dụng hoặc nếu chạy với quyền root (mặc định).
*   **Cấu hình PM2:** Nếu sử dụng PM2 bên trong Docker (không được khuyến khích, hãy để Docker tự xử lý việc khởi động lại), hãy đảm bảo rằng biến `cwd` môi trường `in` `ecosystem.config.js` được đặt thành thư mục chứa artifact, chứ không phải thư mục gốc của dự án.

## 7. Các khuyến nghị chiến lược và triển vọng tương lai
Những thay đổi về kiến trúc trong Medusa v2 đòi hỏi sự hoàn thiện trong các phương pháp triển khai. Kỷ nguyên "sao chép-dán" của các triển khai Node.js thông thường không còn tương thích với kỷ nguyên của các framework được biên dịch.

### 7.1 Khuyến nghị 1: Áp dụng Tiêu chuẩn Dự án Bóng
Chuẩn hóa tất cả các Dockerfile trong quá trình xây dựng nhiều giai đoạn, từ đó đưa chúng `.medusa/server` lên thư mục gốc của môi trường chạy. Điều này giúp đơn giản hóa việc sử dụng công cụ, giám sát và gỡ lỗi bằng cách làm cho cấu trúc container sản xuất trở nên trực quan hơn.

### 7.2 Khuyến nghị 2: Tách biệt máy chủ quản trị (Nâng cao)
Đối với môi trường sản xuất có lưu lượng truy cập cao, hãy cân nhắc tách hoàn toàn giao diện người dùng quản trị (Admin UI) khỏi API.

1.  **Xây dựng:** Chạy `medusa build`.
2.  **Trích xuất:** Sao chép `.medusa/server/public/admin` vào một vị trí riêng biệt.
3.  **Máy chủ:** Phục vụ các tập tin tĩnh này thông qua Nginx, Vercel hoặc AWS S3 + CloudFront.
4.  **Cấu hình:** Thiết lập `ADMIN_CORS` ở phía máy chủ để cho phép URL quản trị bên ngoài. Điều này loại bỏ `index.html` hoàn toàn lỗi từ máy chủ Node.js, vì máy chủ không còn phục vụ các tài nguyên giao diện người dùng nữa, giảm tải CPU và mức sử dụng bộ nhớ.

### 7.3 Khuyến nghị 3: Thực hiện kiểm tra CI/CD
Thêm bước xác minh vào quy trình CI:

```bash
# CI Script
npx medusa build
if [ ! -f .medusa/server/public/admin/index.html ]; then
  echo "CRITICAL FAILURE: Admin build artifact missing"
  exit 1
fi
```

Thao tác này khiến quá trình biên dịch thất bại nhanh chóng trước khi ảnh hệ thống bị lỗi được đẩy lên kho lưu trữ.

## Phần kết luận
Lỗi `Could not find index.html` trong Medusa v2 là một dấu hiệu kiến trúc rõ ràng báo hiệu sự chuyển đổi từ các ứng dụng thương mại được thông dịch sang các ứng dụng được biên dịch. Đây không phải là lỗi trong framework mà là sự thực thi nghiêm ngặt của vòng đời xây dựng mới. Bằng cách hiểu cấu trúc "Dự án Bóng tối" và triển khai các chiến lược container hóa đa giai đoạn được trình bày chi tiết trong báo cáo này, các nhóm DevOps có thể đạt được môi trường sản xuất ổn định, hiệu quả và an toàn, tận dụng tối đa khả năng của Medusa v2. Giải pháp không nằm ở việc can thiệp vào đường dẫn tệp, mà nằm ở việc điều chỉnh ngữ cảnh triển khai phù hợp với mục đích thiết kế của framework.

**Nguồn dữ liệu và trích dẫn:**
1. Lỗi Github #11386 - "Không tìm thấy index.html"
2. Bài đăng trên Reddit - Khắc phục lỗi "Nightmare"
3. Tài liệu Medusa - Khắc phục sự cố lỗi xây dựng dành cho quản trị viên
4. StackOverflow - Các vấn đề khi triển khai Render
5. Sự cố Github #12245 - Thiếu thư mục bản dựng quản trị
6. Tài liệu Medusa - Các loại được tạo tự động
7. Hướng dẫn cài đặt Docker trên Medusa Docs
8. Tài liệu Medusa - Quá trình chuyển đổi từ phiên bản v1 sang v2
9. Tài liệu Medusa - Lệnh xây dựng & Cấu trúc đầu ra
10. Câu trả lời trên StackOverflow - CWD chính xác cho Start
11. Trung bình - Chế độ người làm việc so với Chế độ máy chủ
12. Vấn đề trên Github #10147 - Logic đường dẫn của Admin Bundler
13. Vấn đề trên Github #11386 - Xác nhận phiên bản xem trước
14. Sự cố Github #13803 - Lỗi khi khởi động lệnh
15. StackOverflow - Các vấn đề về ngữ cảnh hiển thị
