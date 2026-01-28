# BÁO CÁO NGHIÊN CỨU KỸ THUẬT CHUYÊN SÂU: LÀM CHỦ VÀ CAN THIỆP HỆ THỐNG MEDUSAJS V2 ADMIN DASHBOARD

## 1. Giới thiệu và Phạm vi Nghiên cứu

### 1.1. Bối cảnh Kiến trúc và Sự chuyển dịch sang Medusa V2

Sự ra đời của MedusaJS V2 đánh dấu một bước ngoặt kiến trúc quan trọng trong hệ sinh thái thương mại điện tử headless (không đầu). Không giống như phiên bản tiền nhiệm vốn dựa trên nền tảng Gatsby cho giao diện quản trị (Admin Dashboard), Medusa V2 đã thực hiện một cuộc tái cấu trúc toàn diện, chuyển sang sử dụng Vite v5 làm nòng cốt cho hệ thống frontend. Sự thay đổi này không đơn thuần là việc nâng cấp công nghệ, mà nó phản ánh một triết lý thiết kế mới: ưu tiên tính mô-đun hóa (modularity), hiệu suất biên dịch (build performance) và khả năng mở rộng (extensibility) thông qua các điểm tiêm (injection zones) thay vì sửa đổi mã nguồn trực tiếp.

Đối với các Kiến trúc sư Hệ thống (System Architects) và Lập trình viên Full-stack cao cấp, Admin Dashboard của Medusa V2 không còn là một giao diện tĩnh (static interface) mà là một Ứng dụng Trang Đơn (Single Page Application - SPA) động, hoạt động như một khách hàng tiêu thụ (consumer) các API của Backend. Mô hình này đặt ra những thách thức và cơ hội mới trong việc tùy biến. Việc "can thiệp sâu" vào hệ thống này đòi hỏi sự hiểu biết tường tận về cơ chế giao tiếp Client-Server, quy trình đóng gói (bundling) của Vite, và kiến trúc quản lý trạng thái server (server state management) thông qua Tanstack Query.

### 1.2. Mục tiêu và Cấu trúc Báo cáo

Báo cáo này được xây dựng nhằm mục đích cung cấp một lộ trình kỹ thuật toàn diện để làm chủ lớp giao diện quản trị của Medusa V2. Thay vì chỉ dừng lại ở các hướng dẫn bề mặt, phân tích này sẽ đi sâu vào "phần chìm của tảng băng trôi" – từ việc giải mã chu trình request/response, vượt qua các giới hạn cứng của giao diện mặc định, đến việc tích hợp các luồng nghiệp vụ (workflows) phức tạp.

Nội dung báo cáo được cấu trúc xoay quanh năm trụ cột kỹ thuật chính:
1.  **Kiến trúc và Cơ chế Vận hành:** Giải phẫu hệ thống SPA trên nền tảng Vite và cơ chế mở rộng Extensions.
2.  **Tùy chỉnh Giao diện (UI/UX):** Từ các thành phần UI tiêu chuẩn đến các kỹ thuật can thiệp sâu (Advanced Hacks) vào hệ thống build.
3.  **Logic & Code:** Chiến lược quản lý dữ liệu, tích hợp Workflows và Remote Query.
4.  **Bảo mật và Phân quyền:** Thiết lập RBAC (Role-Based Access Control) từ Backend ra Frontend.
5.  **Cài đặt và Triển khai:** Tối ưu hóa hiệu suất và giải quyết bài toán CORS trong kiến trúc phân tán.

## 2. Trụ cột 1: Kiến trúc và Cơ chế Vận hành Cốt lõi (Architecture & Core Mechanics)

Để thực hiện các can thiệp phẫu thuật (surgical interventions) vào Admin Dashboard, trước tiên cần thấu hiểu mô hình vận hành của nó. Medusa V2 Admin là một ứng dụng React được biên dịch sẵn (pre-bundled), nhưng lại có khả năng nạp động (dynamic loading) các thành phần mở rộng từ mã nguồn dự án.

### 2.1. Hệ sinh thái Vite và Chiến lược Bundling

Việc chuyển từ Webpack (trong V1/Gatsby) sang Vite (trong V2) mang lại lợi thế to lớn về tốc độ phát triển nhờ cơ chế HMR (Hot Module Replacement) dựa trên ES Modules. Tuy nhiên, điều này cũng thay đổi cách thức các extension được tích hợp.

