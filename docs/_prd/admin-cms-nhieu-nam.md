# PRD — Trang quản trị nội dung (Admin CMS)

| | |
| --- | --- |
| **Sản phẩm** | Website dự án tình nguyện *Trăng Sáng Langbiang* |
| **Tính năng** | Trang quản trị nội dung (Admin CMS) — website là khung mẫu, mọi nội dung nhập từ admin |
| **Trạng thái** | Draft — đang hoàn chỉnh |
| **Người soạn** | Ban phát triển |
| **Cập nhật** | 2026-07-17 |

---

## 1. Tổng quan (Overview)

Xây dựng một trang quản trị cho phép Ban Tổ chức tự cập nhật **mọi nội dung hiển thị trên website** — tiêu đề, thông tin SEO, bài viết tin tức, hoạt động, danh sách tình nguyện viên, nhà tài trợ, quyên góp, chi tiêu, hình ảnh… — mà **không cần lập trình viên can thiệp code**.

Toàn bộ website là một **khung mẫu (template) cố định**; **nội dung và dữ liệu đều đến từ admin**. Việc "nhiều năm" được xử lý theo hai phần tách biệt, đơn giản:

1. **Năm hiện tại** — chỉ là **một ô "số năm"** trong admin. Con số này được **đồng bộ khắp giao diện** (các nhãn năm, ngày tháng, tiêu đề…). Sang năm mới, quản trị viên chỉ cần đổi số năm và cập nhật lại nội dung ngay trên trang chính.
2. **Danh mục năm đã qua** — một phần **độc lập**. Mỗi năm đã qua là một **trang "Nhìn lại"** riêng (nội dung + hình ảnh của năm đó). Các năm này hiển thị ở **menu header dưới dạng dropdown** để khách xem lại.

---

## 2. Bối cảnh & Vấn đề (Problem)

Hiện tại toàn bộ nội dung website được "gắn cứng" trong mã nguồn. Điều này gây ra các vấn đề:

- **Phụ thuộc lập trình viên:** mỗi lần sửa một dòng tiêu đề, thêm một bài tin, đổi ngày tổ chức… đều phải nhờ người biết code chỉnh sửa và triển khai lại. Ban Tổ chức không tự làm được.
- **Chuyển năm thủ công, dễ mất dữ liệu:** website đang gắn với một năm cụ thể. Sang năm sau, không có cách nào đổi số năm hiển thị hay lưu lại năm cũ thành trang "nhìn lại" một cách có tổ chức.
- **Rủi ro & chậm trễ:** thay đổi nội dung nhỏ cũng phải qua quy trình kỹ thuật, dễ sai sót và mất thời gian, đặc biệt trong giai đoạn cao điểm trước sự kiện.

**Hệ quả:** website khó "sống" lâu dài và tự vận hành qua các năm nếu không có người kỹ thuật đồng hành liên tục.

---

## 3. Mục tiêu & Không mục tiêu

### 3.1. Mục tiêu (Goals)

- **G1.** Ban Tổ chức tự chỉnh sửa được **100% nội dung biên tập** của website qua giao diện quản trị, không đụng code.
- **G2.** **Chuyển năm dễ dàng:** đổi "số năm hiện tại" trong admin và số năm tự đồng bộ khắp giao diện.
- **G3.** **Lưu trữ năm đã qua:** tự thêm/sửa các trang "Nhìn lại" theo năm; khách xem lại qua dropdown năm ở header.
- **G4.** **Xuất bản (publish)** thay đổi khi sẵn sàng — nội dung ra công chúng gần như tức thì.
- **G5.** Quản lý được **SEO/metadata** (tiêu đề trang, mô tả, từ khoá, ảnh chia sẻ).
- **G6.** Có **đăng nhập bảo vệ** khu vực quản trị.

### 3.2. Không mục tiêu (Non-goals)

- Không giữ **đồng thời nhiều bản nội dung trang chính theo từng năm**; trang chính là **một bộ nội dung duy nhất** + số năm. (Năm cũ được lưu riêng ở "danh mục năm đã qua".)
- Không làm hệ thống **nhiều tài khoản/phân quyền** (dùng một lối đăng nhập chung cho Ban Tổ chức).
- Không làm **đa ngôn ngữ** (website hiện chỉ tiếng Việt).
- Không làm **lịch sử phiên bản/khôi phục** chi tiết từng lần sửa.
- Không xây **backend cho form đăng ký nhận bản tin** (giữ nguyên hành vi hiện tại).

