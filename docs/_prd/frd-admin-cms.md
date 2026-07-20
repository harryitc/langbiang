# FRD — Đặc tả chức năng chi tiết (Admin CMS)

> Phân rã chi tiết từng yêu cầu chức năng (FR) trong [PRD](./admin-cms-nhieu-nam.md).
> Mỗi FR gồm: mục đích · màn hình · trường dữ liệu · luồng thao tác · quy tắc · thông báo · ngoại lệ · nghiệm thu.
> Cập nhật: 2026-07-17

## Mục lục
- [FR1 — Đăng nhập / Đăng xuất](#fr1--đăng-nhập--đăng-xuất)
- [FR2 — Chỉnh sửa nội dung trang chính](#fr2--chỉnh-sửa-nội-dung-trang-chính)
- [FR3 — Số năm hiện tại (đồng bộ giao diện)](#fr3--số-năm-hiện-tại-đồng-bộ-giao-diện)
- [FR4 — Danh mục năm đã qua + dropdown header](#fr4--danh-mục-năm-đã-qua--dropdown-header)
- [FR5 — Lưu nháp tự động](#fr5--lưu-nháp-tự-động)
- [FR6 — Xuất bản](#fr6--xuất-bản)
- [FR7 — Quản lý hình ảnh](#fr7--quản-lý-hình-ảnh)
- [FR8 — Quản lý SEO / Metadata](#fr8--quản-lý-seo--metadata)

---

## FR1 — Đăng nhập / Đăng xuất

**Mục đích:** bảo vệ khu quản trị, chỉ Ban Tổ chức truy cập.

**Màn hình:** Trang đăng nhập; nút Đăng xuất trên thanh công cụ admin.

**Trường dữ liệu (đăng nhập):**

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| Mật khẩu | password | Có | So với mật khẩu chung của Ban Tổ chức |

**Luồng thao tác:**
1. Người dùng mở địa chỉ khu quản trị.
2. Nếu chưa đăng nhập → chuyển tới trang đăng nhập.
3. Nhập mật khẩu → xác thực.
4. Đúng → vào khu quản trị và giữ phiên đăng nhập; Sai → báo lỗi, ở lại trang đăng nhập.
5. Bấm Đăng xuất → kết thúc phiên, quay về trang đăng nhập.

**Quy tắc nghiệp vụ:**
- FR1-R1: Mọi trang/thao tác trong admin yêu cầu đã đăng nhập.
- FR1-R2: Phiên đăng nhập được giữ qua nhiều lần truy cập cho tới khi Đăng xuất hoặc hết hạn.
- FR1-R3: Khu quản trị không được lập chỉ mục bởi công cụ tìm kiếm.

**Thông báo & trạng thái:** "Sai mật khẩu, vui lòng thử lại." · "Đăng nhập thành công." · "Đã đăng xuất."

**Ngoại lệ:** để trống mật khẩu → nhắc nhập; nhập sai nhiều lần → vẫn cho thử lại (giai đoạn này không khoá).

**Nghiệm thu:**
- [ ] Chưa đăng nhập mở admin → về trang đăng nhập.
- [ ] Sai mật khẩu → báo lỗi, không vào được.
- [ ] Đúng mật khẩu → vào được, phiên được giữ.
- [ ] Đăng xuất → không vào lại được nếu chưa đăng nhập.

---

## FR2 — Chỉnh sửa nội dung trang chính

**Mục đích:** cho phép sửa toàn bộ nội dung của trang chính (một bộ duy nhất) qua các editor theo nhóm.

**Màn hình:** Menu bên trái liệt kê các nhóm nội dung; mỗi nhóm mở một editor riêng.

**Quy tắc chung cho mọi editor:**
- FR2-R1: Sửa trường → tự lưu nháp (xem [FR5](#fr5--lưu-nháp-tự-động)).
- FR2-R2: Nhóm dạng danh sách hỗ trợ **Thêm / Sửa / Xoá / Kéo sắp xếp** phần tử; xoá có xác nhận.
- FR2-R3: Trường bắt buộc để trống → cảnh báo, không cho lưu phần tử đó.
- FR2-R4: Trường ảnh dùng thành phần ảnh chung ([FR7](#fr7--quản-lý-hình-ảnh)).
- FR2-R8: **Trường nội dung dài dùng trình soạn thảo CKEditor** (rich text): định dạng chữ, danh sách, liên kết, chèn ảnh. Áp dụng cho: **nội dung bài tin tức (2.16)**, **phần Tổng kết của trang "Nhìn lại" ([FR4](#fr4--danh-mục-năm-đã-qua--dropdown-header))**, và các mô tả dài khác nếu cần. Ảnh chèn trong CKEditor đi qua cùng cơ chế [FR7](#fr7--quản-lý-hình-ảnh). Nội dung lưu ở dạng có định dạng (HTML an toàn).

### Phân rã các nhóm nội dung (editor con)

| # | Nhóm (editor) | Kiểu | Trường dữ liệu |
| --- | --- | --- | --- |
| 2.1 | **Thương hiệu & liên hệ** | đơn | Tên dự án, tên rút gọn, khẩu hiệu (tagline), phụ đề, mô tả, Facebook, email, link Shopee |
| 2.2 | **Thông tin sự kiện** | đơn | Nhãn ngày (hiển thị), ngày ISO, ngày kết thúc, địa điểm |
| 2.3 | **Con số nổi bật (stats)** | danh sách | Giá trị số, hậu tố (vd "+"), nhãn |
| 2.4 | **Hoạt động (activities)** | danh sách | Biểu tượng, tiêu đề, mô tả |
| 2.5 | **Lịch trình (timeline)** | danh sách 2 cấp | Ngày (nhãn + ngày) → các mốc: giờ, tiêu đề, mô tả |
| 2.6 | **Thư viện ảnh (gallery)** | danh sách | Ảnh, chú thích, mô tả, cờ "ảnh cao" |
| 2.7 | **Lý do tham gia (whyJoin)** | danh sách | Biểu tượng, tiêu đề, mô tả |
| 2.8 | **Câu hỏi thường gặp (FAQ)** | danh sách | Câu hỏi, câu trả lời |
| 2.9 | **Gây quỹ (fundraising)** | đơn + danh sách | Tiêu đề, mô tả; kênh: biểu tượng, tên, ghi chú, nhãn nút, liên kết, cờ nổi bật |
| 2.10 | **Tình nguyện viên** | danh sách 2 cấp + số | Ban: tên ban → danh sách tên thành viên; tổng số TNV |
| 2.11 | **Nhà tài trợ (sponsors)** | danh sách 2 cấp | Hạng tài trợ → đơn vị: tên, logo, website, giới thiệu ngắn |
| 2.12 | **Ban tổ chức (board)** | 2 danh sách | Sáng lập & Thành viên: họ tên, vai trò, ảnh, giới thiệu |
| 2.13 | **Đóng góp (donations)** | danh sách | Tên người/đơn vị, số tiền (tuỳ chọn), hiện vật (tuỳ chọn), ngày |
| 2.14 | **Cảm nhận (testimonials)** | danh sách | Tên, vai trò, ảnh đại diện, trích dẫn |
| 2.15 | **Báo cáo chi tiêu (spending)** | đơn + danh sách | Khoản mục: biểu tượng, tên khoản, số tiền, ghi chú; tổng cộng; ghi chú cập nhật |
| 2.16 | **Tin tức (news)** | danh sách | Định danh/slug, nhãn, tiêu đề, tóm tắt, nội dung nhiều đoạn, ảnh, liên kết bài gốc |

**Quy tắc riêng đáng chú ý:**
- FR2-R5 (2.2/FR3): năm trong nhãn ngày/ngày ISO liên quan tới "số năm hiện tại" — xem [FR3](#fr3--số-năm-hiện-tại-đồng-bộ-giao-diện).
- FR2-R6 (2.13): mỗi đóng góp phải có **ít nhất** số tiền **hoặc** hiện vật.
- FR2-R7 (2.16): định danh bài tin phải **duy nhất**; đây là đường dẫn bài viết; nội dung để trống thì hiển thị theo tóm tắt.

**Thông báo & trạng thái:** "Đã lưu nháp." · "Cần điền {tên trường}." · "Xoá mục này?" (xác nhận).

**Ngoại lệ:** trùng định danh bài tin → báo và yêu cầu đổi; danh sách rỗng → hiển thị trạng thái "Chưa có mục nào".

**Nghiệm thu:**
- [ ] Sửa mỗi nhóm ở bảng trên → tự lưu nháp.
- [ ] Thêm/xoá/sắp xếp phần tử ở nhóm danh sách hoạt động đúng.
- [ ] Bỏ trống trường bắt buộc → cảnh báo.
- [ ] Trùng định danh bài tin → chặn.

---

## FR3 — Số năm hiện tại (đồng bộ giao diện)

**Mục đích:** đổi năm hiển thị toàn site chỉ bằng một thao tác, không phải sửa từng chỗ.

**Màn hình:** một trường "Số năm hiện tại" (đề xuất đặt ở nhóm Thông tin sự kiện).

**Trường dữ liệu:**

| Trường | Kiểu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| Số năm hiện tại | số (4 chữ số) | Có | vd 2026 |

**Luồng thao tác:** đổi số năm → lưu nháp → xuất bản → mọi vị trí gắn năm trên giao diện cập nhật.

**Quy tắc nghiệp vụ:**
- FR3-R1: **Đã rà xong** danh sách các vị trí hiển thị năm cần đồng bộ — xem [Phụ lục A](#phụ-lục-a--danh-sách-vị-trí-đồng-bộ-số-năm).
- FR3-R2: Số năm không hợp lệ (không phải 4 chữ số) → chặn.
- FR3-R3: "Số năm hiện tại" độc lập với "danh mục năm đã qua" ([FR4](#fr4--danh-mục-năm-đã-qua--dropdown-header)).

**Thông báo:** "Số năm không hợp lệ." · "Đã lưu nháp."

**Ngoại lệ:** để trống → giữ giá trị cũ và cảnh báo.

**Nghiệm thu:**
- [ ] Đổi 2026 → 2027, xuất bản → các vị trí trong danh sách FR3-R1 hiển thị 2027.
- [ ] Nhập năm sai định dạng → chặn.

---

## FR4 — Danh mục năm đã qua + dropdown header

**Mục đích:** lưu lại từng năm đã qua thành một trang "Nhìn lại" độc lập; khách xem qua dropdown năm ở header.

**Màn hình:** danh sách "Năm đã qua" trong admin; mỗi năm mở editor trang "Nhìn lại".

**Trường dữ liệu — một năm đã qua:**

| Phần | Trường |
| --- | --- |
| **Thông tin đầu trang** | Năm, tiêu đề, phụ đề, nhãn eyebrow, ảnh nền |
| **Tổng kết** | Nội dung tổng kết (văn bản/nhiều đoạn) |
| **Khoảnh khắc (thư viện ảnh)** | Danh sách ảnh: ảnh, chú thích, cờ "ảnh cao" |
| **Đại gia đình (TNV)** | Danh sách ban/tên thành viên (như 2.10) |
| **Những con số** | Danh sách con số (như 2.3) |
| **Nhà tài trợ** | Danh sách hạng + đơn vị (như 2.11) |

**Luồng thao tác:**
1. Thêm một năm mới vào danh mục → nhập năm + các phần nội dung.
2. Lưu nháp → xuất bản.
3. Năm xuất hiện trong **dropdown "Năm" ở header**; bấm vào mở đúng trang "Nhìn lại" của năm đó.

**Quy tắc nghiệp vụ:**
- FR4-R1: Năm trong danh mục phải **duy nhất**; là đường dẫn trang (vd `/2025`).
- FR4-R2: Dropdown header liệt kê **tất cả năm đã qua** đã xuất bản, sắp xếp **mới → cũ**.
- FR4-R3: Danh mục rỗng → header **không hiện** dropdown năm.
- FR4-R4: Mỗi phần trong trang "Nhìn lại" nếu để trống thì **ẩn** phần đó trên giao diện (không hiện tiêu đề trống).
- FR4-R5: Xoá một năm khỏi danh mục có xác nhận; sau khi xuất bản, trang năm đó không còn truy cập được.

**Thông báo:** "Năm đã tồn tại trong danh mục." · "Xoá năm {năm} khỏi danh mục?"

**Ngoại lệ:** trùng năm → chặn; ảnh trong thư viện tải lỗi → hiển thị ảnh thay thế.

**Nghiệm thu:**
- [ ] Tạo "Nhìn lại 2026" đủ 5 phần, xuất bản → 2026 vào dropdown header.
- [ ] Bấm 2026 trong dropdown → mở đúng trang với 5 phần.
- [ ] Phần để trống → ẩn trên giao diện.
- [ ] Danh mục rỗng → header không có dropdown năm.
- [ ] Trùng năm → chặn.

---

## FR5 — Lưu nháp tự động

**Mục đích:** không mất công khi đang soạn; tách bản nháp khỏi bản công khai.

**Luồng thao tác:** sửa trường → sau một khoảng ngắn dừng gõ → tự lưu vào bản nháp; hiển thị trạng thái lưu.

**Quy tắc nghiệp vụ:**
- FR5-R1: Nháp là **riêng của admin**, không ảnh hưởng nội dung khách đang xem.
- FR5-R2: Mọi nhóm nội dung ([FR2](#fr2--chỉnh-sửa-nội-dung-trang-chính)/[FR4](#fr4--danh-mục-năm-đã-qua--dropdown-header)) đều áp dụng lưu nháp.
- FR5-R3: Có chỉ báo trạng thái: "Đang lưu…" → "Đã lưu" (và "Lưu thất bại" nếu lỗi).

**Thông báo & trạng thái:** "Đang lưu…" · "Đã lưu" · "Lưu thất bại — thử lại."

**Ngoại lệ:** mất kết nối khi lưu → báo "Lưu thất bại", cho thử lại; không mất dữ liệu đang nhập trên màn hình.

**Nghiệm thu:**
- [ ] Sửa trường rồi dừng gõ → thấy "Đã lưu".
- [ ] Tải lại trang admin → nội dung nháp còn nguyên.
- [ ] Khi đang có nháp, khách vẫn thấy bản đã xuất bản.

---

## FR6 — Xuất bản

**Mục đích:** đưa nội dung nháp ra công khai, cập nhật gần như tức thì.

**Màn hình:** nút "Xuất bản" trên thanh công cụ admin.

**Luồng thao tác:**
1. Bấm "Xuất bản" → xác nhận.
2. Bản nháp trở thành bản công khai.
3. Trang công khai cập nhật gần như ngay (không cần deploy).

**Quy tắc nghiệp vụ:**
- FR6-R1: Xuất bản áp dụng cho **toàn bộ** nội dung nháp hiện tại (trang chính + danh mục năm đã qua + số năm).
- FR6-R2: Trước khi xuất bản có **bước xác nhận** (do không có xem trước).
- FR6-R3: Sau xuất bản, nháp và công khai đồng nhất.

**Thông báo:** "Xuất bản thay đổi? Nội dung sẽ hiển thị công khai." · "Đã xuất bản." · "Xuất bản thất bại — thử lại."

**Ngoại lệ:** lỗi khi xuất bản → giữ nguyên bản công khai cũ, báo lỗi, cho thử lại.

**Nghiệm thu:**
- [ ] Bấm Xuất bản → xác nhận → tải lại trang công khai thấy nội dung mới.
- [ ] Không cần deploy vẫn thấy thay đổi.
- [ ] Lỗi xuất bản → bản công khai cũ không bị hỏng.

---

## FR7 — Quản lý hình ảnh

**Mục đích:** gắn ảnh cho các trường cần ảnh mà không cần thao tác kỹ thuật.

**Áp dụng cho các trường ảnh:** thư viện ảnh trang chính & trang "Nhìn lại", logo tài trợ, ảnh ban tổ chức, ảnh đại diện cảm nhận, ảnh bài tin, ảnh chia sẻ mạng xã hội (OG), ảnh nền trang "Nhìn lại".

**Luồng thao tác (2 cách):**
- Cách A — **Tải ảnh lên** từ máy → nhận đường dẫn ảnh → xem thu nhỏ.
- Cách B — **Dán liên kết/đường dẫn ảnh** có sẵn.

**Quy tắc nghiệp vụ:**
- FR7-R1: Chấp nhận định dạng ảnh phổ biến (jpg, png, webp…).
- FR7-R2: Có xem thu nhỏ (preview ảnh) sau khi chọn.
- FR7-R3: Cho phép xoá/đổi ảnh đã chọn.
- FR7-R4: **Đã chốt & đã bật** — hỗ trợ **cả hai**: tải ảnh lên (Vercel Blob) và dán liên kết. Ảnh chèn trong CKEditor ([FR2-R8](#fr2--chỉnh-sửa-nội-dung-trang-chính)) dùng chung cơ chế này. Khi chưa cấu hình token, nút Tải lên báo lỗi rõ ràng và vẫn dùng được Cách B (dán liên kết).
- FR7-R5: **Store Blob phải ở chế độ Public.** Store Private cho URL `*.private.blob…` và khách nhận **403** → ảnh không hiện. Chế độ này chốt lúc tạo store, không sửa được sau.
- FR7-R6: Chỉ **admin đã đăng nhập** mới được cấp token tải lên (khách → 401). Giới hạn **20MB**/ảnh.

**Thông báo:** "Tệp không phải ảnh hợp lệ." · "Tải ảnh thất bại — thử lại."

**Ngoại lệ:** ảnh lỗi/không tải được trên giao diện → hiển thị ảnh thay thế; tệp quá lớn → báo giới hạn.

**Nghiệm thu:**
- [ ] Gắn ảnh cho gallery / logo tài trợ / ảnh bài tin / OG → hiển thị đúng sau xuất bản.
- [ ] Dán liên kết ảnh → hiển thị đúng.
- [ ] (Nếu bật tải lên) tải ảnh từ máy → dùng được.

---

## FR8 — Quản lý SEO / Metadata

**Mục đích:** tối ưu hiển thị website trên Google và khi chia sẻ mạng xã hội.

**Màn hình:** phần SEO trong nhóm Thương hiệu (SEO toàn site).

**Trường dữ liệu:**

| Trường | Kiểu | Ghi chú |
| --- | --- | --- |
| Tiêu đề trang | text | Dùng cho thẻ tiêu đề & mạng xã hội |
| Mô tả | text dài | Mô tả ngắn cho tìm kiếm & chia sẻ |
| Từ khoá | danh sách | Từ khoá SEO |
| Ảnh chia sẻ (OG) | ảnh | Ảnh khi chia sẻ liên kết ([FR7](#fr7--quản-lý-hình-ảnh)) |

**Luồng thao tác:** sửa các trường SEO → lưu nháp → xuất bản → cập nhật thẻ meta của trang.

**Quy tắc nghiệp vụ:**
- FR8-R1: Bài tin tức tự sinh SEO theo tiêu đề/tóm tắt/ảnh của bài.
- FR8-R2: Số năm trong tiêu đề/mô tả SEO đồng bộ theo [FR3](#fr3--số-năm-hiện-tại-đồng-bộ-giao-diện).
- FR8-R3: Để trống trường SEO → dùng giá trị mặc định hợp lý (không để trống thẻ meta).

**Thông báo:** "Đã lưu nháp."

**Ngoại lệ:** mô tả quá dài → gợi ý độ dài phù hợp (không bắt buộc chặn).

**Nghiệm thu:**
- [ ] Sửa tiêu đề/mô tả/ảnh OG, xuất bản → xem mã nguồn trang thấy đúng.
- [ ] Chia sẻ liên kết lên mạng xã hội hiển thị đúng tiêu đề/mô tả/ảnh.
- [ ] Trang bài tin có SEO riêng theo bài.

---

## Ma trận truy vết FR ↔ User Story ↔ Acceptance (PRD)

| FR | User Story (PRD) | Acceptance (PRD) |
| --- | --- | --- |
| FR1 | F1, F2 | AC-1 |
| FR2 | A1, A2, A3, A4 | AC-2 |
| FR3 | B1, B2 | AC-3 |
| FR4 | C1, C2, C3 | AC-4 |
| FR5 | D1 | AC-2, AC-5 |
| FR6 | D2, D3 | AC-5, AC-6 |
| FR7 | A4 | AC-7 |
| FR8 | E1 | AC-6 |

---

## Phụ lục A — Danh sách vị trí đồng bộ số năm

Rà từ mã nguồn hiện tại. Chia 3 nhóm theo cách xử lý:

### A1. Chrome/khung giao diện — tự thay theo "số năm hiện tại" (FR3)
Các chỗ chỉ là **con số năm** trong khung layout, không phải nội dung biên tập; thay tự động theo số năm hiện tại.

| Vị trí | Chuỗi hiện tại |
| --- | --- |
| Tiêu đề trang (template) | `… — {tagline} 2026` |
| Nút đăng ký ở header phụ | "Đăng ký 2026" |
| Thẻ Chương trình (ExploreGrid) | "Chương trình 2026" |
| Eyebrow/tiêu đề trang Chương trình | "Chương trình 2026" |
| Mục About | "Mùa 2 · 2026" |
| Kêu gọi tài trợ (Sponsors) | "…đơn vị đồng hành mùa 2026?" |
| Kêu gọi ban tổ chức | "…đội ngũ mùa 2026?" |
| Bản tin (News/tin-tuc) | "…mùa 2026" |
| Ghi chú đóng góp (Donations) | "…cập nhật đầy đủ trong mùa 2026" |
| Chân trang (Footer) | "© 2026 …" |
| CTA cuối trang "Nhìn lại" | "Sẵn sàng cho mùa 2026?" |

### A2. Trường nội dung/sự kiện — admin nhập, năm nằm trong dữ liệu (FR2)
Năm là một phần dữ liệu do admin nhập; đổi năm bằng cách sửa trường tương ứng (nên tách phần "năm" ra để đồng bộ được):

| Vị trí | Nguồn |
| --- | --- |
| Nhãn ngày tổ chức | Thông tin sự kiện — `Nhãn ngày` ("Ngày 26 – 27 tháng 9 năm 2026") |
| Ngày ISO / ngày kết thúc | Thông tin sự kiện — `dateISO`, `dateEnd` |
| Mốc lịch trình | Timeline — ngày từng mốc (26/09/2026, 27/09/2026) |
| Mô tả & từ khoá SEO | Thương hiệu/SEO — có chuỗi "Mùa 2026…", "dự án tình nguyện 2026" |
| Dòng ngày ở khối Timeline | "26 – 27 tháng 9 năm 2026" |

### A3. Suy ra từ ngày sự kiện — không nhập tay
Tự tính từ trường ngày sự kiện (A2), không cần nhập năm riêng:

| Vị trí | Suy ra từ |
| --- | --- |
| Đồng hồ đếm ngược (Countdown) | Ngày bắt đầu sự kiện |
| JSON-LD sự kiện (startDate/endDate, name) | Ngày sự kiện + số năm hiện tại |

> **Ghi chú thiết kế:** để "đổi 1 chỗ, đồng bộ mọi nơi", nên (1) đưa **số năm hiện tại** thành một trường token dùng cho nhóm A1; (2) tách phần năm trong các trường ngày sự kiện (A2) để nhóm A3 suy ra; (3) với chuỗi copy có gắn năm, cho phép admin dùng ký hiệu chèn năm (vd `{năm}`) để tự thay. Chi tiết cách làm thuộc tài liệu kỹ thuật.

### A4. KHÔNG đồng bộ — thuộc "danh mục năm đã qua" (FR4)
Các tham chiếu tới năm cũ (nav "Mùa 2025", trang `/2025`, callout "Nhìn lại 2025", nhãn "Đội ngũ 2025", "Hành trình năm 2025"…) là **năm đã qua**, quản lý độc lập ở [FR4](#fr4--danh-mục-năm-đã-qua--dropdown-header), **không** đổi theo số năm hiện tại.