Trong Medusa V2, mã nguồn Admin Core nằm trong gói `@medusajs/dashboard`. Khi khởi động lệnh `medusa develop` hoặc `medusa build`, hệ thống sẽ thực hiện một quy trình phức tạp:
1.  **Discovery (Khám phá):** Hệ thống quét thư mục `src/admin` của dự án để tìm các file widgets, routes, và settings extensions.
2.  **Injection (Tiêm):** Thông qua gói `@medusajs/admin-sdk`, các file này được đăng ký vào một registry ảo.
3.  **Bundling (Đóng gói):** Vite sẽ biên dịch mã nguồn React từ `src/admin` kết hợp với mã nguồn Core từ `node_modules`. Kết quả là một tập hợp các file tĩnh (static assets) nằm trong thư mục `.medusa/server/public/admin` (hoặc thư mục build tùy cấu hình).

**Hệ quả Kiến trúc:**
*   **Build-time Dependency:** Mọi thay đổi về cấu trúc UI (thêm widget, thêm route) đều yêu cầu quá trình rebuild. Không thể thêm/bớt tính năng UI tại runtime (thời gian chạy) mà không qua pipeline CI/CD.
*   **Alias & Resolution:** Vite sử dụng cơ chế `resolve.alias` để định tuyến các import. Điều này mở ra một "cửa hậu" (backdoor) cho phép các chuyên gia hệ thống ghi đè các component mặc định của Medusa bằng component tùy chỉnh mà không cần fork toàn bộ dự án (chi tiết sẽ được bàn ở Chương 3).

### 2.2. Cơ chế Injection Zones: Kiến trúc Slot-Fill

Khả năng mở rộng của Medusa Admin dựa trên mẫu thiết kế (design pattern) "Slot-Fill" hay còn gọi là Injection Zones. Core Team đã định nghĩa sẵn các vị trí chiến lược (Zones) trong UI nơi mã nguồn bên thứ ba có thể hiển thị.

Cơ chế này hoạt động dựa trên metadata. Mỗi widget export một cấu hình `WidgetConfig` thông qua hàm `defineWidgetConfig`.
*   **Zone:** Chuỗi định danh vị trí (ví dụ: `product.details.before`).
*   **Component:** React Component thực thi giao diện.

**Phân tích Chi tiết về Ngữ cảnh Dữ liệu (Data Context):**
Một điểm mạnh của kiến trúc này là sự truyền tải ngữ cảnh. Khi một widget được render tại trang chi tiết sản phẩm (`product.details.*`), Admin Core tự động truyền prop `data` chứa đối tượng `AdminProduct` hiện tại xuống widget.

**Bảng 2.1: Phân tích Kỹ thuật các Injection Zones Chính và Chiến lược Dữ liệu**

| Zone Identifier | Ngữ cảnh Dữ liệu (Props) | Mục đích Sử dụng Điển hình | Chiến lược Fetching Dữ liệu |
| :--- | :--- | :--- | :--- |
| `product.details.before` | `AdminProduct` | Hiển thị cảnh báo, trạng thái kho vận, hoặc thông tin tóm tắt. | Dùng prop có sẵn. Tránh fetch lại trừ khi cần dữ liệu liên kết sâu (deep relations). |
| `product.details.after` | `AdminProduct` | Các widget phân tích (analytics), lịch sử thay đổi, hoặc metadata mở rộng. | Nên dùng `useQuery` để fetch dữ liệu bất đồng bộ, tránh chặn rendering chính. |
| `order.details.side.after` | `AdminOrder` | Các hành động nhanh (Quick Actions) như "In hóa đơn", "Gửi email". | Dữ liệu prop thường đủ dùng. |
| `customer.details.before` | `AdminCustomer` | Hiển thị điểm tín dụng (Loyalty points), phân hạng khách hàng (VIP/Regular). | Cần kết nối với module Loyalty hoặc CRM bên thứ ba. |
| `product_variant.details.*` | `AdminProductVariant` | Quản lý thông tin quy cách đóng gói, barcode chuyên biệt. | Prop cung cấp thông tin variant cơ bản. |

*Nhận định Chuyên gia: Việc hiểu rõ Zone nào cung cấp dữ liệu gì là cực kỳ quan trọng để tối ưu hiệu suất. Nếu bạn fetch lại dữ liệu Product trong một widget đã có sẵn prop `product`, bạn đang lãng phí băng thông và tài nguyên client.*