---

## 4. Đối tượng người dùng (Personas)

### P1 — Quản trị viên (Ban Tổ chức)
- **Là ai:** thành viên Ban Tổ chức, không chuyên kỹ thuật.
- **Mục tiêu:** cập nhật nội dung nhanh, đúng, an toàn; chuyển sang năm mới mỗi mùa và lưu lại năm cũ.
- **Nỗi đau:** hiện phải nhờ người code; sợ làm hỏng website.
- **Kỳ vọng:** giao diện dễ hiểu như soạn thảo văn bản; xem trước được; bấm là xong.

### P2 — Khách truy cập (Công chúng / Nhà hảo tâm / TNV tiềm năng)
- **Là ai:** người quan tâm dự án, muốn tìm hiểu, đăng ký, hoặc ủng hộ.
- **Mục tiêu:** xem thông tin năm hiện tại, đọc tin tức, **xem lại các năm đã qua**.
- **Kỳ vọng:** nội dung luôn mới, chính xác; trang tải nhanh; tìm thấy qua Google/Facebook.

---

## 5. User Stories

### Epic A — Chỉnh sửa nội dung trang chính
- **A1.** Là quản trị viên, tôi muốn **sửa tiêu đề, mô tả, thông tin liên hệ** của website để thông tin luôn cập nhật.
- **A2.** Là quản trị viên, tôi muốn **thêm/sửa/xoá và sắp xếp** các mục dạng danh sách (tin tức, hoạt động, nhà tài trợ, tình nguyện viên, lịch trình, quyên góp, cảm nhận, chi tiêu…) để phản ánh thực tế.
- **A3.** Là quản trị viên, tôi muốn **viết bài tin tức nhiều đoạn, gắn ảnh và nhãn** để đăng lên mục Tin tức.
- **A4.** Là quản trị viên, tôi muốn **cập nhật/đính kèm hình ảnh** (thư viện ảnh, logo tài trợ, ảnh bài viết, ảnh chia sẻ mạng xã hội) mà không cần thao tác kỹ thuật.

### Epic B — Năm hiện tại (số năm đồng bộ)
- **B1.** Là quản trị viên, tôi muốn **điền/đổi "số năm hiện tại"** ở một chỗ trong admin.
- **B2.** Là quản trị viên, tôi muốn **số năm đó tự hiển thị đúng ở mọi nơi trên giao diện** (nhãn năm, ngày tổ chức, tiêu đề…), không phải đi sửa từng chỗ.

### Epic C — Danh mục năm đã qua (độc lập)
- **C1.** Là quản trị viên, tôi muốn **tạo một trang "Nhìn lại" cho một năm đã qua** với đầy đủ các phần: **Tổng kết · Khoảnh khắc (thư viện ảnh) · Đại gia đình (TNV) · Những con số · Nhà tài trợ** (đúng như trang `/2025` hiện tại).
- **C2.** Là quản trị viên, tôi muốn **thêm/sửa/xoá và sắp xếp** danh mục các năm đã qua độc lập với trang chính.
- **C3.** Là khách truy cập, tôi muốn **thấy danh sách các năm đã qua trong một dropdown ở menu header** và bấm vào để mở trang năm đó.

### Epic D — Xuất bản
- **D1.** Là quản trị viên, tôi muốn **thay đổi được lưu tự động** để không mất công khi đang soạn.
- **D2.** Là quản trị viên, tôi muốn **bấm "Xuất bản"** để đưa nội dung ra công chúng, và khách thấy được ngay.
- **D3.** Là khách truy cập, tôi **chỉ thấy nội dung đã xuất bản**, không thấy bản nháp đang soạn dở.

### Epic E — SEO / Khả năng tìm thấy
- **E1.** Là quản trị viên, tôi muốn **sửa tiêu đề, mô tả, từ khoá, ảnh chia sẻ** để tối ưu hiển thị trên Google và mạng xã hội.

### Epic F — Truy cập & Bảo mật
- **F1.** Là quản trị viên, tôi muốn **đăng nhập bằng mật khẩu** để vào khu vực quản trị.
- **F2.** Là quản trị viên, tôi muốn **đăng xuất**, và người chưa đăng nhập **không vào được** khu quản trị.

---

