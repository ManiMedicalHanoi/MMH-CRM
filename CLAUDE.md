# MMH CRM — quy tắc làm việc cho Claude

Ứng dụng một file `index.html` (GitHub Pages từ `main`). Người dùng là nhân sự MANI Medical Hanoi — **trả lời bằng tiếng Việt**.
Kiến trúc & quy ước giống MMH Report Hub (repo `ManiMedicalHanoi/MMH-Report`, xem CLAUDE.md ở đó).

- Khi người dùng bảo sửa / gộp: commit → PR → squash merge `main`. Tăng số phiên bản ở thanh bên (`MMH CRM vXX.Y`).
- **BẮT BUỘC — bài hướng dẫn (tour)**: chức năng mới / đổi giao diện ⇒ sửa hoặc thêm bài trong `tour/tours.js` (chữ `{vi,en}`, tăng `v`, `d` = ngày sửa) trong CÙNG PR, rồi chạy
  `NODE_PATH=$(npm root -g) node tools/tour_check.js` và `… --thai` — phải ra "Tất cả bài hướng dẫn đều khớp".
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
- **v30.2 — KPI, Total KPI, quyền xem lịch**: cùng code với Report Hub v16.9 (xem CLAUDE.md của MMH-Report: `tone`, `.kp-who`, `pendTag`, `KT`, `VIS`).
  CRM: chuyến công tác người khác lọc trong `calItems` (kind `t`), nút `VIS.chip()` trên `.cal-bar`; quản lý = `isMgrView()` hoặc Admin / Director / HOD.
- **Thông báo cập nhật (v30.3)**: `updates/notes.js` (`window.MMH_UPDATES`, như Report Hub, mỗi mục có `en` cùng số mục với `items`),
  nút **Có gì mới** `#updBtn` trên thanh trên cùng (điện thoại: Thêm ▸ Có gì mới), số phiên bản ở thanh bên mở lại lịch sử.
  Mỗi bản phát hành: thêm mục lên đầu + ảnh `updates/vXX.Y/` (dữ liệu giả) + tăng `notes.js?v=`.
- **Email cập nhật `UPM` (v30.3)**: giống Report Hub (xem CLAUDE.md ở đó); `UPM_CFG.recipients` = email trong `ROLES`;
  PDF = `docs/HDSD_MMH_CRM_vXX.Y.pdf`, dựng bằng `MMH-Report/tools/guide/buildcrm.js` (ảnh `shots/crm_*`).
- **Nhóm Thái = TOÀN BỘ tiếng Anh (v30.4)**: bộ dịch DOM (`DICT_EN` / `RULES_EN`, bật khi `I18N.on`) + khối `v304-css` / script v30.4 cuối file
  (từ điển `A`, luật `R` chạy trước luật cũ). Chữ không nằm trên giao diện thì sửa trong code theo `I18N.on`: tên KPI `kpiShortEN` / `grpName`,
  Total KPI `KEN()` (tên gốc file KPI, Rule tiếng Anh `r.en`), file Word `templates/setting_expectation_en.docx`, email KPI tháng `lang:"en"`
  (backend kpi), gợi ý chi phí công tác `TPC_SUGGEST_EN`. Máy mới + trình duyệt không phải tiếng Việt ⇒ màn đăng nhập tiếng Anh.
  **Tính năng mới phải chạy được tiếng Anh cho nhóm Thái** — kiểm bằng bộ quét chữ Việt (Playwright, đăng nhập Dao / team `thai`, liệt kê text node có dấu).
- **Thông báo cập nhật CRM viết hoàn toàn bằng tiếng Anh** (người dùng yêu cầu 08/10/2026), ảnh chụp giao diện tiếng Anh (chế độ nhóm Thái, dữ liệu giả
  Thái Lan). HDSD toàn hệ thống bản tiếng Anh: `MMH-Report/tools/guide/buildcrm_en.js` (ảnh `shots/en_*`) → `docs/HDSD_MMH_CRM_vXX.Y.pdf`.