### 2.3. Lớp Giao tiếp Dữ liệu: JS SDK và Tanstack Query

Medusa V2 loại bỏ hoàn toàn việc quản lý state phức tạp kiểu Redux cho dữ liệu server. Thay vào đó, nó áp dụng mô hình "Server State Management" thông qua thư viện Tanstack Query (React Query) kết hợp với Medusa JS SDK (`@medusajs/js-sdk`).

*   **JS SDK:** Đóng vai trò là lớp Adapter. Nó chịu trách nhiệm:
    *   Chuẩn hóa các HTTP request (GET, POST, DELETE).
    *   Tự động đính kèm Authentication Header (Cookie Session hoặc Bearer Token).
    *   Định kiểu dữ liệu (TypeScript Typing) cho request và response.
*   **Tanstack Query:** Đóng vai trò quản lý Caching và Synchronization.
    *   **Deduplication:** Nếu 3 widget cùng yêu cầu thông tin của một Order, Tanstack Query sẽ hợp nhất chúng thành 1 request mạng duy nhất.
    *   **Invalidation:** Khi thực hiện một hành động ghi (Mutation) như "Cập nhật sản phẩm", Query Client sẽ tự động làm mới (invalidate) cache của danh sách sản phẩm, đảm bảo UI luôn hiển thị dữ liệu mới nhất mà không cần reload trang.

## 3. Trụ cột 2: Tùy chỉnh Giao diện (UI/UX) - Từ Tiêu chuẩn đến Nâng cao

Tùy chỉnh UI trong Medusa là một phổ (spectrum) rộng, từ việc sử dụng các công cụ có sẵn đến việc can thiệp vào cấu hình build để thay đổi những thứ cốt lõi.

### 3.1. Thiết kế Giao diện Nhất quán với Medusa UI

Để đảm bảo trải nghiệm người dùng liền mạch (Seamless UX), Medusa bắt buộc (soft-enforce) việc sử dụng gói thư viện `@medusajs/ui`. Đây không chỉ là một bộ UI Kit thông thường mà là sự kết hợp của Radix UI Primitives (đảm bảo khả năng truy cập - A11y) và Tailwind CSS.

**Tại sao phải dùng Medusa UI?**
*   **Consistency:** Widget của bạn sẽ trông giống hệt phần còn lại của Admin. Button, Input, Table sẽ có cùng kích thước, màu sắc và trạng thái focus.
*   **Dark Mode Support:** Hệ thống màu của `@medusajs/ui` hỗ trợ Dark Mode tự động. Nếu bạn hardcode màu hex (ví dụ: `#FFFFFF`), giao diện sẽ bị vỡ khi chuyển chế độ sáng/tối.

**Ví dụ Triển khai UI Chuẩn:**

```typescript
import { Container, Heading, Text, Button, clx } from "@medusajs/ui"
import { PencilSquare } from "@medusajs/icons"

const VendorWidget = () => {
  return (
    <Container className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <Heading level="h2">Vendor Information</Heading>
        <Button variant="secondary" size="small">
          <PencilSquare /> Edit
        </Button>
      </div>
      <div className="p-6">
        <Text className="text-ui-fg-subtle">
          This product is managed by <span className="font-medium text-ui-fg-base">Acme Corp</span>.
        </Text>
      </div>
    </Container>
  )
}
```

*Phân tích: Việc sử dụng `Container`, `Heading`, và các utility class của Tailwind (`text-ui-fg-subtle`) đảm bảo widget này hòa nhập hoàn toàn vào hệ thống design của Medusa.*

### 3.2. Kỹ thuật Nâng cao: "Vite Alias Override" để Thay đổi Branding

Mặc dù tài liệu chính thức tuyên bố rằng không thể thay đổi Logo hay các thành phần cốt lõi, nhưng với tư cách là System Architect nắm quyền kiểm soát cấu hình build, chúng ta có thể vượt qua giới hạn này bằng kỹ thuật Module Aliasing trong Vite.

**Cơ chế Kỹ thuật:**
Vite cho phép định nghĩa `resolve.alias` trong file cấu hình. Khi trình biên dịch gặp một lệnh import như `import Logo from "@medusajs/dashboard/components/logo"`, nó sẽ kiểm tra bảng alias. Nếu chúng ta trỏ đường dẫn này sang một file component tùy chỉnh của mình, Vite sẽ đóng gói component đó thay vì component gốc.

