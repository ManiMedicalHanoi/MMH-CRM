/* ══════ UPDATE NOTICES — MMH CRM (same approach as Report Hub) ══════
   Thông báo cập nhật của CRM viết HOÀN TOÀN bằng tiếng Anh (người dùng yêu cầu 08/10/2026 — nhóm Thái cùng đọc).
   Mỗi lần sửa / thêm tính năng: thêm 1 mục MỚI LÊN ĐẦU mảng. id duy nhất, không đổi sau khi phát hành.
   · date: YYYY-MM-DD — tự hiện khi đăng nhập trong 7 ngày · type: "new" | "imp" | "fix" · img: updates/<version>/…jpg
   · en: nội dung cho EMAIL cập nhật (UPM) — giữ cùng số mục với items (ảnh lấy theo thứ tự) */
(function(){
function E(u){ u.en={ title:u.title, items:u.items.map(function(i){ return { title:i.title, text:i.text }; }) }; return u; }
window.MMH_UPDATES = [
  E({
    id:"2026-10-10-v30.8", version:"v30.8", date:"2026-10-10",
    title:"Business trip proposals go to the Director, who can approve them in the CRM",
    summary:"Trip proposal emails from the CRM now use the same <b>Business Trip Approval Request</b> format as the Business Trip system and go straight to the Director. The Director can approve several proposals at once in the CRM or Report Hub, and each proposer gets their own approval email.",
    items:[
      {type:"imp", icon:"📨", title:"One proposal email format, sent to the Director", text:"Click <b>Business trip proposal</b> and send as usual. The email now uses the standard Business Trip format (trip table, Equipment Commitment, Click here to review), To the Director and CC your Head of Department and you. Every proposal is also logged in the <b>Business Trip Log</b> tab of your team's CRM file.", img:""},
      {type:"new", icon:"✈️", title:"Director: Approve trips button", text:"The Director sees <b>Approve trips</b> in the top bar, with a red badge showing how many proposals are waiting. While any proposal is waiting, the list opens once a day.", img:"updates/v30.8/btn.jpg"},
      {type:"new", icon:"✅", title:"Approve several proposals at once", text:"Tick the proposals (or <b>Select all</b>), add a note if needed, then click <b>Approve</b> or <b>Reject</b>. A rejection needs a reason. Each proposer gets their own email, and every approved trip gets its document folder automatically.", img:"updates/v30.8/list.jpg"}
    ]
  }),
  E({
    id:"2026-10-08-v30.7", version:"v30.7", date:"2026-10-08",
    title:"Field photos instant & never lost + clear form fields",
    summary:"Saving a field visit task with a photo no longer waits for the server, and nothing is lost without signal. Every form field now has a clear frame. <b>Surgical Thailand does not take field photos</b>, so for that team only the instant saving and the clearer forms apply.",
    items:[
      {type:"fix", icon:"⏳", title:"Cause of the slow photo upload", text:"The text and the photo were sent in one big request, and the app waited while the server uploaded the photo to Drive, looked up the GPS address and wrote the Sheet. On weak 4G or with a busy server this took minutes; a timeout meant nothing was saved.", img:"updates/v30.6/photo_flow.jpg"},
      {type:"imp", icon:"⚡", title:"Now: tap Save = done", text:"Tap <b>Save to Google Sheet</b> (new task, task update or <b>Send photo now</b>): the form closes at once and the task appears on your calendar. The text is sent first in a few seconds; the photo follows in the background."},
      {type:"imp", icon:"📶", title:"No signal? Nothing is lost", text:"Tasks and photos are stored on the phone until Google Sheet confirms, and are sent automatically when the network is back — even after closing the app. The chip at the bottom shows what is still being sent; nothing is sent twice."},
      {type:"imp", icon:"👥", title:"Which teams", text:"Dental, Surgical (Vietnam) and Eyeless: all of the above, including field photos. <b>Surgical Thailand does not take field photos</b>, so for this team only the instant task saving applies."},
      {type:"fix", icon:"🔲", title:"Clear frames on every form field", text:"Before, many fields in pop-up forms (Plan, Type task, Sales Process…) had no frame until you tapped them, so it was easy to miss one. Now every field has a visible frame, drop-down lists show a ▾ arrow and the field you are typing in is highlighted.", img:"updates/v30.7/fields.jpg"}
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
