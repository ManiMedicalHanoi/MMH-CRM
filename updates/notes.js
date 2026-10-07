/* ══════ THÔNG BÁO CẬP NHẬT — MMH CRM (cùng cách làm với Report Hub) ══════
   Mỗi lần sửa / thêm tính năng: thêm 1 mục MỚI LÊN ĐẦU mảng. id duy nhất, không đổi sau khi phát hành.
   · date: YYYY-MM-DD — tự hiện khi đăng nhập trong 7 ngày · type: "new" | "imp" | "fix" · img: updates/<version>/…jpg
   · en: nội dung tiếng Anh cho EMAIL cập nhật (Có gì mới ▸ Gửi email cập nhật — Admin / Director) */
window.MMH_UPDATES = [
  {
    id:"2026-10-07-v30.3", version:"v30.3", date:"2026-10-07",
    guide:"docs/HDSD_MMH_CRM_v30.3.pdf",
    title:"Có gì mới & email thông báo cập nhật",
    summary:"Nút <b>Có gì mới</b> trên thanh trên cùng xem lại mọi bản cập nhật; Admin gửi email thông báo kèm hướng dẫn PDF.",
    en:{ title:"What's new & update emails", items:[
      {title:"What's new", text:"Click <b>What's new</b> on the top bar (on phones: <b>More ▸ What's new</b>) to see every update of MMH CRM with screenshots."},
      {title:"Update email with user guide", text:"Admins can send this update summary by email to all CRM users, with the full user guide (PDF) attached."}]},
    items:[
      {type:"new", icon:"✨", title:"Có gì mới", text:"Bấm <b>Có gì mới</b> trên thanh trên cùng (điện thoại: <b>Thêm ▸ Có gì mới</b>) để xem lại các bản cập nhật kèm ảnh.", img:"updates/v30.3/co_gi_moi.jpg"},
      {type:"new", icon:"✉️", title:"Email thông báo cập nhật (Admin)", text:"Trong hộp thông báo, Admin / Director bấm <b>Gửi email cập nhật</b> → xem trước → <b>Gửi thử cho tôi</b> → <b>Gửi email</b> tới toàn bộ nhân sự dùng CRM, kèm HDSD PDF."}
    ]
  },
  {
    id:"2026-10-07-v30.2", version:"v30.2", date:"2026-10-07",
    title:"Total KPI công ty, KPI rõ ràng hơn, lịch riêng tư",
    summary:"Quản lý xem <b>Total KPI</b> công ty. Tab KPI ghi rõ đang xem của ai. Lịch chỉ hiện buổi đào tạo và chuyến công tác của bạn.",
    en:{ title:"Company Total KPI, clearer KPI view, private calendar", items:[
      {title:"Company Total KPI (Admin, Director, managers)", text:"<b>KPI &amp; Targets</b> ▸ <b>Total KPI</b>: company sales, scores of the four perspectives, strategic objectives, company KPIs and each member's result."},
      {title:"Clear KPI view", text:"The <b>Viewing KPI of</b> bar highlights the selected person. Colours follow the KPI file: &lt; 90% · 90–100% · 100–120% · &gt; 120%. Sales not yet closed by accounting show <b>Not closed</b>."},
      {title:"Private calendar", text:"Training sessions are visible only to the trainer and invited attendees. Other people's business trips are hidden; managers can show them with <b>Other people's trips</b>."}]},
    items:[
      {type:"new", icon:"📊", title:"Total KPI công ty (Admin, Director, quản lý)", text:"<b>KPI &amp; Mục tiêu</b> ▸ <b>Total KPI công ty</b>: doanh số toàn công ty, 4 góc nhìn, mục tiêu chiến lược, KPI công ty và % từng người.", img:"updates/v30.2/total_kpi.jpg"},
      {type:"imp", icon:"👤", title:"KPI rõ người đang xem", text:"Hàng <b>Đang xem KPI của</b> tô đậm người đang chọn. Màu theo mã màu file KPI. Doanh số kế toán chưa chốt ghi <b>Chưa chốt</b>."},
      {type:"imp", icon:"🔒", title:"Lịch riêng tư", text:"Buổi đào tạo chỉ hiện với trainer và người được mời. Chuyến công tác của người khác ẩn; quản lý bấm <b>Công tác người khác</b> để xem.", img:"updates/v30.2/cong_tac_an.jpg"}
    ]
  },
  {
    id:"2026-10-07-v30.1", version:"v30.1", date:"2026-10-07",
    title:"Giao diện đồng bộ mọi tab, nút Hôm nay, đề xuất công tác mở ngay",
    summary:"Mọi tab cùng một kiểu gọn gàng. Điện thoại có nút <b>Hôm nay</b> ở giữa, nút <b>＋</b> nổi góc phải. Form đề xuất công tác mở tức thì.",
    en:{ title:"Consistent design, Today view, instant trip form", items:[
      {title:"Today (mobile)", text:"The middle button of the bottom bar, <b>Today</b>, shows today's visits, trips, other tasks and training, plus overdue and upcoming tasks. The <b>＋</b> quick-add button now floats at the bottom right."},
      {title:"Consistent, clean design", text:"All tabs share one calm style on desktop and mobile; the customer list on phones is shown as simple cards."},
      {title:"Instant business trip proposal", text:"<b>Propose a business trip</b> opens immediately — no more loading box."},
      {title:"Reminders", text:"Reminders for accounting document deadlines, the monthly KPI report (2nd) and the quarterly self-assessment (9th of the first month of the quarter, before 17:00)."}]},
    items:[
      {type:"new", icon:"📅", title:"Nút Hôm nay (điện thoại)", text:"Nút giữa thanh dưới <b>Hôm nay</b> → xem ngay việc trong ngày, quá hạn, sắp đến hạn. Nút <b>＋ Ghi nhanh</b> nổi ở góc phải dưới.", img:"updates/v30.1/hom_nay.jpg"},
      {type:"imp", icon:"🧭", title:"Mọi tab cùng một kiểu", text:"Desktop và điện thoại cùng tông với Lịch công việc; danh sách Khách hàng trên điện thoại dạng thẻ.", img:"updates/v30.1/khach_hang.jpg"},
      {type:"imp", icon:"✈️", title:"Đề xuất công tác mở ngay", text:"Bấm <b>Đề xuất công tác</b> là form hiện ngay, không còn hộp Đang tải."},
      {type:"new", icon:"🔔", title:"Nhắc hạn", text:"Nhắc hạn nộp chứng từ kế toán, báo cáo KPI tháng (ngày 02), tự đánh giá quý (ngày 09 tháng đầu quý, trước 17:00)."}
    ]
  },
  {
    id:"2026-10-07-v30.0", version:"v30.0", date:"2026-10-07",
    title:"Giao diện gọn, tối ưu điện thoại, sửa đăng nhập",
    summary:"Giao diện bớt màu, biểu tượng nét mảnh. Thẻ đi địa bàn hôm nay có nút <b>Chụp ảnh</b> và <b>Báo kết quả</b>. Đăng nhập được khi Chrome dùng Gmail khác.",
    en:{ title:"Cleaner design, mobile field work, sign-in fix", items:[
      {title:"Cleaner design", text:"Calm colours and simple line icons; calendar cards show the task type and status with a small coloured dot."},
      {title:"Faster field updates on mobile", text:"Today's field visits have <b>Take photo</b> (opens the camera) and <b>Report result</b> buttons; trips have <b>Trip report</b>. The calendar jumps to today."},
      {title:"Sign-in fixed on phones", text:"Signing in works even when Chrome is logged in to another Gmail account."}]},
    items:[
      {type:"imp", icon:"🎨", title:"Giao diện gọn", text:"Bớt màu, biểu tượng nét mảnh; thẻ lịch chỉ còn 1 vạch màu theo loại việc, trạng thái là chấm màu."},
      {type:"new", icon:"📷", title:"Đi địa bàn nhanh trên điện thoại", text:"Thẻ đi địa bàn hôm nay có <b>Chụp ảnh</b> (mở thẳng camera) và <b>Báo kết quả</b>; thẻ công tác có <b>Báo cáo công tác</b>. Lịch tự cuộn tới hôm nay.", img:"updates/v30.0/dia_ban.jpg"},
      {type:"fix", icon:"📱", title:"Đăng nhập trên điện thoại", text:"Chrome đang đăng nhập Gmail khác vẫn nhận mã và vào app bình thường."}
    ]
  }
];