**Quy trình Thực hiện (Step-by-Step):**

1.  **Xác định Mục tiêu:** Tìm đường dẫn chính xác của component cần thay thế trong `node_modules`. Giả sử qua quá trình reverse engineering gói `@medusajs/dashboard`, ta thấy component logo nằm tại đường dẫn nội bộ (đây là ví dụ giả định, cần kiểm tra thực tế trên từng phiên bản):`@medusajs/dashboard/dist/components/common/logo`
2.  **Tạo Component Thay thế:** Tạo file `src/admin/components/custom-logo.tsx`:

```typescript
import { Heading } from "@medusajs/ui"
export const CustomLogo = () => {
  return <Heading level="h1" className="text-xl text-blue-600">MY BRAND</Heading>
}
```

3.  **Cấu hình `medusa-config.ts`:** Can thiệp vào cấu hình Vite của Admin plugin:

```typescript
import { defineConfig } from "@medusajs/framework/utils"
import path from "path"

module.exports = defineConfig({
  admin: {
    vite: (config) => {
      return {
       ...config,
        resolve: {
         ...config.resolve,
          alias: {
           ...config.resolve?.alias,
            // Kỹ thuật Override:
            // Key: Đường dẫn module gốc (cần chính xác tuyệt đối)
            // Value: Đường dẫn tuyệt đối tới file custom của bạn
            "@medusajs/dashboard/components/common/logo": path.resolve(__dirname, "src/admin/components/custom-logo.tsx"),

            // Cũng có thể dùng alias để rút gọn đường dẫn import
            "@admin": path.resolve(__dirname, "src/admin"),
          },
        },
      }
    },
  },
})
```

*Cảnh báo Rủi ro: Kỹ thuật này phụ thuộc vào cấu trúc nội bộ của gói `@medusajs/dashboard`. Nếu Medusa cập nhật phiên bản và đổi tên file hoặc thay đổi cấu trúc thư mục, alias sẽ không còn khớp, dẫn đến lỗi build hoặc quay về logo mặc định. Cần cân nhắc kỹ giữa lợi ích branding và chi phí bảo trì.*

### 3.3. Phương án Standalone: Khi nào cần Fork Dashboard?

Nếu yêu cầu tùy chỉnh vượt quá khả năng của Injection Zones và Vite Aliasing (ví dụ: thay đổi hoàn toàn cấu trúc điều hướng Sidebar, thay đổi luồng Login, viết lại logic Routing), giải pháp cuối cùng là chạy Dashboard dưới dạng ứng dụng độc lập (Standalone).

**Quy trình Standalone:**
1.  **Vô hiệu hóa Admin tích hợp:** Trong `medusa-config.ts` thiết lập `admin: { disable: true }` để Backend không phục vụ Admin nữa.
2.  **Fork Repository:** Clone mã nguồn của gói `packages/admin/dashboard` từ kho lưu trữ GitHub của Medusa.
3.  **Chạy Độc lập:** Cấu hình biến môi trường `VITE_MEDUSA_BACKEND_URL` trỏ về Backend API của bạn.
4.  **Triển khai Riêng:** Build và deploy ứng dụng React này lên Vercel hoặc Netlify như một frontend riêng biệt.

**Đánh giá Trade-off:**
*   **Ưu điểm:** Tự do tuyệt đối. Bạn sở hữu hoàn toàn mã nguồn frontend.
*   **Nhược điểm:** "Ác mộng" bảo trì. Bạn sẽ không nhận được các bản cập nhật tính năng, bản vá lỗi bảo mật từ Medusa Core team một cách tự động. Việc merge code từ upstream sẽ rất tốn kém và dễ gây xung đột (merge conflicts). Chỉ khuyến nghị phương án này cho các đội ngũ kỹ thuật lớn có khả năng maintain riêng.

## 4. Trụ cột 3: Can Thiệp Sâu vào Logic & Code (Logic Integration)

Giao diện đẹp chỉ là lớp vỏ. Sức mạnh thực sự của một hệ thống quản trị nằm ở khả năng điều khiển các logic nghiệp vụ phức tạp.

### 4.1. Kết nối Admin với Medusa Workflows

Trong Medusa V2, các tác vụ ghi (mutations) phức tạp như "Tạo đơn hàng", "Xử lý đổi trả", "Đồng bộ tồn kho" được xử lý qua Workflows. Admin Dashboard cần đóng vai trò là "cò súng" (trigger) để kích hoạt các workflow này.