## 6. Yêu cầu chức năng (Functional Requirements)

> Mô tả ở mức năng lực sản phẩm; chi tiết kỹ thuật nằm ở tài liệu thiết kế riêng.

### 6.1. Nội dung quản lý được

**A. Trang chính (một bộ nội dung + số năm hiện tại):**
thông tin thương hiệu & SEO, **số năm hiện tại**, ngày tổ chức, địa điểm, thống kê, hoạt động, lịch trình, thư viện ảnh, tình nguyện viên, nhà tài trợ, ban tổ chức, quyên góp, cảm nhận, báo cáo chi tiêu, lý do tham gia, câu hỏi thường gặp, kênh gây quỹ, và **tin tức** (dòng bài viết liên tục, hiển thị mới nhất trước).

**B. Danh mục năm đã qua (mỗi năm một trang "Nhìn lại", độc lập):**
tiêu đề/giới thiệu năm, **Tổng kết**, **Khoảnh khắc** (thư viện ảnh), **Đại gia đình** (TNV), **Những con số**, **Nhà tài trợ**.

### 6.2. Năng lực chính

- **FR1 — Đăng nhập/đăng xuất** bảo vệ khu quản trị.
- **FR2 — Chỉnh sửa mọi nhóm nội dung** trang chính, gồm thêm/sửa/xoá/sắp xếp cho các mục dạng danh sách.
- **FR3 — Số năm hiện tại:** một trường duy nhất, tự đồng bộ ra toàn giao diện.
- **FR4 — Danh mục năm đã qua:** tạo/sửa/xoá/sắp xếp các trang "Nhìn lại" theo năm; tự sinh **dropdown năm ở header**.
- **FR5 — Lưu nháp tự động** trong khi soạn.
- **FR6 — Xuất bản** để công khai thay đổi, cập nhật gần như tức thì (không cần deploy).
- **FR7 — Quản lý hình ảnh:** tải ảnh lên hoặc gắn ảnh cho các trường cần ảnh.
- **FR8 — Quản lý SEO/metadata.**

### 6.3. Yêu cầu phi chức năng

- **Tin cậy:** thao tác sai trong admin không được làm "vỡ" website công khai.
- **Hiệu năng:** website công khai tải nhanh; chỉ cập nhật khi có xuất bản.
- **Dễ dùng:** người không chuyên kỹ thuật tự thao tác được sau hướng dẫn ngắn.
- **An toàn:** khu quản trị chỉ người có mật khẩu truy cập được.

---

## 7. Tiêu chí nghiệm thu (Acceptance Criteria)

**AC-1 (F1/F2 · Đăng nhập)**
- *Given* người dùng chưa đăng nhập, *when* mở khu quản trị, *then* bị chuyển tới trang đăng nhập.
- *Given* nhập đúng mật khẩu, *then* vào được; nhập sai *then* báo lỗi và không vào được.

**AC-2 (A1/A2 · Chỉnh sửa)**
- *Given* đang ở một mục nội dung, *when* sửa một trường và chờ giây lát, *then* thay đổi được lưu nháp tự động (có báo "đã lưu").
- *Given* một mục danh sách, *when* thêm/xoá/kéo sắp xếp phần tử, *then* thứ tự và số lượng cập nhật đúng.

**AC-3 (B1/B2 · Số năm hiện tại)**
- *Given* đổi "số năm hiện tại" từ 2026 sang 2027 rồi xuất bản, *then* **mọi nơi trên giao diện** hiển thị năm/ngày tháng theo 2027 mà không phải sửa thủ công từng chỗ.

**AC-4 (C1/C3 · Năm đã qua)**
- *Given* tạo trang "Nhìn lại 2026" (Tổng kết, Khoảnh khắc, Đại gia đình, Những con số, Nhà tài trợ) rồi xuất bản, *then* năm 2026 xuất hiện trong **dropdown năm ở header**, và bấm vào mở đúng trang nhìn lại 2026.

**AC-5 (D2/D3 · Xuất bản)**
- *Given* có thay đổi nháp, *when* bấm "Xuất bản" rồi tải lại trang công khai, *then* nội dung mới hiển thị mà **không cần** deploy lại.
- *Given* đang sửa nhưng **chưa** xuất bản, *when* khách mở website công khai, *then* vẫn thấy nội dung đã xuất bản trước đó, không thấy bản nháp.