- **Mở mới địa bàn & SKU mới (v30.5, khối `v305-css` + script cuối file, ghi đè `naHead` / `naPaint` / `naCardHtml` / `naView` / `naDecide` / `naRulesHtml`)**:
  KPI theo file MMH KPI FY68 (4. Rule, 5. Member KPI Monthly): C1-01 Viet · C1-02 Vinh · C1-03 Phuong (Dental VN), C1-04 Viet Ha · C1-05 Khang (Surgical VN),
  C2-03 Miew (Surgical Thái, Manipler) — bảng `NA_KPI_MAP`. 4 điều kiện (báo cáo tuần · xác nhận NPP · thông tin đúng format · đơn đầu tiên) tự đối chiếu ở `naChecks`;
  chỉ tính tháng phát sinh đầu tiên, tối đa 130%. Trang: thẻ KPI nhỏ + 1 dòng lọc (tab trạng thái + chọn PIC / tháng) + danh sách gọn.
  Duyệt: bằng chứng cỡ lớn trong khung, 3 nút ở chân hộp: Xác nhận · **Trả lại bổ sung** (backend `naDecide decision=return`: về Draft, giữ chứng từ,
  `decBy/comment` ⇒ hiện "Cần bổ sung", `naIsRet`) · Từ chối. HD riêng: `docs/HD_Mo_moi_SKU_moi_v30.5_VN.pdf` + `docs/Guide_New_accounts_v30.5_EN.pdf`
  (`MMH-Report/tools/guide/na_slides.js` + `build_na.js`, LANG=vi|en; ảnh `shots/na_<vi|en>_*`).
- **Email cập nhật v2 (`UPM`, dùng chung Report Hub)**: mỗi email = **1 bản cập nhật** (chọn radio). CRM `UPM_CFG.lang:"en"`; đính kèm (theo thứ tự) `guide` (HD bản cập nhật,
  tiếng Anh) + `guideVi` (tiếng Việt) của mục trong notes.js + HDSD toàn hệ thống tiếng Anh `UPM_CFG.pdf` (Training Hub `rhUpdMail` v3.16 `pdfs[]`, ≤ 22 MB, thừa thì chỉ link).
  Mục cập nhật lớn nên có `guide` / `guideVi` (+ `guideName` / `guideViName`).
- **Lưu task & ảnh (v30.6, khối `v306-css` + script)**: thay hàng đợi v29.2. `saveTask` / `submitNewTask` / `uploadPending` bọc `queued()` ⇒ `apiPost`
  saveWeekly / uploadPhoto trong lúc đó vào hàng đợi `WQ` và trả kết quả giả ngay (khung đóng tức thì). Chữ đi trước (JSONP, gói nhỏ), ảnh tách thành
  mục `uploadPhoto` riêng (fetch POST, hết giờ 120 s), ảnh lưu IndexedDB `mmh_crm_wq`, danh sách `localStorage.mmh_crm_wq`. Task mới mang số dòng tạm âm,
  `TMP` (`mmh_crm_tmp`) ánh xạ sang số thật khi Sheet trả `row`; lệnh nào có số âm tự đổi / tự xếp hàng. Lỗi mạng / bận ⇒ thử lại mãi (≤ 60 s), lỗi thật 3 lần ⇒ chip đỏ.
- **Chế độ thử của Admin (v30.6, `CRMTEST`)**: Admin (phiên email `admin`) ▸ nút "Chế độ thử" / Thêm ▸ Tiện ích ▸ chọn sales ⇒ `localStorage.mmh_crm_test`,
  `window.__CRM_TEST`; mọi lệnh ghi tới `script.google.com` (JSONP lẫn fetch) bị chặn trên máy theo danh sách đọc `READ` (lệnh đọc mới ⇒ thêm vào `READ`),
  trả kết quả giả; ảnh tải thật lên Training Hub `ping` để đo tốc độ; `weeklyReport` / `monthlyReport` gửi thật với `testTo` = email Admin (backend CRM chỉ gửi Admin,
  không CC, không ghi nhật ký); `rhKpiMailSend` đổi người nhận = Admin. Hàng đợi chế độ thử tách riêng (`mmh_crm_wq_test`).