Quy trình tích hợp chuẩn bao gồm 3 bước chặt chẽ:

**Bước 1: Định nghĩa Workflow (Backend Layer)**
Sử dụng `createWorkflow` và `createStep` để xây dựng logic có khả năng rollback.

```typescript
// src/workflows/sync-inventory.ts
import { createWorkflow, createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const syncStep = createStep("sync-step", async ({ locationId }, { container }) => {
  const erpService = container.resolve("erpService")
  const result = await erpService.sync(locationId)
  return new StepResponse(result)
})

export const syncInventoryWorkflow = createWorkflow("sync-inventory", (input) => {
  const result = syncStep(input)
  return result
})
```

**Bước 2: Tạo API Route kích hoạt Workflow (BFF Layer)**
Tạo một API Endpoint đóng vai trò cầu nối. API này nhận request từ Admin, trích xuất tham số, và thực thi Workflow trong Scope của request đó.

```typescript
// src/api/admin/inventory/sync/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { syncInventoryWorkflow } from "../../../../workflows/sync-inventory"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // req.scope chứa DI Container của request hiện tại
  const { result, errors } = await syncInventoryWorkflow(req.scope).run({
    input: { locationId: req.body.location_id }
  })

  if (errors.length) {
    res.status(400).json({ errors })
    return
  }
  res.json({ result })
}
```

**Bước 3: Gọi API từ Admin Widget (Frontend Layer)**
Sử dụng `useMutation` từ thư viện `@tanstack/react-query` và sdk để gọi API.

```typescript
// src/admin/widgets/inventory-sync.tsx
import { useMutation } from "@tanstack/react-query"
import { Button, useToast } from "@medusajs/ui"
import { sdk } from "../lib/sdk"

const InventorySyncWidget = () => {
  const { toast } = useToast()
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Gọi Custom Route vừa tạo ở Bước 2
      return sdk.client.fetch("/admin/inventory/sync", {
        method: "POST",
        body: { location_id: "loc_123" }
      })
    },
    onSuccess: () => toast.success("Sync started successfully"),
    onError: (err) => toast.error("Sync failed", { description: err.message })
  })

  return <Button onClick={() => mutate()} isLoading={isPending}>Sync Inventory</Button>
}
```

### 4.2. Chiến lược Data Fetching: Remote Query vs. Raw SQL

Khi xây dựng các Dashboard phân tích (Analytics), dữ liệu thường nằm rải rác ở nhiều module (Order, Product, Customer). Medusa V2 cung cấp Remote Query (`query.graph`) để giải quyết vấn đề này.

**Sử dụng Remote Query (`query.graph`):**
Đây là cách "chính thống" để truy vấn dữ liệu liên module.

```typescript
// Trong API Route
const query = req.scope.resolve("query")
const { data: orders } = await query.graph({
  entity: "order",
  fields: ["id", "total", "customer.email", "items.product.title"],
  filters: { status: "completed" }
})
```
*   **Ưu điểm:** An toàn, tuân thủ logic của các module, tự động xử lý join giữa các database khác nhau (nếu có).
*   **Nhược điểm:** Không hỗ trợ tốt các hàm tổng hợp (Aggregation) như SUM, AVG, COUNT trực tiếp trong query object (tính đến phiên bản hiện tại).

**Sử dụng Raw SQL (Knex) cho Analytics nặng:**
Đối với các báo cáo doanh thu phức tạp, việc fetch toàn bộ dữ liệu về rồi tính toán bằng JavaScript (reduce) là không tối ưu về bộ nhớ. Giải pháp là can thiệp sâu xuống tầng Database bằng InjectManager.

```typescript
// src/modules/analytics/service.ts
import { InjectManager, MedusaContext } from "@medusajs/framework/utils"
import { EntityManager } from "@mikro-orm/postgresql" // Hoặc knex tùy driver

class AnalyticsService {
  @InjectManager()
  async getRevenueStats(@MedusaContext() context: Context<EntityManager>) {
    // Sử dụng Knex query builder trực tiếp để tối ưu hiệu năng
    const knex = context.manager.getKnex()
    const result = await knex("order")
     .select(knex.raw("DATE(created_at) as date"), knex.raw("SUM(total) as revenue"))
     .where("status", "completed")
     .groupBy("date")
    return result
  }
}
```
*Lưu ý: Việc dùng Raw SQL phá vỡ tính trừu tượng của Module. Nếu bạn thay đổi database engine (ví dụ từ Postgres sang MySQL), query này có thể lỗi. Chỉ nên dùng cho các module Analytics chuyên biệt.*

