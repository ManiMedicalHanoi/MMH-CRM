# MMH CRM — quy tắc làm việc cho Claude

Ứng dụng một file `index.html` (GitHub Pages từ `main`). Người dùng là nhân sự MANI Medical Hanoi — **trả lời bằng tiếng Việt**.
Kiến trúc & quy ước giống MMH Report Hub (repo `ManiMedicalHanoi/MMH-Report`, xem CLAUDE.md ở đó).

- Khi người dùng bảo sửa / gộp: commit → PR → squash merge `main`. Tăng số phiên bản ở thanh bên (`MMH CRM vXX.Y`).
- Vá lớp bằng khối `<script>` / `<style>` mới trước `</body>` (`window.fn = …`), giữ nguyên code cũ.
- **Backend**: code `.gs` ở kho riêng tư `ManiMedicalHanoi/mmh-backend` — `crm-dental`, `crm-surgical`, `crm-eyeless`, `crm-thai`,
  `cust-data` (Data khách hàng / Event), `turnover`, `thai-mkt`, cùng `marketing` (Report Hub: Công việc khác, Công tác) và `kpi`.
  Sửa backend qua PR ở kho đó (tự deploy, URL không đổi). Gộp backend trước, rồi mới gộp app. `turnover` đang có bản sửa dở trên trình soạn.
- **Đăng nhập (v29)**: email công ty + mã 6 số qua Training Hub (`rhAuth*`, sheet `RH_Users`) — dùng chung với Report Hub, module `AUTH`.
  Có phiên ⇒ `grant(pic)` ghi `mmh_dental_pic`/cờ quyền/nhóm trước khi boot. Mật khẩu cũ chỉ còn qua link "Dùng mật khẩu như trước" đến `AUTH.GRACE`.
  Không đưa thêm email nhân sự vào repo công khai này.
- **KPI (v29)**: khối `#tab-kpi` trong trang KPI = module KPI của Report Hub (backend `kpi` ▸ `rhKpi`, cần phiên email), có
  Báo cáo KPI tháng (`KR`) và Setting Expectation (`SE`, mẫu `templates/setting_expectation.docx`). Bảng KPI tính từ CRM bên dưới giữ nguyên.
- `busy()` (v29) chỉ hiện thẻ nhỏ, không chặn màn hình; thao tác mới nên cập nhật giao diện trước rồi ghi ngầm.
- `script.google.com` bị chặn trong môi trường Claude: test bằng Playwright + `page.route(/script\.google\.com/)`.
- **Giao diện gọn (v30.0, khối `v30-css` + script cuối file)**: biểu tượng SVG nét mảnh `V30_ICON(k)` (bảng `P`) thay emoji ở thanh trên,
  menu bên, thanh dưới; bộ quét `MutationObserver` tự bỏ emoji màu trong chữ của nút / nhãn / tiêu đề (danh sách `SEL`, ô chỉ 1 emoji quen ⇒
  đổi sang biểu tượng `EMI`). Nội dung người dùng gõ (textarea, input) không bị đụng. Giao diện mới: không thêm emoji, dùng `V30_ICON`.
  Nhóm Thái (tiếng Anh): `trEN` tra thêm từ điển theo khoá đã bỏ emoji — chữ mới cần dịch thêm vào `ADD` trong khối v30.
- **Điện thoại (v30.0)**: thanh trên chỉ còn logo · Lịch · Tìm · tên; thanh dưới 5 nút cố định (Lịch · Khách hàng · ＋ Ghi nhanh · Mở mới/Đơn hàng
  · Thêm = bảng mọi chức năng + Bảng tin, Tải lại, Màu, Hướng dẫn, FY, link app khác). Thẻ đi địa bàn hôm nay có nút **Chụp ảnh** (`V30.photo`)
  và **Báo kết quả** (`V30.done`, chọn sẵn Completed); thẻ công tác có **Báo cáo công tác**. Lịch tuần tự cuộn tới hôm nay. Chuyến công tác trùng được gộp.
- **Đọc Apps Script không kèm cookie (v30.0, cũng ở Report Hub v16.7)**: bọc `<script>.src` trong module `AUTH` ⇒ URL `script.google.com/macros/s/…`
  có `callback=` được đọc bằng `fetch(credentials:"omit")` rồi chạy đúng callback; hỏng (web app chỉ cho domain, link `/a/macros/`) ⇒ quay về thẻ
  `<script>`. Lý do: Chrome đăng nhập Gmail khác / nhiều tài khoản làm thẻ `<script>` bị chuyển sang trang chọn tài khoản ⇒ không đăng nhập được.
  Mock test: `resourceType()==='script'` trả 404 để giả lập lỗi này.
- Khang = `mmh.saigon1@manimedicalhanoi.com` (không phải saigon2).
- **v30.1 — một kiểu giao diện mọi tab** (`<style id="v301-css">`): bề mặt trắng, viền `#E6EAEF`, bo 12px, `#main *` không đổ bóng, tab con
  (`.shtabs`, `.dashg`) = gạch chân, chip / nút nhóm đang chọn = nền nhạt + viền màu chính (không tô đặc), `avColor` bảng màu trầm.
  Điện thoại: thanh dưới Lịch · Khách hàng · **Hôm nay** (`V31.today()`: việc hôm nay, quá hạn, sắp đến hạn, dùng `calCard`) · Mở mới · Thêm;
  nút ＋ Ghi nhanh nổi góc phải dưới; danh sách Khách hàng dạng thẻ (CSS `tr[onclick^="openCust"]`). Quản lý đổi nhóm ở menu bên hoặc Thêm ▸ Nhóm đang xem.
- **Quyền xem**: Management đổi nhóm (Dental / Surgical / Eyeless / Thái); Team Leader (`title` có "Leader") xem cả nhóm mình (`S.user.lead`);
  PIC chỉ thấy việc của mình.
- **Đề xuất công tác (v30.1)**: form mở ngay — danh mục `tripMaster` lưu `localStorage.mmh_tripm_<nhóm>_<pic>`, tải trước sau đăng nhập, làm mới nền
  (>15 phút); chưa có bản lưu ⇒ danh sách tỉnh dự phòng `TP_FB_DEST`.
- **Popup nhắc hạn** (giống Report Hub): hạn chứng từ kế toán `DL` (ngày 14, 15, 28, 29 + đúng ngày hạn), KPI tháng ngày 02, tự đánh giá quý ngày 09
  tháng đầu quý trước 17:00. Thứ tự: `DL` → `#kpn`.