- **Ô nhập luôn có viền rõ (v30.7, `<style id="v307-fld">`)**: lỗi cũ — biến `--c-line` chỉ khai báo trong `#app` nên hộp thoại `#ov` / `#ov2` / ngăn kéo `#drw`
  (nằm ngoài `#app`) mất viền. Nay khai báo ở `:root` + `--fld-line` (#C3CDD8) cho mọi ô, select có mũi tên ▾. Biến CSS mới phải khai báo ở `:root`.
- **Ảnh đi địa bàn**: chỉ Surgical Thailand không chụp ảnh (`noPhoto`). **Eyeless VẪN chụp ảnh** như Dental / Surgical VN; Eyeless chỉ khác ở chỗ không bắt buộc
  kế hoạch / TBD tuần sau khi gửi báo cáo tuần (`curTeamKey()!=="eyeless"`, v25) — người dùng xác nhận 08/10/2026.
- **Duyệt công tác `TFA` (v30.8, cùng module Report Hub v17.4)**: khối `tfa-css` + script cuối file, `window.TFA_CFG` (`url` = backend CRM Dental, `lang` theo `I18N.on`,
  `busy` = `#ov` / `#ov2` / `#upd` / `#dl` / `#kpn` đang mở). Backend `MMH_TripFlow.gs` (mmh-backend) ở crm-dental / surgical / eyeless: `tripPropose2` gửi email đúng mẫu
  "Business Trip Approval Request" To Giám đốc + ghi tab "Business Trip Log" của file CRM nhóm; `tfPending` / `tfDecide` chỉ phiên email Director. `tfPending` / `tfLog` nằm trong `READ`.
- **Lịch công tác Sales (10/10/2026, khối `TFT` trước khối TFA)**: file MKT không còn lưu chuyến công tác của Sales Team (người dùng yêu cầu). `loadOther` được bọc ⇒
  gọi `tfTrips` (backend CRM nhóm đang xem, đọc file Business Trip) cho PIC Dental / Surgical / Eyeless, ghép vào `S.other.keys` thành key `_tf` "Lịch công tác MMYYYY"
  (sub `vSrc:"trip"`, `vMeta {id,r,m}` như Report Hub) ⇒ lịch, Họp tuần, tripInfo / tripReport chạy như cũ. Bộ nhớ `localStorage.mmh_crm_tft`.
- **"Ai về nhà đấy" (v30.9, khối `ATS` trước khối TFT)**: Dental / Surgical / Eyeless — Công việc khác đọc / ghi sheet **ALL TASK** của file CRM nhóm (backend
  `MMH_SalesTasks.gs`, `at=1`): bọc `hubJsonp` (action task, trừ khi gọi `hubJsonpAt`) + `hubUrl`; `OTHER_KEY` = `k:<nhóm>:alltask`; `otherTypeOk` luôn đúng.
  Việc cũ trong file MKT: `ATS.migrate` (≤ 10 phút/lần/máy, cần phiên email, bỏ qua chế độ thử) ⇒ `atImport` rồi Marketing `salesTasksDrop`.
  File MKT không còn nhận lịch đi địa bàn của Sales (`VS_MOVED`). Lệnh công tác vẫn qua Report Hub (`tripHub`). Thái giữ nguyên (`ownTasks`).
- **Hướng dẫn từng bước `TOUR` (v31.0, cùng bộ máy Report Hub v17.5)**: `tour/tour.js` GIỐNG HỆT MMH-Report (sửa 1 nơi chép sang nơi kia) + bài `tour/tours.js`.
  Nút ❓ `#btnHelp` (điện thoại: Thêm ▸ Hướng dẫn) mở danh mục; sổ tay cũ `openHelp()` ở chân danh mục (`TOUR_CFG.extra`). `TOUR_CFG.lang` theo `I18N.on`.
  Đang chạy tour ⇒ popup `UPD` / `DL` xếp hàng. Bước chỉ đúng với một số nhóm ⇒ `when` (vd. ảnh: `!noPhoto()`).
- **Tour v1.1 (v31.1 / Report Hub v17.6)**: KHÔNG biến đổi `<body>` (giật, điện thoại co trang) — cuộn mượt + vùng sáng + phóng to riêng phần tử (≤ 1,3).
  Điện thoại: nút Hướng dẫn `#tourMob` (biểu tượng) trên thanh trên cùng thay chỗ Chế độ thử (`#tmBtn` ẩn ≤ 720px, vẫn ở Thêm ▸ Tiện ích).
  Kiểm tra thêm khung điện thoại: `tools/tour_check.js --mobile` (kèm `--thai`).
- **Báo cáo tháng (v31.4, khối `v314-js`)**: khung sửa hạng mục tháng (`openMonthly`) lưu bằng `mnDomDiff()` — so từng ô trên màn hình với bản đang có
  (không chỉ dựa `S.dirty`, vì 🎤 Nói trước đây không gọi `markDirtyM` ⇒ nội dung nói không được gửi). `toggleVoice` phát sự kiện `input`.
  Đóng khung khi còn nội dung chưa lưu ⇒ hỏi Lưu / Bỏ (`closeDrw(true)` = đóng không hỏi). Chặn bấm Lưu 2 lần (`S._mnSaving`).
- **Chế độ TEST của Admin (v31.5, `testflow/testflow.js` GIỐNG HỆT MMH-Report, backend `MMH_TestMode.gs` ở mmh-backend)**: Admin ▸ `#tmBtn` / Thêm ▸ Tiện ích ⇒
  chọn nhóm + vai (Sales TEST · Quản lý · Giám đốc) ⇒ `localStorage.mmh_test_crm`, khối đăng nhập tạo `ROLES.TEST` + `window.__CRM_TF` (hàng đợi `_tf` riêng).
  Mọi lệnh tới Apps Script gắn `tm=1&tmAs=<vai>` + `tk` ⇒ GHI THẬT dưới tên TEST, email chỉ về Admin `[TEST]`, người khác không thấy, không tính KPI.
  Bảng **Luồng dữ liệu** (nút vàng `#tf-fab`, `TESTFLOW.open()`): mỗi lệnh ghi = thao tác → backend → file ▸ tab ▸ dòng → email lẽ ra gửi; nhật ký `mmh_testflow_log` dùng chung 2 app.
  Vai Giám đốc: `window.__TF_TESTDIR` ⇒ TFA chỉ chọn được đề xuất TEST. "Xoá dữ liệu test" = `tmClean` ở 4 backend CRM. Lệnh ghi mới ⇒ thêm nhãn `[vi,en]` vào
  `TESTFLOW_CFG.labels` (+ `steps`). Chế độ thử cũ (CRMTEST, không lưu) = lựa chọn phụ "Xem như một bạn sales" trong hộp chọn. Mock: trả `_tm:{mails:[…]}`.
- **v31.6 (13/10/2026, khối `v316-js` + `v316b-js`, backend CRM v10.12)**: tỷ giá cố định 26.700 (bỏ nút Tỷ giá); visit chỉ tính KPI khi có ảnh; Thuyết trình bắt buộc Actual > 0 + mẫu Event review 5 dòng
  (`tplMissing` = `presTplMissing_` backend); Đơn hàng: Order Type 1/2/3 + chứng từ (`orderDoc`), duyệt `oaOpen` (`orderPending` / `orderDecide`, người duyệt Tuyen · Director · Admin), C5 chỉ đơn đã duyệt;
  Dental: tab **Đào tạo khách hàng (T&E)** (`teView` / `teForm`, Training Hub `rhCustTrain`). `v316b-js`: (1) `apiPost` tự gắn `_no` / `_acc` / `_pic` / `_start` cho saveWeekly (sửa) /
  deleteRow weekly / deletePhoto / uploadPhoto ⇒ backend `wkResolve_` tìm đúng dòng, `stale` ⇒ báo tải lại; (2) **Công việc khác ghi tức thì** (`ATS_ON()`): bọc `hubPost` ⇒ hàng đợi `OQ`
  (`localStorage.mmh_crm_oq_<nhóm>`), cập nhật màn hình trước, gửi tuần tự cùng `rid`, kèm `expect` / `parentName` (tên việc gốc `_sn`) vì số No của ALL TASK đánh lại; việc chưa ghi có No tạm `t…`
  (`_oq`); `loadOther` phủ lại lệnh chưa ghi; chip `#oqc`. Nhóm Thái giữ cách cũ. Ảnh phát hành chức năng chỉ của nhóm VN: giao diện tiếng Việt, dữ liệu giả.
- **v31.7 — Chế độ TEST = hộp cát (khối `sbx-early` đầu `<head>` + `sbx-js`, backend `MMH_CrmSandbox.gs` + `MMH_TestMode.gs` v2.0)**: Admin ▸ nút **TEST** (`#tmBtn` / Thêm ▸ Tiện ích) ▸ chọn nhóm
  (Dental · Surgical · Eyeless) + người (sales, trưởng nhóm, Tuyen, Nguyen Ha, Giang) ⇒ `localStorage.mmh_sbx_crm={team,as}`, tải lại: `grant(as)`, `AUTH.user()` trả người đóng vai,
  chip `#sbx-chip` (đổi vai · Làm mới dữ liệu TEST · Mở file TEST · Thoát). Bộ nhớ máy tách riêng: localStorage `sbx_…`, IndexedDB `…_sbx` (dữ liệu thật không lẫn).
  Lệnh tới backend CRM Dental / Surgical / Eyeless gắn `tm=1&tmSb=1&tmAs=<người>` ⇒ backend dùng FILE SHEET TEST + THƯ MỤC TEST riêng có dữ liệu ảo (tự dựng lần đầu:
  `tmSetup` → màn chờ hỏi `tmInfo`); Training Hub `rhCustTrain` + KPI gắn `tm=1` (bản TEST cũ); lệnh GHI tới hệ thống khác (Report Hub…) giả lập trên máy (danh sách đọc `READ`).
  Không giải thích chế độ TEST trên app (người dùng yêu cầu). Nhóm Thái chưa có hộp cát. Chế độ TEST cũ (`testflow.js`, tên TEST) không còn lối vào trong CRM.
  **NPP theo PIC (khối `v317-npp`)**: đơn hàng Dental — ô Partner tự điền theo PIC từ `bundle.nppByPic` (backend `nppByPic_` = K68_NPP): Viet → Nam Dũng, Vinh → S.P.I (khoá),
  Phuong → chọn Meci / Việt Thái; Partner type = Distributor.
- **v31.8 (13/10/2026)**: bỏ Duyệt công tác trên app (`TFA_CFG={off:true}`, cùng Report Hub v17.9) — chỉ còn Đề xuất công tác. Hộp cát TEST: dựng lỗi ⇒ màn chờ hiện
  lý do + **Dựng lại** (`tmReset`) / **Thoát TEST** (`failed()` trong `sbx-js`), quá 16 phút cũng báo; backend `MMH_CrmSandbox.gs` v1.1 chuyển quy tắc xác thực của file TEST
  sang "cảnh báo" (lỗi cũ: ô D5 = PIC của tab MMH Travel report từ chối tên sales ⇒ cả lượt dựng hỏng).
- **Màn chờ hộp cát TEST (15/10/2026, backend `MMH_CrmSandbox.gs` v1.2)**: `#sbx-wait` nền trắng đặc (không lộ màn lỗi phía sau), hiện "Bước x/12 · tên bước" từ `tmInfo`,
  nút "Thoát TEST" ngay khi chờ; chỉ báo lỗi khi backend báo `state:error` hoặc quá 45 phút (backend tự chạy tiếp khi 1 lượt bị Google dừng).
- **v32.0 (15/10/2026, khối `v320-ord-css` + `v320-ord`, backend `orderRequest`)**: thẻ đơn Chờ duyệt có hàng `.v320-acts` — sales (chủ đơn / Admin) ▸ **Gửi xác nhận** (email thư thường tới Tuyen, ảnh chứng từ nhúng;
  đã gửi ⇒ hiện dấu thời gian + Gửi lại), người duyệt (`canDecide` từ `orderPending`) ▸ **Xác nhận / Không xác nhận** ngay trên thẻ. Người duyệt không phải sales (`v320ApOnly`: Tuyen, Nguyen Ha — không có `team`, không Admin)
  ⇒ ẩn "Đơn hàng mới", `formOrder(null)` bị chặn. Link email `#oa` ⇒ trang Đơn hàng + `oaOpen()`.
- **v32.1 (15/10/2026, cùng khối `v320-ord`)**: người duyệt thấy đơn thiếu chứng từ / chưa chọn loại ⇒ KHÔNG hiện nút Xác nhận mờ, chỉ **Trả lại bổ sung** (backend `orderDecide decision=return`: vẫn Chờ duyệt,
  Ghi chú duyệt "Cần bổ sung: …", email sales) + Không xác nhận. Thông báo: chấm số đỏ `.v321-nb` ở menu Đơn hàng (`cnt()`: chờ mình duyệt · bị trả lại · thiếu chứng từ · chưa gửi),
  dải `.v321-ban` đầu trang Đơn hàng, nhắc 1 lần / phiên (`sessionStorage`) sau đăng nhập; làm mới 10 phút / lần.

- **v32.2 (16/10/2026, khối `v322-css` + `v322-js` đặt NGAY TRƯỚC `v320-ord-css` để v32.0 bọc tiếp; backend CRM v10.14)**: ① trang Đơn hàng viết lại (`renderOrder` = `v322RenderOrder`):
  bỏ khối KPI đơn hàng; thẻ Số đơn · Số khách (không trùng) · Số tiền tháng · Lũy kế FY (bỏ đơn Từ chối) + Nhóm sản phẩm; danh sách cây tháng ▸ đơn ▸ dòng sản phẩm như "Tiến độ công việc"
  của Report Hub (dải ngày đánh dấu ngày đặt). Mỗi đơn vẫn là `.od-card` có `.od-line[onclick=rOrder]` + `.od-tags` ⇒ nhãn duyệt / nút v32.0 gắn được. ② Đơn MỚI cần **lịch sử chăm sóc**:
  hoạt động Completed (Visiting / Telephone / Message…) cùng account trên Báo cáo tuần trong 30 ngày trước ngày đặt (`v322CareOf`, khung `#v322-care` trong form; backend `ordCareCheck_`
  code NOCARE). Đơn mới ⇒ backend email Giám đốc (`ordNewMail_`). ③ Visiting Completed cần Task Result + Customer feedback + Next action (`v322VisitMiss`, backend `wkApplyRule_`).
  ④ KPI viếng thăm = Visiting · **Completed** · có ảnh · ngày ≤ hôm nay · không TBD (`kpiVisitOk`, Dashboard `dashBuild` bọc lại; tab 9 công thức thêm `"Complete*"`, vá 1 lần `k68VisitPatch_`).
  ⑤ Thuyết trình: thẻ gọn + dải nhắc buổi chưa đủ báo cáo (chưa tính KPI); form Event review = 5 khung riêng (`#v322-ps`) + đồng hồ độ chi tiết, ghép lại đúng mẫu `-Nhãn: nội dung`.