## 5. Trụ cột 4: Bảo mật và Phân quyền (RBAC)

Trong môi trường doanh nghiệp (B2B, Marketplace), việc kiểm soát ai được xem gì là tối quan trọng. Medusa V2 hỗ trợ nền tảng cho RBAC nhưng yêu cầu triển khai thủ công.

### 5.1. Bảo vệ API (Backend Guards)

Không bao giờ tin tưởng Client. Mọi logic phân quyền phải nằm ở Backend. Tạo Middleware để chặn các request không hợp lệ dựa trên vai trò người dùng.

```typescript
// src/api/middlewares.ts
import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/inventory/sync",
      middlewares: [
        (req, res, next) => {
          // Custom check role logic
          const role = req.user?.metadata?.role
          if (role !== "super_admin") return res.status(403).json({ message: "Forbidden" })
          next()
        }
      ]
    }
  ]
})
```

### 5.2. Phân quyền Giao diện (Frontend Gating)

Trên Admin Dashboard, ta cần ẩn/hiện các thành phần UI dựa trên quyền để cải thiện trải nghiệm người dùng (không hiển thị nút bấm mà họ không thể dùng).

Sử dụng hook tùy chỉnh để lấy thông tin session người dùng.

```typescript
// src/admin/hooks/use-current-user.tsx
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => sdk.auth.getSession(), // Fetch thông tin session
    staleTime: Infinity // Cache vĩnh viễn trong phiên làm việc
  })
}

// Trong Widget
const DeleteProductButton = () => {
  const { data: session } = useCurrentUser()
  const role = session?.user?.metadata?.role

  if (role !== "super_admin") return null // Ẩn nút nếu không phải admin

  return <Button variant="danger">Delete Product</Button>
}
```

*Phân tích: Frontend Gating chỉ mang tính chất UX. Nếu kẻ tấn công (attacker) gọi trực tiếp API, lớp Backend Guard ở trên sẽ chặn lại. Sự kết hợp cả hai lớp tạo nên hệ thống bảo mật đa lớp (Defense in Depth).*

## 6. Trụ cột 5: Cài đặt, Triển khai và Hiệu suất

### 6.1. Chiến lược Triển khai: Merged vs. Decoupled

Có hai mô hình triển khai chính cho Medusa Admin:

**Bảng 6.1: So sánh Chiến lược Triển khai**

| Tiêu chí | Merged Deployment (Gộp) | Decoupled Deployment (Tách rời) |
| :--- | :--- | :--- |
| **Mô tả** | Admin được build thành file tĩnh và serve bởi Backend Server (Node.js/Express). | Admin deploy riêng trên CDN/Edge (Vercel, Netlify). Backend chạy riêng trên VPS/Cloud. |
| **Ưu điểm** | Đơn giản, không lo vấn đề CORS (cùng domain). Dễ setup cho dự án nhỏ. | Hiệu năng cao (CDN), scale độc lập. Backend không tốn resource serve file tĩnh. |
| **Nhược điểm** | Backend chịu tải cả API và Static files. Khó tối ưu caching headers cho static assets. | CORS Nightmare. Cấu hình phức tạp hơn. |
| **Khuyên dùng** | Development, MVP, Internal Tools. | Production quy mô lớn, Enterprise. |

### 6.2. Giải quyết Bài toán CORS trong Decoupled Deployment

Đây là điểm đau đớn nhất khi tách rời Admin và Backend. Nếu cấu hình sai, Admin sẽ không thể login hoặc fetch dữ liệu.

**Checklist Cấu hình CORS:**
1.  **Biến môi trường Backend:** Trong `medusa-config.ts` (hoặc `.env`), biến `ADMIN_CORS` phải khớp chính xác với URL của Admin trên Vercel (không được thiếu/thừa dấu `/` cuối cùng tùy cấu hình).
    ```bash
    ADMIN_CORS=https://my-admin-project.vercel.app
    AUTH_CORS=https://my-admin-project.vercel.app
    ```
    *Lưu ý: `AUTH_CORS` là bắt buộc để các endpoint xác thực (Login/Session) hoạt động.*
