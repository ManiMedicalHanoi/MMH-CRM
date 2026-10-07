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