**AC-6 (E1 · SEO)**
- *Given* sửa tiêu đề/mô tả/ảnh chia sẻ, *when* xuất bản, *then* thông tin hiển thị đúng khi chia sẻ liên kết và khi xem mã nguồn trang.

**AC-7 (A4/FR7 · Ảnh)**
- *Given* một trường ảnh, *when* tải ảnh lên hoặc gắn liên kết ảnh, *then* ảnh hiển thị đúng ở phần xem trước và trên website công khai sau khi xuất bản.

---

## 8. Chỉ số thành công (Success Metrics)

- **M1.** **100%** nội dung biên tập chỉnh sửa được qua admin (không còn nội dung phải sửa bằng code).
- **M2.** **0** lần cần lập trình viên can thiệp để cập nhật nội dung, đổi năm, hay thêm trang năm đã qua sau khi bàn giao.
- **M3.** Đổi số năm hiện tại và cập nhật trang chính cho mùa mới trong **dưới 30 phút** thao tác admin.
- **M4.** Thời gian từ lúc **xuất bản** đến khi khách thấy thay đổi: **gần tức thì** (không cần deploy).
- **M5.** Quản trị viên không chuyên kỹ thuật tự hoàn thành các thao tác cơ bản (sửa bài, đổi ảnh, đổi năm, xuất bản) **không cần hỗ trợ** sau một buổi hướng dẫn.

---

## 9. Cột mốc (Milestones)

- **Mốc 1 — Nền tảng & đăng nhập:** khung quản trị + bảo vệ đăng nhập; lưu nháp/xuất bản hoạt động ở mức tối thiểu.
- **Mốc 2 — Nội dung trang chính:** editor cho toàn bộ nhóm nội dung trang chính + tin tức + số năm hiện tại.
- **Mốc 3 — Năm đã qua:** quản lý danh mục các trang "Nhìn lại" + dropdown năm ở header.
- **Mốc 4 — Hình ảnh & SEO:** quản lý ảnh và metadata.
- **Mốc 5 — Hoàn thiện & bàn giao:** rà soát trải nghiệm, kiểm thử, tài liệu hướng dẫn cho Ban Tổ chức.

---

## 10. Quyết định & Rủi ro

### 10.1. Quyết định đã chốt
- **D-Ảnh (Q1):** **Cho phép tải ảnh lên** trong admin (lưu trên dịch vụ lưu trữ ảnh — đề xuất Vercel Blob), **đồng thời** vẫn cho dán liên kết/đường dẫn ảnh có sẵn.
- **D-Soạn nội dung:** các trường **nội dung dài** (nội dung bài tin tức, phần Tổng kết của năm đã qua, mô tả dài) dùng **trình soạn thảo CKEditor** (định dạng chữ, danh sách, chèn ảnh…). Các trường ngắn (tiêu đề, nhãn…) dùng ô nhập thường.
- **D-Đồng bộ số năm (Q2):** đã rà xong **danh sách cụ thể các vị trí** hiển thị năm cần đồng bộ — xem *Phụ lục A* trong [FRD](./frd-admin-cms.md).
- **D-Năm cũ:** khi chuyển năm, trang "Nhìn lại" của năm cũ **nhập độc lập**, có thêm **nút "Sao chép từ nội dung hiện tại"** để tạo nhanh rồi chỉnh.

### 10.2. Rủi ro
- **R1 — Sai sót nội dung:** không có bước xem trước, nên cần cơ chế lưu nháp rõ ràng và **xác nhận trước khi xuất bản** để giảm rủi ro đăng nhầm.
- **R2 — Bảo mật mật khẩu chung:** phù hợp nhóm nhỏ; cân nhắc nâng cấp nếu số người quản trị tăng.
- **R3 — Phụ thuộc dịch vụ lưu ảnh:** ~~cần bật Vercel Blob~~ **đã bật** (store public + token). Lưu ý vận hành: store Blob **phải ở chế độ Public**, store Private sẽ khiến ảnh trả 403 trên site. Nếu token chưa cấu hình, hệ thống vẫn chạy ở chế độ dán liên kết ảnh.

---

> **Ghi chú:** Tài liệu này mô tả *yêu cầu sản phẩm*. Chi tiết kiến trúc, mô hình dữ liệu, phân rã công việc kỹ thuật và danh sách file được tách sang tài liệu thiết kế kỹ thuật riêng.