2.  **Authentication Type:** Mặc định Medusa dùng session (Cookie). Cookie yêu cầu cờ `SameSite=None; Secure` nếu Admin và Backend khác domain.
    *Giải pháp:* Nếu gặp quá nhiều vấn đề với Cookie trên các trình duyệt chặn 3rd-party cookie (như Safari, Chrome Incognito), hãy cân nhắc chuyển sang JWT Token (Bearer Auth) trong SDK cấu hình tại Admin, mặc dù điều này đòi hỏi thay đổi logic xác thực một chút.

### 6.3. Tối ưu Hiệu suất Build (Performance Optimization)

Admin Dashboard Medusa V2 có thể trở nên rất nặng nếu cài nhiều plugin.

**Chunk Splitting:** Cấu hình `rollupOptions` trong `vite.config.ts` để tách nhỏ các thư viện lớn.

```typescript
// medusa-config.ts -> admin.vite
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        // Tách riêng thư viện biểu đồ nặng
        recharts: ['recharts'],
        // Tách riêng các utility xử lý file
        xlsx: ['xlsx'],
      }
    }
  }
}
```

**Lazy Loading:** Luôn sử dụng `React.lazy()` cho các Custom Routes để giảm kích thước bundle ban đầu (Initial Bundle Size), giúp Admin tải nhanh hơn.

## 7. Case Study Thực hành: Xây dựng Module Analytics & Reporting

Để tổng hợp toàn bộ kiến thức, chúng ta sẽ xây dựng một tính năng "Revenue Analytics" hoàn chỉnh.

### 7.1. Yêu cầu
*   Dashboard hiển thị biểu đồ doanh thu 30 ngày gần nhất.
*   Widget tóm tắt "Tổng doanh thu hôm nay" tại trang chủ.
*   Dữ liệu phải chính xác, bao gồm cả thuế và trừ đi hàng hoàn trả.

### 7.2. Triển khai Backend
*   **Service:** Tạo `AnalyticsService` sử dụng Knex để query aggregate từ bảng `order` và `order_line_item`.
*   **API Route:** `/admin/analytics/daily-revenue`.
    *   Input: `startDate`, `endDate`.
    *   Logic: Gọi `AnalyticsService`, cache kết quả trong Redis (nếu có) trong 5 phút để giảm tải database.

### 7.3. Triển khai Frontend (Admin)
*   **Route Page:** Tạo `src/admin/routes/analytics/page.tsx`.
    *   Sử dụng `Recharts` để vẽ biểu đồ Line Chart.
    *   Sử dụng `useQuery` để fetch data từ API trên.
*   **Dashboard Widget:** Tạo `src/admin/widgets/revenue-summary.tsx`.
    *   Inject vào `dashboard.before` (nếu zone này khả dụng) hoặc `order.list.before`.
    *   Hiển thị số liệu dạng Card đơn giản.

### 7.4. Kết quả và Bài học
Case study này minh chứng rằng để mở rộng Medusa Admin, ta cần sự phối hợp nhịp nhàng giữa:
*   **Backend:** Xử lý dữ liệu thô và logic nghiệp vụ nặng.
*   **API Layer:** Cung cấp dữ liệu chuẩn hóa cho Frontend.
*   **Frontend:** Hiển thị dữ liệu và xử lý tương tác người dùng, tuân thủ Design System.

## 8. Kết luận

Làm chủ MedusaJS V2 Admin Dashboard không phải là học cách sử dụng một công cụ, mà là học cách vận hành một kiến trúc phân tán hiện đại. Sự chuyển dịch sang Vite và Module Federation đã trao quyền lực to lớn cho các nhà phát triển, cho phép tùy biến gần như mọi khía cạnh của hệ thống mà không cần phá vỡ mã nguồn lõi.

Chìa khóa thành công nằm ở tư duy "System Architect": luôn cân nhắc giữa sự tiện lợi ngắn hạn (hacking code) và tính ổn định dài hạn (sử dụng chuẩn Injection Zones). Với các kỹ thuật được trình bày trong báo cáo này, từ việc override Branding bằng Vite Alias đến việc tích hợp Workflow phức tạp, đội ngũ kỹ thuật có thể tự tin biến Medusa Admin thành một trung tâm điều hành thương mại điện tử mạnh mẽ, đáp ứng mọi nhu cầu đặc thù của doanh nghiệp.
