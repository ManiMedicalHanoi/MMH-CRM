/* ══════ UPDATE NOTICES — MMH CRM (same approach as Report Hub) ══════
   Thông báo cập nhật của CRM viết HOÀN TOÀN bằng tiếng Anh (người dùng yêu cầu 08/10/2026 — nhóm Thái cùng đọc).
   Mỗi lần sửa / thêm tính năng: thêm 1 mục MỚI LÊN ĐẦU mảng. id duy nhất, không đổi sau khi phát hành.
   · date: YYYY-MM-DD — tự hiện khi đăng nhập trong 7 ngày · type: "new" | "imp" | "fix" · img: updates/<version>/…jpg
   · en: nội dung cho EMAIL cập nhật (UPM) — giữ cùng số mục với items (ảnh lấy theo thứ tự) */
(function(){
function E(u){ u.en={ title:u.title, items:u.items.map(function(i){ return { title:i.title, text:i.text }; }) }; return u; }
window.MMH_UPDATES = [
  E({
    id:"2026-10-08-v30.6", version:"v30.6", date:"2026-10-08",
    title:"Field photos and task updates: instant, never lost",
    summary:"Saving a field task no longer waits for the server. The text is sent first in a few seconds, the photo uploads in the background, and everything is kept on your phone until Google Sheet confirms — even with no signal.",
    items:[
      {type:"imp", icon:"⚡", title:"Save = done", text:"Tap <b>Save</b> on a new task, a task update or <b>Send photo now</b>: the form closes at once and the task shows on your calendar. The small chip at the bottom shows what is still being sent."},
      {type:"imp", icon:"📶", title:"No signal? Keep working", text:"Tasks and photos are stored on the phone and sent automatically when the network is back — even after closing the app. Nothing is sent twice."},
      {type:"new", icon:"🧪", title:"Test mode for Admin", text:"Admin: tap <b>Test mode</b> and pick a salesperson to use the CRM exactly like them. Nothing is saved to the sales files; weekly / monthly report e-mails go only to the Admin."}
    ]
  }),
  E({
    id:"2026-10-08-v30.5", version:"v30.5", date:"2026-10-08",
    guide:"docs/Guide_New_accounts_v30.5_EN.pdf", guideName:"MMH_CRM_New_Accounts_Guide_v30.5_EN.pdf",
    guideVi:"docs/HD_Mo_moi_SKU_moi_v30.5_VN.pdf", guideViName:"MMH_CRM_HD_Mo_moi_v30.5_VN.pdf",
    title:"New accounts: cleaner tab and clear manager approval",
    summary:"The <b>New accounts &amp; SKUs</b> tab is simpler, and line managers / the Director can review each case with its evidence on screen and <b>Approve</b>, <b>Return for changes</b> or <b>Reject</b>. Approved cases count for the new-account KPI (C1-01 … C1-05, C2-03).",
    items:[
      {type:"imp", icon:"🧭", title:"Cleaner New accounts tab", text:"Small KPI cards per PIC, one filter bar (All · To review · Pending · Changes requested · Draft · Approved · Rejected + PIC and month) and a compact case list.", img:"updates/v30.5/new_layout.jpg"},
      {type:"new", icon:"✅", title:"Review with evidence on screen (managers)", text:"Open the e-mail or <b>New accounts ▸ To review</b>: each case shows what the sales rep sent, the <b>4 KPI conditions</b> checked automatically and the <b>evidence in large view</b>. Then <b>Approve</b> (counts for KPI), <b>Return for changes</b> (evidence kept) or <b>Reject</b>.", img:"updates/v30.5/review.jpg"},
      {type:"new", icon:"↩️", title:"Returned cases: complete and resend (sales)", text:"A returned case shows <b>Changes requested</b> with the manager's comment. Click <b>Edit</b>, add what is missing, then <b>Send for approval again</b>.", img:"updates/v30.5/returned.jpg"},
      {type:"imp", icon:"✉️", title:"One e-mail per update (Admin)", text:"<b>Send update email</b> now sends one chosen update, with the update guide (English and Vietnamese) and the complete English user guide attached."}
    ]
  }),
  E({
    id:"2026-10-08-v30.4", version:"v30.4", date:"2026-10-08",
    guide:"docs/HDSD_MMH_CRM_v30.4.pdf",
    title:"Thailand team: MMH CRM fully in English",
    summary:"For the Thailand Surgical team, every screen, form and reminder of MMH CRM is now in English — including business trips, KPI and the quarterly self-assessment.",
    items:[
      {type:"imp", icon:"🌐", title:"Everything in English for the Thailand team", text:"KPI &amp; Targets (KPI names, charts, details), the monthly KPI report email, reminders (KPI report, self-assessment, accounting deadlines) and the <b>Business trip request</b> form (expense items such as Air ticket, Per diem, Hotel) are now in English.", img:"updates/v30.4/kpi_en.jpg"},
      {type:"new", icon:"📝", title:"Quarterly self-assessment in English", text:"<b>KPI &amp; Targets ▸ Setting Expectation</b> → fill in your self-assessment → <b>Download Word file</b>. The form and the Word file are in English, with your KPIs of the quarter filled in.", img:"updates/v30.4/se_en.jpg"},
      {type:"imp", icon:"📘", title:"English user guide", text:"Update notices of MMH CRM are now always in English, and the full user guide (PDF) is available in English — click <b>User guide (PDF)</b> below."}
    ]
  }),
  E({
    id:"2026-10-07-v30.3", version:"v30.3", date:"2026-10-07",
    guide:"docs/HDSD_MMH_CRM_v30.4.pdf",
    title:"What's new & update emails",
    summary:"The <b>What's new</b> button on the top bar shows every update; Admins can email the updates with the user guide attached.",
    items:[
      {type:"new", icon:"✨", title:"What's new", text:"Click <b>What's new</b> on the top bar (on phones: <b>More ▸ What's new</b>) to see every update of MMH CRM with screenshots.", img:"updates/v30.3/co_gi_moi.jpg"},
      {type:"new", icon:"✉️", title:"Update email with user guide (Admin)", text:"Admins can send the update summary by email to all CRM users, with the full user guide (PDF) attached."}
    ]
  }),
  E({
    id:"2026-10-07-v30.2", version:"v30.2", date:"2026-10-07",
    title:"Company Total KPI, clearer KPI view, private calendar",
    summary:"Managers can see the company <b>Total KPI</b>. The KPI tab shows clearly whose KPI you are viewing. The calendar shows only your own training sessions and business trips.",
    items:[
      {type:"new", icon:"📊", title:"Company Total KPI (Admin, Director, managers)", text:"<b>KPI &amp; Targets</b> ▸ <b>Total KPI</b>: company sales, scores of the four perspectives, strategic objectives, company KPIs and each member's result.", img:"updates/v30.2/total_kpi.jpg"},
      {type:"imp", icon:"👤", title:"Clear KPI view", text:"The <b>Viewing KPI of</b> bar highlights the selected person. Colours follow the KPI file: &lt; 90% · 90–100% · 100–120% · &gt; 120%. Sales not yet closed by accounting show <b>Not closed</b>."},
      {type:"imp", icon:"🔒", title:"Private calendar", text:"Training sessions are visible only to the trainer and invited attendees. Other people's business trips are hidden; managers can show them with <b>Other people's trips</b>.", img:"updates/v30.2/cong_tac_an.jpg"}
    ]
  }),
  E({
    id:"2026-10-07-v30.1", version:"v30.1", date:"2026-10-07",
    title:"Consistent design, Today view, instant trip form",
    summary:"All tabs share one clean style. Phones get a <b>Today</b> button in the middle and a floating <b>＋</b> button at the bottom right. The business trip form opens instantly.",
    items:[
      {type:"new", icon:"📅", title:"Today (mobile)", text:"The middle button of the bottom bar, <b>Today</b>, shows today's visits, trips, other tasks and training, plus overdue and upcoming tasks. The <b>＋</b> quick-add button now floats at the bottom right.", img:"updates/v30.1/hom_nay.jpg"},
      {type:"imp", icon:"🧭", title:"Consistent, clean design", text:"All tabs share one calm style on desktop and mobile; the customer list on phones is shown as simple cards.", img:"updates/v30.1/khach_hang.jpg"},
      {type:"imp", icon:"✈️", title:"Instant business trip request", text:"<b>Business trip request</b> opens immediately — no more loading box."},
      {type:"new", icon:"🔔", title:"Reminders", text:"Reminders for accounting document deadlines, the monthly KPI report (2nd) and the quarterly self-assessment (9th of the first month of the quarter, before 17:00)."}
    ]
  }),
  E({
    id:"2026-10-07-v30.0", version:"v30.0", date:"2026-10-07",
    title:"Cleaner design, mobile field work, sign-in fix",
    summary:"Calmer colours and simple line icons. Today's field visits have <b>Take photo</b> and <b>Report result</b> buttons. Sign-in works even when Chrome uses another Gmail account.",
    items:[
      {type:"imp", icon:"🎨", title:"Cleaner design", text:"Calm colours and simple line icons; calendar cards show the task type with one coloured bar and the status with a small dot."},
      {type:"new", icon:"📷", title:"Faster field updates on mobile", text:"Today's field visits have <b>Take photo</b> (opens the camera) and <b>Report result</b> buttons; trips have <b>Trip report</b>. The calendar jumps to today.", img:"updates/v30.0/dia_ban.jpg"},
      {type:"fix", icon:"📱", title:"Sign-in fixed on phones", text:"Signing in works even when Chrome is logged in to another Gmail account."}
    ]
  })
];
})();
