/* ══════ UPDATE NOTICES — MMH CRM (same approach as Report Hub) ══════
   Thông báo cập nhật của CRM viết HOÀN TOÀN bằng tiếng Anh (người dùng yêu cầu 08/10/2026 — nhóm Thái cùng đọc).
   Mỗi lần sửa / thêm tính năng: thêm 1 mục MỚI LÊN ĐẦU mảng. id duy nhất, không đổi sau khi phát hành.
   · date: YYYY-MM-DD — tự hiện khi đăng nhập trong 7 ngày · type: "new" | "imp" | "fix" · img: updates/<version>/…jpg
   · en: nội dung cho EMAIL cập nhật (UPM) — giữ cùng số mục với items (ảnh lấy theo thứ tự) */
(function(){
function E(u){ u.en={ title:u.title, items:u.items.map(function(i){ return { title:i.title, text:i.text }; }) }; return u; }
window.MMH_UPDATES = [
  E({
    id:"2026-11-09-v35.8", version:"v35.8", date:"2026-11-09",
    title:"KPI reports: due on day 05 — you send the e-mail from your own mailbox",
    summary:"The Monthly KPI Report and the Quarterly KPI Report (self-assessment) are due on <b>day 05</b>. The system no longer sends the reports to other people: the CRM prepares the content and the Word file, and <b>you send the e-mail yourself</b> to your Department Head and the General Director, CC Accounting.",
    items:[
      { type:"imp", icon:"@", title:"Compose e-mail", text:"<b>Submit Report ▸ KPI report</b> (or <b>KPIs & Targets ▸ Send KPI report / Quarterly KPI report</b>) ▸ fill in the reasons and actions ▸ <b>Compose e-mail</b>: the content is copied, choose <b>Outlook / Gmail / Mail app</b> ⇒ your mailbox opens with the recipients and subject filled in ⇒ paste (Ctrl+V), attach the Word file, send ⇒ click <b>I have sent it</b>." },
      { type:"imp", icon:"!", title:"Reminders from day 01 to day 05", text:"From day 01 to 05 of each month the CRM reminds you once a day (days left / due today); days 06–10 show an <b>overdue</b> reminder. The first month of each quarter also reminds the quarterly report. <b>I have sent it</b> or <b>Already sent, don't remind me</b> stops the reminders." }
    ]
  }),
  E({
    id:"2026-11-09-v35.7", version:"v35.7", date:"2026-11-09",
    title:"Report submission statistics now include the Thailand Dental CRM",
    summary:"The report statistics (Excel) now read the weekly reports sent from the Thailand Dental CRM, with the Thailand working calendar.",
    items:[
      { type:"imp", icon:"#", title:"Thailand Dental in the report statistics", text:"Top bar ▸ <b>Report stats</b> (Admin / Director / HOD) ▸ <b>Export Excel</b>: weekly reports sent by Yong, Man and Sui from the Thailand Dental CRM are now counted (on time / late / not sent) with the Thailand working calendar. The source list shows <b>CRM Thailand Surgical</b> and <b>CRM Thailand Dental</b> separately." }
    ]
  }),
  E({
    id:"2026-11-09-v35.6", version:"v35.6", date:"2026-11-09",
    title:"Thailand teams: own Business Trip files · Thailand Dental: real CRM file and Event tab",
    summary:"The Thailand Dental CRM now works on the team's real file \"1. Thailand - Dental Action\" (no longer the draft copy) and has its own Event tab, connected to the file \"2. Thailand - Dental Event Report FY67\". The Customer Task form also has the type action Event next to Co-visiting with distributor.",
    items:[
      { type:"new", icon:"+", title:"Event tab for Thailand Dental", text:"Menu <b>Event</b> ▸ all events of sheet <b>REPORT_EVENT</b> of the Dental Event Report file, by month, with upcoming / done and participants. Events also show on the work calendar. <b>Open sheet</b> opens the Dental file.", img:"updates/v35.6/event_list.jpg" },
      { type:"new", icon:"+", title:"Add or edit an event from the CRM", text:"Click <b>+ Add event</b> ▸ date, type of event, product (Jizai and handfile · Bur · Composite), topic, KOL / PIC, place ▸ <b>Save to Google Sheet</b>. Write <b>MMH &lt;name&gt;</b> as KOL / PIC when an MMH member leads the event — KPI C11-02 counts MMH-led events from this column.", img:"updates/v35.6/event_form.jpg" },
      { type:"new", icon:"+", title:"Business trips saved to your team's own Business Trip file", text:"<b>Propose a trip</b> (calendar) ▸ the proposal is written to the <b>Thailand Dental</b> / <b>Thailand Surgical - Business trip Approval and Report</b> file of your team (no longer the Vietnam file) and the approval e-mail goes to Ha-san. Costs are in <b>THB</b> only. Thailand Surgical can propose trips again.", img:"updates/v35.6/trip_form.jpg" },
      { type:"new", icon:"+", title:"Trip card: view, edit and report", text:"Click a trip on the calendar ▸ details from your team's file; before approval you can <b>Edit</b> / <b>Delete</b>; after <b>Approved</b> fill in <b>Key Activities · Key Findings · Follow Up Actions</b> ▸ <b>Save report</b> ⇒ report document in the trip folder, column Business trip Report, e-mail to Shuhei-san (CC Director).", img:"updates/v35.6/trip_view.jpg" },
      { type:"imp", icon:"✓", title:"Type action: Event · Co-visiting with distributor", text:"When you log a customer task, the <b>Type action</b> list always has <b>Event</b> and <b>Co-visiting with distributor</b> (KPI C4-01 / C4-03). The dropdown of sheet CUSTOMER TASK has them too." }
    ]
  }),
  E({
    id:"2026-11-06-v35.5", version:"v35.5", date:"2026-11-06",
    title:"HOD & Director: alerts for field-visit photos taken too close together",
    summary:"The CRM now flags field-visit photos of one PIC at two different customers taken less than 15 minutes apart, so HODs and the Director can review those visits. Team leaders and sales PICs do not see these alerts.",
    items:[
      { type:"new", icon:"!", title:"Field-visit photo alerts", text:"When there are new alerts, the <b>Photo alerts</b> panel opens once (top bar button, or <b>Ctrl + K</b> ▸ photo). Each alert reads e.g. \"Phuong uploaded 2 field-visit photos less than 15 minutes apart\" with the times, customers, photos and GPS distance — review how these customers were approached and verify the information. 3 photos in a row = unusual, 5 = highly unusual. Click <b>Mark as reviewed</b> when done.", img:"updates/v35.5/alerts.jpg" },
      { type:"imp", icon:"#", title:"Photos keep the time they were taken", text:"From this version each field-visit photo also records the time it was taken (not only the upload time), so photos uploaded later because of a weak network are not flagged by mistake. Covers Dental, Surgical and Eyeless (teams that take photos)." }
    ]
  }),
  E({
    id:"2026-11-05-v35.4", version:"v35.4", date:"2026-11-05",
    title:"Orders: no more duplicate saves, order data cleaned up",
    summary:"Clicking Save twice (slow network, double tap on the phone) no longer sends the same order twice. Order data on the sheet was checked and fixed: duplicate order numbers, lines without an order date and duplicated product lines.",
    items:[
      { type:"fix", icon:"✓", title:"Save sends the order once", text:"<b>Orders</b> ▸ <b>Lưu</b>: a second click within a few seconds, or saving exactly the same order again within 2 minutes, is ignored with a short note. Nothing to change in how you work." },
      { type:"fix", icon:"#", title:"Order list = approval screen", text:"Orders are counted the same way on your <b>Orders</b> page and on the approver's <b>Approve orders</b> screen, so the number of products and the total are the same for the sales PIC and the HOD." }
    ]
  }),
  E({
    id:"2026-11-05-v35.3", version:"v35.3", date:"2026-11-05",
    title:"Orders: editing and removing product lines now saves correctly",
    summary:"Some orders went back to the old total after you removed product lines and saved, and two different orders could get the same order number and be counted as one. Both are fixed; the CRM now refuses to save when the order changed on the sheet instead of editing the wrong line.",
    items:[
      { type:"fix", icon:"✓", title:"Remove lines, save, the total stays", text:"<b>Orders</b> ▸ open an order ▸ <b>✕</b> on a product line ▸ <b>Lưu</b>. Only the lines you see in the window are changed or removed on sheet 3. SALE ORDER — each line is checked (product type, quantity, unit price) before it is written. If the order changed on the sheet in the meantime (a line added or deleted elsewhere), nothing is saved: the CRM reloads the order and asks you to edit again.", img:"updates/v35.3/edit.jpg" },
      { type:"fix", icon:"#", title:"No more shared order numbers", text:"A new order whose number is already used on the sheet gets the next free number automatically (the toast shows the new number). Before, two orders entered a few minutes apart could both get the same number, so the list showed one big order while <b>Edit</b> showed only 2 lines. Orders are now grouped by number + PIC + month + account + order date, the same way on the list, in <b>Edit</b> and on the approval screen." },
      { type:"imp", icon:"!", title:"Orders without an order date", text:"Opening an older order that has no order date no longer fills in today's date (which moved the order to another month). The date box stays empty with a red note — pick the date on the document, then save." }
    ]
  }),
  E({
    id:"2026-11-04-v35.2", version:"v35.2", date:"2026-11-04",
    title:"Orders: sales PICs can delete their own orders again",
    summary:"Deleting an order from the CRM did not work for sales PICs — the server only allowed managers. Now the PIC of an order can delete it (the whole order, every product line, in one step) as long as it is not approved yet.",
    items:[
      { type:"fix", icon:"✓", title:"Delete order works for the PIC", text:"<b>Orders</b> ▸ open your order ▸ <b>Xoá đơn</b> ▸ confirm in the red bar at the bottom of the window. The whole order (all product lines) is removed from sheet 3. SALE ORDER at once — no more half-deleted orders. The confirmation is shown inside the window, so it also works in the installed app and in the e-mail app browser.", img:"updates/v35.2/delete.jpg" },
      { type:"imp", icon:"#", title:"Approved orders stay protected", text:"An order that is already <b>Approved</b> counts for KPI C5 – C7, so only the approver or a manager can delete it — the PIC sees a short note instead of the button. If the sheet changed meanwhile, the CRM finds the right rows again or asks you to <b>Reload</b> first, so it never deletes the wrong row." }
    ]
  }),
  E({
    id:"2026-11-03-v35.1", version:"v35.1", date:"2026-11-03",
    title:"Dental VN: monthly report for each distributor (Word)",
    summary:"Sales can export the monthly report to send back to their distributor — one Word file per distributor, filled in from the Turnover file, the orders and the customer visits of the month.",
    items:[
      { type:"new", icon:"+", title:"Report for distributors", text:"<b>Send report</b> ▸ <b>Monthly report</b> (or <b>Monthly Plan</b>) ▸ <b>Báo cáo gửi NPP</b>. Pick the month and the distributor — a PIC with two distributors (Phuong: Meci and Việt Thái) makes two files. Every line and table cell can be edited before <b>Create Word file</b>.", img:"updates/v35.1/dialog.jpg" },
      { type:"new", icon:"#", title:"What is filled in automatically", text:"Sales of that distributor from the <b>Turnover</b> file (month and FY to date against target, Dental / MMG, Jizai and Composite), <b>supported orders</b> whose Partner is that distributor (rejected orders left out), and a summary of the month's <b>customer visits</b>: customers reached, customer groups, provinces, focus products, top positive and negative feedback. Part 2 lists next month's trainings, new accounts in progress, the Turnover forecast and planned visits. Tenders and MKT activities are typed in.", img:"updates/v35.1/word.jpg" }
    ]
  }),
  E({
    id:"2026-11-02-v35.0", version:"v35.0", date:"2026-11-02",
    title:"Approve orders: the Approve button is back after a change request",
    summary:"After an approver requested changes on an order and the sales PIC edited or re-sent it, the approval screen kept showing \"Changes requested\" with no buttons. The order now comes back as a normal pending order.",
    items:[
      { type:"fix", icon:"✔", title:"Approve after changes", text:"<b>Orders</b> ▸ <b>Approve orders</b>: once the sales PIC sends the order again (or edits it), it shows as <b>Pending</b> with <b>Approve</b> / <b>Reject</b> / <b>Request changes</b>. The screen always reloads the latest list when you open it, and an order you just returned can still be approved." }
    ]
  }),
  E({
    id:"2026-11-02-v34.9", version:"v34.9", date:"2026-11-02",
    title:"KPI report: greetings by title, send confirmation inside the window",
    summary:"Fixes sending the KPI report officially on some devices (nothing happened after clicking Send). The greeting is filled in by the recipient's title.",
    items:[
      { type:"fix", icon:"✓", title:"Sending no longer does \"nothing\"", text:"Click <b>Send monthly (or quarterly) KPI report</b>: a confirmation bar shows the recipients right below the window ⇒ <b>Confirm & send</b>. After sending, the window shows the time and recipients.", img:"updates/v34.9/confirm.jpg" },
      { type:"imp", icon:"#", title:"Greeting by title", text:"The greeting is filled in by recipient — Vietnam teams: Dear chị Tuyên / chị Hòa / sếp Hà; Thailand teams: <b>Dear Ha san</b>. It can still be edited before sending." }
    ]
  }),
  E({
    id:"2026-11-02-v34.8", version:"v34.8", date:"2026-11-02",
    title:"Thailand Dental CRM file: renamed sheets, fixed customer codes, Product test result link, key-account profiling KPI",
    summary:"Fixes from the review of the <b>Thailand Dental</b> CRM file: sheet names, customer / contact codes, the Co-visiting dropdown, a result link in PRODUCT TEST and an automatic KPI C2-02 from sheet ADP.",
    items:[
      { type:"imp", icon:"#", title:"Sheets CUSTOMER TASK and OTHERS TASK", text:"Sheet <b>CUSTOMER VISITING</b> is now <b>CUSTOMER TASK</b> and <b>ALL TASK</b> is now <b>OTHERS TASK</b>. Data and formulas are kept; the app shows the new names." },
      { type:"fix", icon:"✓", title:"Customer and CBC codes no longer show \"??\"", text:"Codes like <b>N??-OT0157</b> now read correctly (e.g. <b>NCM-UN0157</b> for Chiang Mai · University): the CODE MAP lists were rebuilt and every province / account type in use got a code." },
      { type:"fix", icon:"✓", title:"Type action Co-visiting with distributor is valid", text:"The red \"invalid\" mark on <b>Co-visiting with distributor</b> is gone: every dropdown now reads the whole MASTER LIST column." },
      { type:"new", icon:"#", title:"PRODUCT TEST: Result link", text:"Sheet PRODUCT TEST has a new column <b>Result link</b> next to Note — paste the link to the test result." },
      { type:"new", icon:"#", title:"KPI C2-02 from sheet ADP", text:"Sheet ADP has two new columns: <b>Key account</b> (Yes / No) and <b>Profile completed</b> (date filled automatically when the profile row is complete). KPI <b>C2-02</b> = accounts with a complete profile ÷ customers of the PIC in CUSTOMER CODE, by month." }
    ]
  }),
  E({
    id:"2026-11-02-v34.7", version:"v34.7", date:"2026-11-02",
    title:"Monthly and quarterly KPI reports follow the new KPI procedure MMHSOP_009: official forms, due on day 05",
    summary:"Under the <b>KPI Management Procedure MMHSOP_009</b> (effective 01/10/2026) the Monthly KPI Report (form <b>FM01</b>) and Quarterly KPI Report (form <b>FM02</b>) go to your <b>Department Head and the General Director, CC Accounting</b>, by <b>day 05</b>. The Word file in the official form is attached automatically.",
    items:[
      { type:"new", icon:"#", title:"Monthly KPI report on form FM01", text:"Submit Report ▸ <b>KPI</b> (or KPI & Targets ▸ Monthly KPI report): targets, actuals and % come from the KPI file. Write the <b>reason for each target</b>, next-month actions, highlights, challenges and support needed, then <b>Send</b>. The e-mail follows FM01 and the Word file is attached.", img:"updates/v34.7/kpimonth.jpg" },
      { type:"new", icon:"#", title:"Quarterly KPI report on form FM02", text:"KPI & Targets ▸ <b>Quarterly KPI report</b> (replaces Setting Expectation): quarter KPIs are pre-filled, results capped at 130% except sales KPIs. Fill the 5 competencies (1–5), strengths, areas to improve and EE / AE / PA / NA, then send it or download the Word file for signature.", img:"updates/v34.7/kpiquarter.jpg" },
      { type:"imp", icon:"✓", title:"Due on day 05 · Vietnamese form for Vietnam, English form for Thailand", text:"Monthly report by <b>day 05</b>; quarterly report by <b>day 05 of the first month of the next quarter</b> (was 16:00 on day 02 / 17:00 on day 09). A reminder pops up on day 05 if not sent yet. Vietnam sales teams get the Vietnamese form, the Thailand teams the English form.", img:"updates/v34.7/word.jpg" }
    ]
  }),
  E({
    id:"2026-11-02-v34.6", version:"v34.6", date:"2026-11-02",
    title:"JIZAI blisters and Composite tubes on the Orders page · back-filling last month's orders",
    summary:"The Orders page now counts JIZAI blisters and Composite tubes. Orders you forgot to enter for a previous month can be added: care activities logged after the order date now count.",
    items:[
      { type:"new", icon:"#", title:"JIZAI blisters · Composite tubes", text:"Orders ▸ two new figures: <b>JIZAI · blisters</b> and <b>Composite · tubes</b> for the selected month (or year to date), with how many are approved. Rejected orders are not counted.", img:"updates/v34.6/order_stats.jpg" },
      { type:"fix", icon:"✓", title:"Adding a missed order for last month", text:"There is no monthly lock on orders. A new order needs a care activity (Visiting, Telephone, Message…) from 30 days before the order date — now <b>up to today</b>, so an October order entered in November is no longer blocked. No care yet? Click <b>＋ Add care history</b> inside the order form." }
    ]
  }),
  E({
    id:"2026-11-02-v34.5", version:"v34.5", date:"2026-11-02",
    title:"Mentions button: see @mentions and tasks from the MKT Events app right in CRM",
    summary:"The <b>MKT Events</b> app now has discussions, meeting notes and task assignment. When someone <b>@mentions you</b>, assigns you a task or sends you something to review there, CRM shows it on the new <b>Mentions</b> button (red number) — one click opens the right place.",
    items:[
      { type:"new", icon:"@", title:"Mentions button on the top bar", text:"Click <b>Nhắc tôi / Mentions</b> (the @ icon at the top; on phones the @ icon next to Guide) to see when you were @mentioned in a discussion or <b>meeting note</b>, assigned a task, or have work to review / work returned in MKT Events. Click a line to open it in MKT Events; it is marked as read.", img:"updates/v34.5/mentions.jpg" }
    ]
  }),
  E({
    id:"2026-11-02-v34.4", version:"v34.4", date:"2026-11-02",
    title:"Install MMH CRM like an app",
    summary:"MMH CRM can now be installed on your phone and computer: open it from its own icon, full screen, no link to type. It updates itself.",
    items:[
      { type:"new", icon:"⤓", title:"Install on your computer", text:"Click <b>Install app</b> on the top bar (Chrome or Edge) ▸ <b>Install</b>. MMH CRM opens in its own window and appears in the Start menu / Launchpad.", img:"updates/v34.4/install.jpg" },
      { type:"new", icon:"⤓", title:"Install on your phone", text:"Android: <b>More ▸ Tools ▸ Install app</b> ▸ <b>Install</b>. iPhone: open the CRM in <b>Safari</b> ▸ <b>Share</b> ▸ <b>Add to Home Screen</b> ▸ <b>Add</b>, then sign in once more inside the app. The step-by-step guide opens from the same button.", img:"updates/v34.4/install_phone.jpg" }
    ]
  }),
  E({
    id:"2026-10-31-v34.3", version:"v34.3", date:"2026-10-31",
    title:"Task Result in 4 boxes · care history in the order form · finish date · quantity first",
    summary:"Task Result has 4 fixed boxes. A missing care history can be added right inside the order form. Completing a task no longer jumps the date to today — you choose. New contacts are saved to Key stakeholders automatically.",
    items:[
      { type:"imp", icon:"✎", title:"Task Result = 4 boxes", text:"Field visit form ▸ <b>Task Result</b> now shows 4 boxes: Actions Taken · Current Situation · Customer Feedback · Opportunities / Next Steps, each with a <b>Voice</b> button. A <b>Completed</b> task needs all 4 boxes filled before it can be saved.", img:"updates/v34.3/result4.jpg" },
      { type:"new", icon:"☎", title:"Orderer saved as Key stakeholder", text:"Order form ▸ <b>Contact</b>: pick an existing contact or type a new name (add job title and phone). When you save the order, a new contact is added to the account's Key stakeholders (sheet 2. CBC).", img:"updates/v34.3/orderer.jpg" },
      { type:"new", icon:"+", title:"Add care history inside the order form", text:"Order form ▸ customer without care history ▸ <b>Add care history</b> ▸ pick the date, care type (Telephone, Message, Visiting…) and person met ▸ <b>Save care activity</b>. A Completed row is added to Customer meeting at once and you continue the order — no new task form.", img:"updates/v34.3/care.jpg" },
      { type:"imp", icon:"◷", title:"Choose when a task ended", text:"Setting a task to <b>Completed</b> no longer moves its date to today. Pick <b>The selected date</b> (default), <b>Today</b> or <b>Another date</b> in the past; the finish date is saved as you chose.", img:"updates/v34.3/finish.jpg" },
      { type:"imp", icon:"#", title:"Quantity before unit price", text:"Order form ▸ product line: enter <b>SL</b> (quantity) first, then <b>Unit price</b>. Prices and amounts show thousand separators while you type (200.000 instead of 200000).", img:"updates/v34.3/qty_price.jpg" },
      { type:"fix", icon:"✓", title:"First contact of a new account is kept", text:"Adding a new account whose name already exists and choosing <b>Use this account</b> used to drop the contact you typed. The contact is now saved to that account's Key stakeholders." }
    ]
  }),
  E({
    id:"2026-10-31-v34.2", version:"v34.2", date:"2026-10-31",
    title:"Send several orders for approval at once",
    summary:"Sales no longer have to send orders for approval one by one: tick several orders (or select all) and send them in one go.",
    items:[
      { type:"new", icon:"✉", title:"Send several orders at once", text:"Orders ▸ <b>Send several for approval</b> (top of the page or in the yellow notice) ▸ tick the orders or <b>Select all</b> ▸ <b>Send for approval</b>. The approver gets one e-mail listing every selected order with its documents. Orders not sent yet or returned for changes are ticked for you; orders missing documents cannot be ticked until they are fixed.", img:"updates/v34.2/bulk_send.jpg" }
    ] }),
  E({
    id:"2026-10-30-v34.1", version:"v34.1", date:"2026-10-30",
    title:"Thailand Dental team joins the CRM · customer training (T&E) for both Thailand teams",
    summary:"Yong, Man and Sui now work in the CRM like the Thailand Surgical team: same screens, English interface, their own data file. Both Thailand teams can log customer training sessions (T&E), and the Dental KPIs FY68 are linked to the KPI file.",
    items:[
      { type:"new", icon:"🇹🇭", title:"Thailand Dental CRM", text:"Sign in with your company e-mail (Yong · Man · Sui) ▸ the app opens <b>Thailand Dental CRM</b>. Customers, contacts, visits, monthly reports and ADP come from the file <b>1. Thailand - Dental Action FY68</b>, now in the same layout as Thailand Surgical (sheet names without numbers: CUSTOMER CODE, CUSTOMER VISITING, TARGET & KPI…). The whole app is in English. Weekly / monthly reports go To Shuhei, Cc Ha + Hoa." },
      { type:"new", icon:"🎓", title:"Customer training (T&E) for both Thailand teams", text:"<b>Presentations · Customer training</b> ▸ tab <b>Customer training (T&E)</b> ▸ <b>New session</b>: date, topic, product, attendees from your customer list and the 5-line review. Saved to the Training Master like Dental Vietnam.", img:"updates/v34.1/te.jpg" },
      { type:"imp", icon:"⇄", title:"Dao switches between the two teams", text:"Side menu ▸ <b>Current group</b> ▸ <b>Thailand Surgical</b> or <b>Thailand Dental</b>. Dao sees and updates the work of the whole team in both files.", img:"updates/v34.1/team.jpg" },
      { type:"new", icon:"%", title:"Dental KPIs FY68 linked", text:"<b>KPIs & Targets</b> shows the KPIs of Yong, Man and Sui with targets from the KPI file. Visits with Type action <b>Co-visiting with distributor</b> count for C4-01 (Yong) and C4-03 (Man: days with 5 or more co-visits). New key accounts (DSO, dental university, hospital) approved in <b>New account & SKU</b> count for C2-01." }
    ]
  }),
  E({
    id:"2026-10-29-v34.0", version:"v34.0", date:"2026-10-29",
    title:"Composite / JIZAI quantity KPI counts approved orders only",
    summary:"The quantity KPIs \"Composite qty supported\" and \"JIZAI qty supported\" now follow the same rule as \"Supported sales\": only orders that are Approved are counted.",
    items:[
      { type:"imp", icon:"✓", title:"Only approved orders count", text:"An order line adds its Composite / JIZAI quantity to your KPI once the order is <b>Approved</b>. Pending, returned or rejected orders are not counted. Orders before 10/2026 without an order type count as before. The month is still the order month." }
    ]
  }),
  E({
    id:"2026-10-29-v33.9", version:"v33.9", date:"2026-10-29",
    title:"Monthly Word report: edit everything before you download",
    summary:"The monthly sales report now opens as an editable draft. Change any text or table cell, add or delete lines, tables and sections, then create the Word file. Available to every Dental and Surgical PIC.",
    items:[
      { type:"imp", icon:"✎", title:"Edit the draft", text:"<b>Send report</b> ▸ <b>Monthly report</b> ▸ <b>Word report</b> (or <b>Monthly Plan</b> ▸ <b>Word report</b>). The figures from CRM and the Turnover file appear as a draft: type over any text or table cell, <b>+ Add</b> a line, paragraph, table or section, <b>×</b> to delete (a heading deletes its whole section), ↑ ↓ to reorder, <b>Undo</b> if needed. Then click <b>Create Word file</b>.", img:"updates/v33.9/edit.jpg" },
      { type:"new", icon:"↻", title:"Draft is kept", text:"Your edits are saved on this device for each month and PIC, so you can come back later. <b>Refresh data</b> rebuilds the draft from the latest CRM figures (Undo brings your edits back).", img:"" }
    ]
  }),
  E({
    id:"2026-10-29-v33.8", version:"v33.8", date:"2026-10-29",
    title:"Monthly sales report in Word, filled from CRM (Dental · Surgical)",
    summary:"The formal \"MMH Sales Activity Report\" (this month's results + next month's plan) is now built from CRM and the Turnover file. Add a few notes and download the Word file.",
    items:[
      { type:"new", icon:"W", title:"Word report button", text:"<b>Send report</b> ▸ <b>Monthly report</b> ▸ <b>Word report</b> (also on <b>Monthly Plan</b>). Pick the month and the PIC (managers: whole team), write the few items CRM has no field for — market factors, defective products, expected sales, tender plan — then click <b>Create Word file</b>. Notes are kept as a draft on this device.", img:"updates/v33.8/word.jpg" },
      { type:"new", icon:"#", title:"Figures filled in for you", text:"Distributor turnover vs budget (month + FY to date), Jizai / Composite, orders by product group, new accounts, tender orders, hospital / university / clinic sales, customer feedback from visits and presentations, next month's scheduled visits, trainings, open new-account cases, tenders and event enrolment tasks.", img:"updates/v33.8/doc.jpg" }
    ]
  }),
  E({
    id:"2026-10-28-v33.7", version:"v33.7", date:"2026-10-28",
    title:"Request changes on many orders at once · sales see the note on each order",
    summary:"Approvers write a change request on each order, then send them all with one click. Each sales PIC gets one e-mail listing every order with its note, and CRM shows the orders to fix as soon as they sign in.",
    items:[
      { type:"imp", icon:"✎", title:"Collect notes, send once", text:"<b>Approve orders</b> ▸ <b>Request changes</b> ▸ write the note ▸ <b>Save note</b>: the order is marked <b>Request not sent</b> and the next order opens. In <b>List</b> you can tick several orders and give them one note. When done, click <b>Send change requests</b> in the yellow bar — one e-mail per sales PIC with the note under each order.", img:"updates/v33.7/drafts.jpg" },
      { type:"new", icon:"!", title:"Sales: orders to fix", text:"After signing in, sales PICs with new change requests see <b>Orders to fix</b>: the approver's note on each order, <b>Edit order</b> and <b>Send for approval again</b>. It also opens from <b>Orders</b> ▸ <b>View notes</b> and from the link in the e-mail.", img:"updates/v33.7/sales.jpg" }
    ]
  }),
  E({
    id:"2026-10-28-v33.6", version:"v33.6", date:"2026-10-28",
    title:"Split orders joined again · visit date changes stick · training attendees from your customer list",
    summary:"Orders that were split into several cards after adding documents are one order again. A changed visit date no longer jumps back. Customer training (T&E) attendees are picked from the PIC's own customer list.",
    items:[
      { type:"fix", icon:"🧾", title:"Split orders joined again", text:"After documents were added to one line, the other lines of the same order showed as separate orders without type or documents. Lines of the same account, order date and PIC now share one Order No., order type and documents automatically. Open <b>Orders</b>: each order shows as one card again." },
      { type:"fix", icon:"📅", title:"Changed visit date stays", text:"Open a field visit ▸ change <b>Date</b> ▸ <b>Save</b>: the visit moves to the new day and stays there, even while the change is still being sent or when the sheet's row numbers have changed." },
      { type:"imp", icon:"🎓", title:"Training attendees from your customer list", text:"<b>Presentations ▸ Customer training (T&E)</b> ▸ <b>Customers attending</b>: type a name and pick from the PIC's own contacts and accounts only. Sessions are saved to the Training Master and count for the training KPI.", img:"updates/v33.6/te_aud.jpg" }
    ]
  }),
  E({
    id:"2026-10-28-v33.5", version:"v33.5", date:"2026-10-28",
    title:"Approve orders: flip through orders with their documents · approve several at once · e-mail link opens the order",
    summary:"Approvers get a new <b>Approve orders</b> screen: check one order at a time with its documents, or tick several orders and approve them together. Every button now answers at once. The link in the approval e-mail opens that order directly — no sign-in code needed on the phone.",
    items:[
      { type:"new", icon:"📄", title:"One order at a time", text:"<b>Orders</b> ▸ <b>Approve orders</b> ▸ <b>One by one</b>: order details, product lines and the documents side by side. Flip with ‹ › (arrow keys, or swipe on a phone). <b>Approve</b> ⇒ the next order opens; <b>Request changes</b> / <b>Reject</b> ⇒ type the reason in the box below.", img:"updates/v33.5/one.jpg" },
      { type:"new", icon:"☑", title:"Approve several orders at once", text:"<b>Approve orders</b> ▸ <b>List</b>: tick the orders (or the top box for every ready order) ▸ <b>Approve n orders</b>. Click a row to see its details and documents. Filter by sales PIC at the top.", img:"updates/v33.5/list.jpg" },
      { type:"fix", icon:"✔", title:"Approve buttons always respond", text:"Before, Approve sometimes seemed to do nothing (a greyed button for an incomplete order, or a reason box that phone e-mail apps do not show). Now the button shows <b>Sending…</b>, then the result on the order; an incomplete order tells you what is missing and opens <b>Request changes</b>.", img:"updates/v33.5/mobile.jpg" },
      { type:"fix", icon:"✉", title:"E-mail link opens the order", text:"Click the link in the <b>order approval request</b> e-mail: CRM opens that order in the approval screen. On a phone e-mail app you are signed in by the link (only the approver's copy has it, valid 7 days); if it has expired, sign in with your e-mail code and the order still opens.", img:"" }
    ]
  }),
  E({
    id:"2026-10-28-v33.4", version:"v33.4", date:"2026-10-28",
    title:"Orders with several products: the whole order counts · edit the whole order",
    summary:"An order with several product lines is now sent for approval, approved and counted for KPI C5 as <b>one order with every line</b> (before, only the first line was counted). <b>Edit order</b> opens all lines, so you can add or remove products.",
    items:[
      { type:"fix", icon:"🧾", title:"Whole order sent and counted", text:"Orders saved without an Order No. were split into one order per line, so <b>Send for approval</b>, approval and KPI C5 took only the first product. Now every line of the order is included and each order gets one Order No. automatically. Open <b>Orders</b> and send the order again if it showed only one product." },
      { type:"imp", icon:"✏️", title:"Edit the whole order", text:"<b>Orders</b> ▸ click an order ▸ <b>Edit order</b>: every product line is shown. Change a line, <b>＋ Add product</b> or remove a line (✕), then <b>Save</b>. Editing an approved order sends the whole order back to Pending.", img:"updates/v33.4/order_edit.jpg" }
    ]
  }),
  E({
    id:"2026-10-23-v33.3", version:"v33.3", date:"2026-10-23",
    title:"Report statistics (on time / late) · e-mail the quarterly self-evaluation",
    summary:"Every weekly report, monthly KPI report and quarterly self-evaluation e-mail is logged and compared with its deadline using the <b>MMH Vietnam / Thailand work calendar</b>. Admin, Director and HOD can export the statistics per PIC to Excel.",
    items:[
      { type:"new", icon:"▥", title:"Report statistics (Excel)", text:"Top bar ▸ <b>Report stats</b> ▸ choose the months ▸ <b>Export Excel</b>. The latest e-mail per PIC and period counts: weekly report before 24:00 on the last working day of the week (working Saturdays and holidays included), monthly KPI before 16:00 on day 02, quarterly self-evaluation before 17:00 on day 09 of the next quarter.", img:"updates/v33.3/v333stat.jpg" },
      { type:"new", icon:"✉", title:"E-mail the quarterly self-evaluation", text:"KPI ▸ <b>Setting Expectation</b> ▸ fill in ▸ <b>Send e-mail</b> ⇒ the Word file is attached and recipients are pre-filled from your manager ▸ <b>Send</b> (or <b>Test to me</b>). Only e-mails sent this way count as submitted." }
    ]
  }),
  E({
    id:"2026-10-22-v33.2", version:"v33.2", date:"2026-10-22",
    title:"New order e-mail goes to the HOD",
    summary:"When a sales person saves a new order, the notification e-mail now goes to the HOD (Head of Sales & Marketing) instead of the Director.",
    items:[
      { type:"fix", icon:"📧", title:"New order notification", text:"Open <b>Orders</b> ▸ <b>New order</b> and save: CRM e-mails the <b>HOD</b> (Head of Sales & Marketing) — the person who approves orders — instead of the Director. The note under the form shows who receives it.", img:"updates/v33.2/order_mail.jpg" }
    ] }),
  E({
    id:"2026-10-17-v33.1", version:"v33.1", date:"2026-10-17",
    title:"To do: weekly reports not sent",
    summary:"The To do box on the Dashboard now also shows who has not sent last week's weekly report.",
    items:[
      { type:"new", icon:"📧", title:"Last week's weekly report", text:"Open <b>Dashboard</b>: the <b>To do</b> box shows the PICs who have not sent last week's report yet (for a PIC: your own report). Click it to open <b>Submit Report</b>. Checking starts with the week of 19–25 Oct.", img:"updates/v33.1/dash_todo.jpg" }
    ] }),
  E({
    id:"2026-10-17-v33.0", version:"v33.0", date:"2026-10-17",
    title:"To-do box and PIC ranking on the Dashboard · simpler navigation",
    summary:"The Dashboard shows what is waiting for you, compares PICs and has more charts. Field visits, the phone bottom bar, the visit form and report sending are simpler. \"CRM order\" is now just \"Order\", and Monthly Tasks is now Monthly Plan.",
    items:[
      { type:"new", icon:"✅", title:"Dashboard ▸ To do", text:"Open <b>Dashboard</b>: the <b>To do</b> box lists orders to approve or fix, new-account cases, presentations without a full report and past visits without a result. Click a line to open that page.", img:"updates/v33.0/dash_todo.jpg" },
      { type:"new", icon:"🏆", title:"Comparison by PIC", text:"Managers: <b>Dashboard ▸ Sales</b> ranks every PIC by distributor sales % (month and to date), with visits, orders, order value and new accounts side by side.", img:"updates/v33.0/pic_rank.jpg" },
      { type:"new", icon:"📊", title:"Orders by status and by type", text:"<b>Dashboard ▸ Sales</b> also shows how many orders are approved, waiting, need changes or were rejected, and how many orders there are of each order type.", img:"updates/v33.0/order_mix.jpg" },
      { type:"new", icon:"🤝", title:"Activities and customer feedback", text:"<b>Dashboard ▸ Customers</b> adds completed activities by type (visit, call, message…) and customer feedback. Managers also get a coverage table by PIC.", img:"updates/v33.0/cust_act.jpg" },
      { type:"imp", icon:"📍", title:"Field visits: one name, List · Calendar", text:"The visit list is called <b>Field visits</b> everywhere. On a computer the extra tab row is gone: open it from the menu and switch <b>List · Calendar</b> at the top right.", img:"updates/v33.0/visit_head.jpg" },
      { type:"imp", icon:"⚡", title:"Visit form fills itself", text:"<b>＋ ▸ Field visit</b>: after you pick the account, task type, sales process and product group are filled from your last visit to that account. Just check and save.", img:"updates/v33.0/visit_form_m.jpg" },
      { type:"imp", icon:"📱", title:"Phone: Orders in the bottom bar", text:"Bottom bar: <b>Calendar · Accounts · Today · Orders · More</b> (New accounts moved to More). In Weekly meeting the ＋ button no longer covers <b>Save minutes</b>. The team is switched only in the side menu or <b>More ▸ Team</b>.", img:"updates/v33.0/mobile_bar.jpg" },
      { type:"imp", icon:"✏️", title:"Clearer names and messages", text:"\"CRM order value\" is now <b>Order value</b>; <b>Monthly Tasks</b> is now <b>Monthly Plan</b> (same function). All reports are sent from <b>Submit Report</b> — the KPI and Monthly Plan pages link there. Reminder pop-ups show once a day; technical error texts are replaced by plain messages." }
    ] }),
  E({
    id:"2026-10-17-v32.9", version:"v32.9", date:"2026-10-17",
    title:"Dashboard with charts in 2 tabs · one Orders page with order details",
    summary:"The Dashboard now has two tabs, Sales and Customers, with monthly charts. Orders is one page: figures on top, the list below, and a click on an order opens its details. Customer-visit KPIs on the KPI sheet are fixed.",
    items:[
      { type:"imp", icon:"📊", title:"Dashboard ▸ Sales", text:"Dashboard ▸ <b>Sales</b>: distributor sales by month (bars, line = target), CRM order value by month, each sales KPI against its own target (this month and to date), product groups and top customers. Hover a bar for the numbers.", img:"updates/v32.9/dash_sales.jpg" },
      { type:"imp", icon:"👥", title:"Dashboard ▸ Customers", text:"Dashboard ▸ <b>Customers</b>: visits by month, customers by type (cared for / total), coverage by PIC and the accounts to revisit.", img:"updates/v32.9/dash_cust.jpg" },
      { type:"imp", icon:"🧾", title:"One Orders page", text:"Menu ▸ Sales Result ▸ <b>Orders</b> (Order Entry and Orders are merged): figures and product groups on top, orders by month below with the number of <b>products</b> and the order date (the day strip is gone).", img:"updates/v32.9/orders.jpg" },
      { type:"new", icon:"🔎", title:"Order details", text:"Click an order ⇒ a details screen: account, distributor, order type, approval status and note, every product with quantity and price, documents. <b>Edit order</b> opens the form.", img:"updates/v32.9/order_detail.jpg" },
      { type:"fix", icon:"✓", title:"Visit KPIs on the KPI sheet", text:"The customer-visit KPI cells (C3) on sheet 9. TARGET &amp; KPI showed #ERROR! after the \"Completed only\" rule was added. They are repaired automatically the next time the CRM is opened.", img:"" }
    ]
  }),
  E({
    id:"2026-10-17-v32.8", version:"v32.8", date:"2026-10-17",
    title:"Order documents: paste a screenshot",
    summary:"No need to save a file first: take a screenshot of the invoice / delivery note and paste it straight into the order.",
    items:[
      { type:"new", icon:"⧉", title:"Paste screenshots (computer)", text:"New / edit order ▸ Documents ▸ take a screenshot (Win+Shift+S or ⌘+Ctrl+Shift+4) and press <b>Ctrl+V</b> — the image uploads at once. Long document? Capture it part by part and paste each one: every paste adds another image (2, 3, 4… per order). You can also drop files into the box.", img:"updates/v32.8/paste.jpg" },
      { type:"new", icon:"📱", title:"Paste image (phone)", text:"On a phone tap <b>Paste image</b> after taking or copying a screenshot (allow Paste when asked), or <b>Choose file</b> ▸ the screenshot in your photos. New accounts &amp; SKUs also has a <b>Paste screenshot</b> button.", img:"updates/v32.8/paste_phone.jpg" }
    ]
  }),
  E({
    id:"2026-10-17-v32.7", version:"v32.7", date:"2026-10-17",
    title:"Distributor sales load again in the weekly meeting",
    summary:"Some computers showed \"Cannot read the Turnover file\" (e.g. Chrome signed in to another Gmail account). The CRM now reads the Turnover file through the Training Hub automatically.",
    items:[
      { type:"fix", icon:"↻", title:"Turnover file always readable", text:"Weekly meeting ▸ 1. Overview ▸ Distributor sales: if reading the Turnover file directly fails, the CRM reads it through the Training Hub with your company login — the figures appear as usual, nothing to do.", img:"updates/v32.7/turnover.jpg" }
    ]
  }),
  E({
    id:"2026-10-17-v32.6", version:"v32.6", date:"2026-10-17",
    title:"Other tasks: Training & Research, Thailand list, short descriptions · separate meeting notes",
    summary:"A 4th fixed key task, Training & Research, is added for Dental, Surgical and Eyeless. Thailand now uses the same list in English plus Others. Each key task shows a short description. The weekly meeting has separate notes for each part.",
    items:[
      { type:"new", icon:"☰", title:"Training & Research + descriptions", text:"Other tasks ▸ <b>+ Key Task</b> ⇒ 4 key tasks of the month, each with a short description: Reports &amp; plans · Fanpage &amp; consulting · Event enrolment · <b>Training &amp; Research</b> (products, competitors, market information). The sub-task form shows an example.", img:"updates/v32.6/other.jpg" },
      { type:"imp", icon:"🌏", title:"Thailand: fixed key tasks in English", text:"Thailand team ▸ Other tasks ▸ pick Reports &amp; Plans · Fanpage &amp; Consulting · Event Enrolment · Training &amp; Research · <b>Others</b> of the month. Other key task names can no longer be typed.", img:"updates/v32.6/other_th.jpg" },
      { type:"imp", icon:"📝", title:"Separate meeting notes", text:"Weekly meeting ▸ parts 3 and 4 ▸ each tab (Activity log, Daily tasks, Presentations, Business trips, ADP, New accounts &amp; SKUs, Orders) has its own notes on the right; a dot marks tabs with notes. The weekly email and PDF show each note under its part.", img:"updates/v32.6/meet_notes.jpg" }
    ]
  }),
  E({
    id:"2026-10-16-v32.5", version:"v32.5", date:"2026-10-16",
    title:"Other tasks: 3 fixed monthly key tasks · weekly meeting in 4 parts",
    summary:"Sales now log other tasks under 3 fixed key tasks of the month. The weekly meeting follows the new 4-part frame with automatic figures — the tender part is gone and ADP is added.",
    items:[
      { type:"imp", icon:"☰", title:"3 fixed key tasks per month", text:"Other tasks ▸ <b>+ Key Task</b> (or a day in the calendar) ⇒ pick <b>Reports &amp; plans</b>, <b>Fanpage &amp; consulting</b> or <b>Event enrolment</b> of that month only, then write the sub-task. Sales can no longer type their own key task names (managers keep the old way).", img:"updates/v32.5/other.jpg" },
      { type:"imp", icon:"🗂", title:"Weekly meeting: 4 parts", text:"Weekly meeting ▸ 1. Overview (distributor sales + the PIC's KPIs this month) · 2. Customers · 3. Activities &amp; Plans · 4. Sales Result. Figures are read automatically; meeting notes on the right. The tender part is removed.", img:"updates/v32.5/meet.jpg" },
      { type:"new", icon:"⭐", title:"ADP in the meeting", text:"Part 3 ▸ tab <b>ADP</b> shows each key account: group, actual / target, objective, key action and latest status. The weekly email and PDF follow the same 4 parts.", img:"updates/v32.5/meet_adp.jpg" }
    ]
  }),
  E({
    id:"2026-10-16-v32.4", version:"v32.4", date:"2026-10-16",
    title:"New account with the same name as an existing one",
    summary:"Clinics often share a name. Creating a new account with a name that already exists is no longer blocked — you choose to use the existing account or create a new one.",
    items:[
      { type:"fix", icon:"＋", title:"Same name, new account", text:"New account ▸ the name already exists ⇒ the form lists the accounts with that name (code · type · province · PIC). Click <b>Use this account</b>, or <b>Create new account</b> — the new account gets its own code from area + province + type.", img:"updates/v32.4/account.jpg" }
    ]
  }),
  E({
    id:"2026-10-16-v32.3", version:"v32.3", date:"2026-10-16",
    title:"Simpler menu, Dashboard and KPI page · account details with ADP on the right",
    summary:"The menu now has 5 groups. The Dashboard shows only sales (this month vs. cumulative) and customers, and the KPI page shows plain KPI tables per PIC. Order cards show fewer notes, and each account shows its ADP targets and status on the right.",
    items:[
      { type:"imp", icon:"☰", title:"Menu in 5 groups", text:"Overview (Dashboard · KPIs & Targets) · Customers (Customer List · Key Stakeholders) · Activities & Plans (Activity Log · Daily Tasks · Order Entry · Presentations · Monthly Tasks · ADP) · Sales Result (New Accounts & SKUs · Orders) · Tools & Reports (Weekly Meetings · Field Photos · Submit Report).", img:"updates/v32.3/menu.jpg" },
      { type:"imp", icon:"📊", title:"Dashboard: sales + customers", text:"Totals on top: customers, contacts, visits, orders, order value. <b>Sales</b>: this month on the left, cumulative on the right — pick a month (managers also a PIC). <b>Customers</b>: new accounts, coverage, accounts without care for 30+ days, top customers and who to visit next.", img:"updates/v32.3/dash.jpg" },
      { type:"imp", icon:"🎯", title:"KPI per PIC", text:"KPIs & Targets ▸ one table per PIC: weight, target, actual, % and the overall score, by month, quarter or FY to date. The long explanations are gone.", img:"updates/v32.3/kpi.jpg" },
      { type:"imp", icon:"🧾", title:"Orders: fewer notes", text:"Order Entry ▸ approval notes become short labels (hover to read the full note) and the repeated order-type label is hidden. \"Ask for changes\" is now called <b>Request changes</b>. Sales Result ▸ Orders shows the totals and a month table.", img:"updates/v32.3/orders.jpg" },
      { type:"imp", icon:"⭐", title:"Account details: ADP on the right", text:"Click an account ⇒ the right column shows <b>ADP targets & status</b> first (group A–D, target / actual, objective, key action, latest quarterly status), then overview, contacts and account info.", img:"updates/v32.3/account.jpg" }
    ]
  }),
  E({
    id:"2026-10-16-v32.2", version:"v32.2", date:"2026-10-16",
    title:"Orders: new layout and customer-care check · visit KPI fixed · product presentations",
    summary:"The Orders page is simpler: key numbers on top and a month ▸ order ▸ product list like the Report Hub timeline. A new order needs a recent customer-care activity and e-mails the Director. Visit counts now match the KPI sheet, and presentation reports are easier to complete.",
    items:[
      { type:"imp", icon:"🧾", title:"New Orders page", text:"Orders ▸ the order KPI block is gone. On top: number of orders, unique customers, amount this month and FY to date, and value by product group. Below, a list by month ▸ order (click the arrow to see product lines); the dot colour shows approval and the day strip marks the order day.", img:"updates/v32.2/orders.jpg" },
      { type:"new", icon:"🤝", title:"Care history before a new order", text:"New order ▸ pick the account ⇒ the form shows the latest care activity. With no <b>Completed</b> Visiting / Telephone / Message… in the 30 days before the order date, the order cannot be saved — click <b>Log a care activity</b> first. Each new order e-mails the Director.", img:"updates/v32.2/care.jpg" },
      { type:"fix", icon:"📍", title:"Visit count = KPI sheet", text:"Dashboard ▸ Customer visits now counts only <b>Completed</b> Visiting rows with a photo — the same rule as the KPI sheet (before, every Visiting row was counted). A visit can be set to Completed only when the result, customer feedback and next action (follow-up) are filled in.", img:"updates/v32.2/visits.jpg" },
      { type:"imp", icon:"🎤", title:"Product presentations", text:"Presentations ▸ cleaner cards with the 5 report sections, tiles for sessions counted for KPI, and a reminder for past sessions with an incomplete report. Click <b>Complete the report</b> to fill it in.", img:"updates/v32.2/pres.jpg" },
      { type:"imp", icon:"✍", title:"5 report sections", text:"Open a presentation ⇒ the Event review is now 5 separate boxes (attendees, activity summary, customer feedback, sales, next actions) with a detail meter; a box that is too short shows <b>Add more detail</b>. Only complete reports count for KPI.", img:"updates/v32.2/presform.jpg" }
    ]
  }),
  E({
    id:"2026-10-15-v32.1", version:"v32.1", date:"2026-10-15",
    title:"Orders: ask for changes, and order notices",
    summary:"Approvers can now send an incomplete order back with <b>Ask for changes</b> instead of facing a greyed-out Approve button. A red number next to <b>Orders</b> and a notice at the top of the page show what needs attention.",
    items:[
      { type:"new", icon:"↩", title:"Ask for changes", text:"Orders ▸ a pending order missing its type or documents ▸ the approver clicks <b>Ask for changes</b> and writes what is missing ⇒ the sales PIC gets an e-mail, the card shows \"Changes needed\"; after fixing it the PIC clicks <b>Send again</b>.", img:"updates/v32.1/approve.jpg" },
      { type:"new", icon:"🔔", title:"Order notices", text:"A red number next to <b>Orders</b> in the menu and a notice at the top of the Orders page: orders waiting for your approval, returned orders, orders missing documents or not sent yet. Approvers also get a short reminder after signing in.", img:"updates/v32.1/notice.jpg" }
    ]
  }),
  E({
    id:"2026-10-15-v32.0", version:"v32.0", date:"2026-10-15",
    title:"Orders: send for approval and approve right on the order card",
    summary:"Pending orders now have a <b>Send for approval</b> button for the sales PIC and <b>Approve</b> / <b>Reject</b> buttons for the approver. The e-mails are plain, formal letters with the documents shown in the message.",
    items:[
      { type:"new", icon:"✉", title:"Send for approval", text:"Orders ▸ an order marked <b>Pending</b> ▸ click <b>Send for approval</b> ⇒ the approver (Tuyen) gets an e-mail with the order details and the document images in the message. The card then shows when it was sent; you can send it again.", img:"updates/v32.0/send.jpg" },
      { type:"new", icon:"✔", title:"Approve on the card", text:"Approvers see <b>Approve</b> / <b>Reject</b> on each pending order card (a rejection needs a reason). The result is e-mailed to the sales PIC. Approvers no longer see the New order button.", img:"updates/v32.0/approve.jpg" },
      { type:"imp", icon:"📄", title:"Plain approval e-mails", text:"New-account and order e-mails are now simple letters: \"Dear chị Tuyên,\" · the details line by line · document images inside the e-mail · CRM link · signature." }
    ]
  }),
  E({
    id:"2026-10-13-v31.9", version:"v31.9", date:"2026-10-13",
    title:"English text fixes in the visit form and photo block",
    summary:"The field-visit form, the account picker and the photo block no longer show Vietnamese text in English mode.",
    items:[
      { type:"fix", icon:"🌐", title:"Missing English text", text:"Open a field visit ▸ the Task Result hints (\"CBC (person met) recorded\"), the account picker (\"N results\") and the photo block (Open camera, Photo waiting to send, GPS note) are now in English." }
    ]
  }),
  E({
    id:"2026-10-13-v31.8", version:"v31.8", date:"2026-10-13",
    title:"Business trips: proposal only · TEST data screen no longer hangs",
    summary:"The <b>Approve trips</b> button is removed from the CRM — you only <b>propose</b> trips here; the Director approves through the Business Trip email. Admin TEST mode now shows a clear message with <b>Rebuild</b> / <b>Exit TEST</b> if the TEST data cannot be prepared.",
    items:[
      { type:"imp", icon:"🧳", title:"Approve trips removed", text:"The Approve trips button on the top bar is gone. Calendar ▸ <b>Propose a trip</b> works as before: the <b>Business Trip Approval Request</b> email goes to the Director, CC your head of department and you." },
      { type:"fix", icon:"🧪", title:"TEST data: no more endless loading", text:"Admin ▸ TEST: preparing the TEST data no longer fails on a validation rule (cell D5 of the trip sheet). If something still goes wrong the screen shows the reason with <b>Rebuild</b> and <b>Exit TEST</b> buttons instead of spinning forever." }
    ]
  }),
  E({
    id:"2026-10-13-v31.7", version:"v31.7", date:"2026-10-13",
    title:"Dental orders: the distributor is filled in by PIC",
    summary:"When a Dental sales order is created, the <b>Partner</b> (distributor) now follows the sales PIC automatically: Viet → Nam Dung, Vinh → S.P.I, Phuong chooses Meci or Viet Thai.",
    items:[
      {type:"imp", icon:"🏷", title:"Distributor filled in by PIC", text:"Open <b>Sales order ▸ New order</b> ▸ the <b>Partner</b> box is filled in from the PIC (Viet → Nam Dung, Vinh → S.P.I, both locked). For Phuong it becomes a short list: <b>Meci</b> or <b>Viet Thai</b>. Partner type is set to Distributor. Choosing another account changes the PIC and the distributor follows.", img:"updates/v31.7/npp-by-pic.jpg"}
    ]
  }),
  E({
    id:"2026-10-13-v31.6", version:"v31.6", date:"2026-10-13",
    title:"Instant other tasks, reliable field-visit dates, order approval and customer training (T&E)",
    summary:"Other tasks now appear the moment you save and are written to the ALL TASK sheet in the background. Field-visit tasks always keep their start date and photos land on the right task. Sales orders get an <b>Order Type</b> and a manager approval; Dental can log <b>customer training (T&E)</b>. The exchange rate is fixed at <b>26,700 VND/USD</b>.",
    items:[
      {type:"new", icon:"⚡", title:"Other tasks appear instantly", text:"Add, edit or delete an item in <b>Update ▸ Other tasks</b> ▸ it shows on screen at once; the app writes it to the ALL TASK sheet behind the scenes (a small chip shows <b>Saving…</b>). No signal? It retries by itself; a red chip lets you retry or discard. New items always get a start date (today) and a deadline.", img:"updates/v31.6/other-instant.jpg"},
      {type:"fix", icon:"📍", title:"Field visits keep their start date and photo", text:"Saving a field visit always fills the <b>Start date</b>. Updates, photos and deletes now identify the task by its number, account and PIC, so when another row on the sheet was removed the app finds the right task instead of writing to the wrong row. Tasks that had lost their date were repaired from the photo time stamp."},
      {type:"fix", icon:"📅", title:"Dates on the sheets are consistent", text:"Start / finish dates typed as month/day by mistake (e.g. 10/09 saved as 9 October) are corrected when the Start Month column confirms it, extra hours are removed and text dates become real dates — so weekly and per-day counts are right. The CRM files now read typed dates as day/month/year."},
      {type:"new", icon:"✔", title:"Order Type + manager approval (C5)", text:"Each order from 10/2026 has an <b>Order Type</b> (tender award · new account · consulting) and documents. Approvers open <b>Sales order ▸ Approve orders</b> ▸ approve one order or a whole month per PIC. Only approved orders count for C5 (fixed rate 26,700).", img:"updates/v31.6/order-approve.jpg"},
      {type:"new", icon:"🎓", title:"Customer training (T&E) — Dental", text:"Open <b>Presentation · Customer training ▸ Customer training (T&E)</b> ▸ <b>New session</b>: date, topic, product, attendees picked from the customer list. Sessions are saved to the Training Master; only <b>Completed</b> sessions with actual attendees and the 5-line review count for C10-03 / 04 / 05.", img:"updates/v31.6/te-form.jpg"},
      {type:"imp", icon:"🧾", title:"Fixed rate · visits with photos · presentation review", text:"The exchange-rate setting is gone (fixed 26,700 VND/USD). A visit counts for KPI only with a photo (Surgical Thailand excepted). A product presentation needs <b>Actual participant</b> > 0 and the fixed 5-line <b>Event review</b> before it can be saved."}
    ]
  }),
  E({
    id:"2026-10-13-v31.5", version:"v31.5", date:"2026-10-13",
    title:"Admin TEST mode: try every function with real saves and see where the data goes",
    summary:"For the Admin only. The CRM runs as a user named <b>TEST</b>: tasks, photos, customers, orders, reports, trips and new accounts are <b>really saved</b> under the name TEST, every e-mail goes only to the Admin, and a <b>Data flow</b> panel shows which file, tab and row each save went to. Nobody else sees TEST data and it is never counted in KPI.",
    items:[
      {type:"new", icon:"🧪", title:"Start TEST mode", text:"Click <b>TEST mode</b> on the top bar (phone: <b>More ▸ Tools</b>) ▸ pick the team whose CRM file receives the data ▸ pick a role: <b>Sales TEST</b>, <b>Manager</b> or <b>Director</b> ▸ <b>Start</b>. Photos are saved as <b>TEST_&lt;date&gt;_&lt;account&gt;_01.jpg</b>.", img:"updates/v31.5/test-mode-pick.jpg"},
      {type:"new", icon:"➜", title:"Data flow panel", text:"Click the yellow <b>TEST</b> button (bottom-left). Each save shows ① the action → ② the backend → ③ the file ▸ tab ▸ row (with a link) → ④ who the e-mail would normally go to — it is sent only to the Admin with <b>[TEST]</b> in the subject. A checklist ticks off each function tested.", img:"updates/v31.5/test-mode-flow.jpg"},
      {type:"new", icon:"✔", title:"Play the Director or the Manager", text:"Propose a trip as Sales TEST, switch to <b>Director</b> ▸ <b>Approve trips</b> ▸ approve it; submit a new account, switch to <b>Manager</b> ▸ approve it. Only TEST records can be approved — real ones still need the real Director / manager.", img:"updates/v31.5/test-mode-phone.jpg"},
      {type:"imp", icon:"🧹", title:"Delete test data", text:"In the Data flow panel click <b>Delete test data</b>: rows with PIC TEST, TEST trip proposals and their folders, and TEST_… photos / files are removed from the CRM files. Real data is never touched. <b>Exit TEST mode</b> returns to your own account. (The old <b>View as a sales person</b> mode, which saves nothing, is still in the same dialog.)"}
    ]
  }),
  E({
    id:"2026-10-12-v31.4", version:"v31.4", date:"2026-10-12",
    title:"Monthly report: everything you type or dictate is saved to the sheet",
    summary:"Fixed: in a monthly task, text entered with <b>Speak</b> (voice) was shown on screen but not sent to the sheet, and closing the panel without saving lost the text without warning.",
    items:[
      {type:"fix", icon:"🎤", title:"Voice and typed text are always saved", text:"Open <b>Monthly tasks</b> ▸ click an item ▸ type or press <b>Speak</b> in PLAN / RESULT ▸ <b>Save to Sheet</b>. Every box that changed is sent, and a message confirms the sheet row, e.g. <b>Saved to sheet 5. MONTHLY REPORT, row 102</b>.", img:"updates/v31.4/monthly-save.jpg"},
      {type:"imp", icon:"⚠", title:"No more lost text when closing", text:"If you close the panel (×, Esc or Close) with unsaved text, the app asks: <b>OK</b> = save to the sheet, <b>Cancel</b> = discard. Pressing Save twice no longer sends the item twice.", img:"updates/v31.4/monthly-drawer.jpg"},
      {type:"imp", icon:"📄", title:"Monthly report guide (PDF) and English labels", text:"Click <b>Send report</b> ▸ <b>Monthly report</b> ▸ pick the month ▸ <b>Send officially to the team</b>. The preview and the Compare tab are now fully in English. Step-by-step guide with screenshots: <b>Guide_Monthly_report_Thailand_Surgical_v31.4_EN.pdf</b>.", img:"updates/v31.4/monthly-send.jpg"}
    ],
    guide:"docs/Guide_Monthly_report_Thailand_Surgical_v31.4_EN.pdf", guideName:"Monthly report guide (Thailand Surgical)"
  }),
  E({
    id:"2026-10-12-v31.3", version:"v31.3", date:"2026-10-12",
    title:"Trip costs in several currencies, with a separate total for each",
    summary:"In the business trip request, each expense line now has its own currency (VND, THB or USD), and the total is added up separately for each currency.",
    items:[
      {type:"new", icon:"💱", title:"Pick a currency for each expense", text:"Click <b>Business trip proposal</b> ▸ <b>Estimated costs</b>: next to each amount, choose <b>VND</b>, <b>THB</b> or <b>USD</b>. The Thailand team starts with THB, Vietnam teams with VND.", img:"updates/v31.3/trip-currency.jpg"},
      {type:"imp", icon:"Σ", title:"Separate total for each currency", text:"The total shows one figure per currency, e.g. <b>4,585 THB · 1.200.000 VND</b>, never mixed. The approval email, the Business Trip file and the Approve trips list show the same totals."}
    ]
  }),
  E({
    id:"2026-10-12-v31.2", version:"v31.2", date:"2026-10-12",
    title:"Thailand team: trip costs in Thai Baht, expense names in English",
    summary:"In the business trip request, the Thailand team now enters estimated costs in <b>THB</b>, and every expense name is in English.",
    items:[
      {type:"imp", icon:"฿", title:"Estimated costs in THB", text:"Click <b>Business trip proposal</b> ▸ <b>Estimated costs (THB)</b>: amounts are shown as <b>4,585 THB</b> and the total as <b>Total estimated: … THB</b>. The proposal email to the approver also shows the costs in THB.", img:"updates/v31.2/trip-thb.jpg"},
      {type:"imp", icon:"✎", title:"Expense names in English", text:"Type in the description box to pick from the list: Air ticket, <b>Daily allowance</b> (was Per diem), Hotel, Taxi / Grab, Train / bus ticket, Customer entertainment, Seminar fee, Other expenses."}
    ]
  }),
  E({
    id:"2026-10-11-v31.1", version:"v31.1", date:"2026-10-11",
    title:"Smoother guides, and a Help button on the phone top bar",
    summary:"Step-by-step guides no longer lag or shrink the page on phones: the screen scrolls smoothly to the right place and only the button or field being explained is enlarged. On phones, the <b>?</b> button now sits in the top bar.",
    items:[
      {type:"fix", icon:"⚡", title:"Smooth, no lag", text:"Pick any guide: the screen scrolls smoothly, the yellow frame glides to the next step and small buttons are enlarged on their own. The page no longer shrinks or shows the activity feed on phones.", img:"updates/v31.1/mobile.jpg"},
      {type:"imp", icon:"❓", title:"Help button on the phone top bar", text:"On phones, tap <b>?</b> in the top bar (next to Approve trips) to open the guides. Admins open Test mode from More ▸ Tools.", img:""}
    ]
  }),
  E({
    id:"2026-10-11-v31.0", version:"v31.0", date:"2026-10-11",
    title:"Step-by-step guides for every feature",
    summary:"Click the <b>?</b> button in the top bar and pick a feature: the app dims the screen, zooms in on the exact place to click and walks you through each step.",
    items:[
      {type:"new", icon:"❓", title:"Guides list", text:"Click <b>?</b> in the top bar (phone: More ▸ Help) to open 14 guides: calendar, logging a field visit, other tasks, trips, customers, orders, new accounts, reports, KPI, weekly meeting… A yellow dot means a guide is new or just updated.", img:"updates/v31.0/catalog.jpg"},
      {type:"new", icon:"🔍", title:"Zooms in on each step", text:"Pick a guide: the app opens the right screen, zooms in on the field to fill and explains it. Use <b>Next</b> / <b>Back</b> or the arrow keys, <b>Exit</b> at any time. The Thailand team sees every guide in English.", img:"updates/v31.0/zoom.jpg"},
      {type:"imp", icon:"🔄", title:"Always in sync with the app", text:"Whenever a feature is added or changed, its guide is updated with it and shows an <b>Updated</b> label for 14 days. The old chapter-style manual is still at the bottom of the guides list.", img:""}
    ]
  }),
  E({
    id:"2026-10-10-v30.9", version:"v30.9", date:"2026-10-10",
    title:"Each team's data now lives in its own CRM file",
    summary:"Other tasks, field visits and business trips of the Dental, Surgical and Eyeless teams are no longer stored in the Marketing file. Everything stays in your team's CRM file. Nothing changes in how you use the app.",
    items:[
      {type:"imp", icon:"🗂", title:"Other tasks saved in your team's CRM file", text:"Click <b>＋</b> ▸ <b>Other tasks</b> as usual: tasks are now saved to the new <b>ALL TASK</b> sheet of your team's CRM file instead of the Marketing file. Your existing other tasks are moved there automatically, with no duplicates.", img:""},
      {type:"imp", icon:"📍", title:"Field visits and trips are no longer copied to Marketing", text:"Field visits stay in tab <b>6. WEEKLY REPORT</b> of your CRM file, and business trips are read directly from the Business Trip file. The weekly and monthly reports still list field visits and other tasks in separate sections.", img:""}
    ]
  }),
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
