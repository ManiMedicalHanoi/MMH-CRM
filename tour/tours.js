/* ════════════════════════════════════════════════════════════════════════════════════════
   BÀI HƯỚNG DẪN — MMH CRM (bộ máy: tour/tour.js, giống hệt MMH-Report)
   Chữ { vi, en }: nhóm Thái (I18N.on) xem tiếng Anh.
   QUY TẮC (CLAUDE.md): mỗi lần sửa / thêm chức năng người dùng nhìn thấy ⇒ sửa / thêm bài ở đây trong CÙNG PR,
   tăng `v` của bài bị đổi, đặt `d` = ngày sửa. Kiểm tra: NODE_PATH=$(npm root -g) node tools/tour_check.js
   ════════════════════════════════════════════════════════════════════════════════════════ */
(function(){
function q(s){ return document.querySelector(s); }
function par(s){ var e=q(s); return e&&e.parentElement; }
function wk(t){ return function(){ try{ go("weekly"); }catch(_){} try{ setWkTab(t||"cal"); }catch(_){} }; }
function pg(p){ return function(){ try{ go(p); }catch(_){} }; }
function me(){ try{ return window.AUTH && AUTH.user && AUTH.user(); }catch(_){ return null; } }
function th(){ try{ return curTeamKey()==="thai"; }catch(_){ return false; } }
/* điện thoại: menu bên / FY / màu / bảng tin nằm trong nút Thêm (thanh dưới); bộ lọc lịch nằm sau nút ⋯ */
function more(sel){ return function(){ return TOUR.find(sel) || TOUR.find("nav.mob button:last-of-type"); }; }
function calTools(){ try{ if(window.CAL && !CAL.mt && TOUR.find(".cal-dots3")){ CAL.mt=true; renderCal(); } }catch(_){} }
function V(vi,en){ return { vi:vi, en:en }; }
TOUR.add([
 { id:"start", v:3, d:"2026-10-16", g:V("Bắt đầu","Getting started"), ic:"start", t:V("Làm quen MMH CRM","Tour of MMH CRM"), x:V("Các khu vực chính và chỗ tìm mọi chức năng.","The main areas and where to find every feature."),
   steps:[
    { el:more("#side"), do:wk("cal"), zoom:false, t:V("Menu chức năng","Feature menu"), x:V("<i>(Điện thoại: nút <b>Thêm</b> ở thanh dưới.)</i> Menu chia 5 nhóm: <b>Tổng quan</b> · <b>Khách hàng</b> (Địa bàn, Khách hàng) · <b>Cập nhật công việc</b> (Đi địa bàn, Công việc khác, Cập nhật đơn hàng, Thuyết trình) · <b>Kết quả bán hàng</b> · <b>Công cụ & Báo cáo</b>.","<i>(Phone: the <b>More</b> button in the bottom bar.)</i> The menu has 5 groups: <b>Overview</b> · <b>Customers</b> · <b>Activities & Plans</b> · <b>Sales Result</b> · <b>Tools & Reports</b>.") },
    { el:"#mcBtn", t:V("MMH Calendar","MMH Calendar"), x:V("Lịch chung của công ty: công tác, đào tạo, sự kiện.","The company calendar: trips, trainings, events.") },
    { el:"#qsBtn", t:V("Tìm nhanh","Quick search"), x:V("Bấm hoặc nhấn <b>Ctrl + K</b> để tìm khách hàng, việc, đơn hàng.","Click or press <b>Ctrl + K</b> to find customers, tasks, orders.") },
    { el:more("#fySel"), t:V("Năm tài chính","Fiscal year"), x:V("Chọn FY cần xem (FY bắt đầu từ tháng 9).","Pick the fiscal year to view (FY starts in September).") },
    { el:"#updBtn", t:V("Có gì mới","What's new"), x:V("Xem các bản cập nhật của app.","See the latest app updates.") },
    { el:"#btnUser", t:V("Tài khoản","Account"), x:V("Bấm để xem tài khoản, đổi nhóm (quản lý) hoặc đăng xuất.","Click to see your account, switch team (managers) or sign out.") }
   ] },
 { id:"calendar", v:2, d:"2026-10-11", g:V("Lịch & công việc","Calendar & tasks"), ic:"cal", t:V("Lịch công việc","Work calendar"), x:V("Xem đi địa bàn, việc khác, công tác theo tuần / tháng.","Field visits, other tasks and trips by week or month."),
   steps:[
    { el:function(){ return TOUR.find("select.cal-vs") || par("[onclick=\"calView('week')\"]"); }, do:wk("cal"), t:V("Kiểu xem","View"), x:V("Đổi giữa <b>Tuần</b>, <b>Tháng</b> và <b>Danh sách</b>.","Switch between <b>Week</b>, <b>Month</b> and <b>List</b>.") },
    { el:"[onclick=\"calNav(0)\"]", t:V("Hôm nay","Today"), x:V("Dùng ‹ › để chuyển tuần, bấm <b>Hôm nay</b> để quay về tuần này.","Use ‹ › to move between weeks, <b>Today</b> to come back.") },
    { el:function(){ return par(".cal-chip[onclick=\"calToggle('v')\"]"); }, do:calTools, wait:200, t:V("Lọc loại việc","Filter by type"), x:V("Bật / tắt Đi địa bàn, Việc khác, Công tác, Đào tạo; ẩn việc đã xong.","Show or hide Field visits, Other tasks, Trips, Trainings; hide done tasks.") },
    { el:function(){ return par(".cal-chip[onclick=\"calSetPics('all')\"]"); }, t:V("Xem của ai","Whose tasks"), x:V("Team Leader và quản lý chọn được cả đội hoặc từng người.","Team leaders and managers can view the whole team or one person.") },
    { el:function(){ return TOUR.find(".cal-add") || TOUR.find(".cal-wc.today .cal-wh") || TOUR.find(".cal-wh"); }, t:V("Thêm việc vào ngày","Add a task on a day"), x:V("Bấm <b>＋ Thêm việc</b> dưới một ngày để chọn: đi địa bàn hay việc khác.","Click <b>＋ Add task</b> under a day, then choose field visit or other task.") }
   ] },
 { id:"visit", v:3, d:"2026-10-16", g:V("Lịch & công việc","Calendar & tasks"), ic:"photo", t:V("Ghi nhanh đi địa bàn","Log a field visit"), x:V("Chọn account, ghi kết quả, lưu ngay.","Pick the account, write the result, save instantly."),
   steps:[
    { el:"#fab", do:wk("cal"), t:V("Nút ＋ Ghi nhanh","Quick-add button"), x:V("Nút tròn góc phải dưới — có ở mọi màn hình.","The round button at the bottom right — on every screen.") },
    { el:"#nt_accName", do:function(){ try{ formWeekly(null); }catch(_){} }, wait:700, t:V("Chọn account","Choose the account"), x:V("Bấm để xem danh sách hoặc gõ để lọc. Type / Province tự điền.","Click to list or type to filter. Type and province fill in automatically.") },
    { el:"[onclick=\"ntNewAcc()\"]", t:V("Địa bàn mới","New account"), x:V("Khách chưa có trong danh mục thì bấm <b>＋ Địa bàn mới</b>.","Customer not in the list yet? Click <b>＋ New account</b>.") },
    { el:"#nt_typeTask", t:V("Loại việc và hành động","Task type and action"), x:V("Chọn Type task và Type action đúng với buổi gặp.","Pick the task type and action that match the visit.") },
    { el:"#nt_result", t:V("Kết quả","Result"), x:V("Ghi người gặp, việc đã làm, kết quả, bước tiếp theo.","Write who you met, what you did, the outcome and next step.") },
    { el:"[onclick=\"insertResultTpl('nt_result')\"]", t:V("Khung 4 mục","4-part template"), x:V("Bấm để chèn sẵn khung 4 mục — chỉ việc điền. Có cả nút <b>Nói</b> để đọc thay gõ.","Click to insert the 4-part template. There is also a <b>Voice</b> button.") },
    { el:"#nt_status", t:V("Trạng thái","Status"), x:V("Mới lên kế hoạch để <b>To Do</b>; đã đi xong chọn <b>Completed</b>.","Just planned: <b>To Do</b>. Visit done: <b>Completed</b>.") },
    { el:"#nt_next", t:V("Completed cần đủ thông tin","Completed needs full details"), x:V("Lượt <b>Visiting</b> chỉ chuyển <b>Completed</b> khi đã có Kết quả, Customer feedback và Next action (follow up). Chỉ lượt Completed có ảnh mới tính KPI viếng thăm.","A <b>Visiting</b> row can be <b>Completed</b> only with the result, customer feedback and next action (follow-up). Only Completed visits with a photo count for the visit KPI.") },
    { el:"#nt_phSect", when:function(){ try{ return !noPhoto(); }catch(_){ return true; } }, t:V("Ảnh đi địa bàn","Field photo"), x:V("Chụp ảnh tại chỗ. Ảnh gửi ở nền sau khi chữ đã lưu — mất sóng cũng không mất, có mạng tự gửi.","Take a photo on site. It uploads in the background after the text is saved, even with weak signal.") },
    { el:"[onclick=\"submitNewTask()\"]", t:V("Lưu","Save"), x:V("Bấm lưu: khung đóng ngay, dữ liệu ghi vào Google Sheet ở nền.","Click save: the form closes at once and the data is written to Google Sheet in the background.") }
   ] },
 { id:"other", v:1, d:"2026-10-11", g:V("Lịch & công việc","Calendar & tasks"), ic:"task", t:V("Công việc khác","Other tasks"), x:V("Việc chung không phải đi địa bàn: họp, thầu, sự kiện…","Tasks that are not field visits: meetings, tenders, events…"),
   steps:[
    { el:"[onclick=\"setWkTab('other')\"]", do:wk("other"), t:V("Tab Công việc khác","Other tasks tab"), x:V("Lưu ở sheet <b>ALL TASK</b> trong file CRM của nhóm.","Saved in the <b>ALL TASK</b> sheet of your team's CRM file.") },
    { el:function(){ return par("[onclick=\"vSetMode('week')\"]"); }, t:V("Khoảng thời gian","Period"), x:V("Xem theo Ngày, Tuần, Tháng, Quý, cả FY hoặc khoảng ngày.","View by day, week, month, quarter, FY or a date range.") },
    { el:"#ot_q", t:V("Tìm và lọc","Search and filter"), x:V("Tìm trong key task, đầu việc, kết quả; lọc theo tiến độ.","Search key tasks, sub-tasks and results; filter by progress.") },
    { el:"[onclick=\"formOtherKey('')\"]", t:V("Thêm Key Task","Add a key task"), x:V("Tạo đầu việc chính, sau đó thêm sub-task bên trong.","Create the main task, then add sub-tasks inside it.") }
   ] },
 { id:"trip", v:1, d:"2026-10-11", g:V("Công tác","Business trips"), ic:"trip", t:V("Đề xuất công tác","Propose a business trip"), x:V("Điền đề xuất, email xin duyệt gửi Giám đốc.","Fill in the proposal; the approval email goes to the Director."),
   when:function(){ try{ return !noTrip(); }catch(_){ return true; } },
   steps:[
    { el:"[onclick=\"tripProposeOpen()\"]", do:wk("cal"), t:V("Nút Đề xuất công tác","Trip proposal button"), x:V("Ở Lịch công việc, bấm <b>Đề xuất công tác</b>.","In the calendar, click <b>Propose a trip</b>.") },
    { el:"#tp-start", do:function(){ try{ tripProposeOpen(); }catch(_){} }, wait:800, t:V("Ngày đi và về","Dates"), x:V("Số ngày tự tính.","The number of days is calculated for you.") },
    { el:"#ms-dest", t:V("Điểm đến và người đi cùng","Destination and co-travelers"), x:V("Gõ để tìm, chọn được nhiều.","Type to search; you can pick several.") },
    { el:"#tp-purpose", t:V("Mục đích","Purpose"), x:V("Đi để làm gì, mong đạt được gì.","Why you go and what you expect.") },
    { el:"#tp-costs", t:V("Chi phí dự kiến","Estimated costs"), x:V("Mỗi khoản 1 dòng, tổng tự cộng.","One line per cost; the total adds up.") },
    { el:"#tp-sched", t:V("Lịch trình","Schedule"), x:V("Ghi theo ngày.","Write it day by day.") },
    { el:"#tp-send", t:V("Gửi đề xuất","Send"), x:V("Email <b>Business Trip Approval Request</b> gửi Giám đốc, CC trưởng phòng và bạn. Ghi nhật ký ở tab Business Trip Log của file CRM nhóm.","A <b>Business Trip Approval Request</b> email goes to the Director, CC your head of department and you.") }
   ] },
 { id:"cust", v:2, d:"2026-10-16", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"people", t:V("Địa bàn","Customer List"), x:V("Tìm, lọc và thêm account.","Find, filter and add accounts."),
   steps:[
    { el:"#cq", do:pg("cust"), wait:600, t:V("Tìm địa bàn","Find an account"), x:V("Gõ tên, mã, tỉnh, PIC — không cần dấu.","Type a name, code, province or PIC.") },
    { el:"#custChips", t:V("Lọc nhanh","Quick filters"), x:V("Chưa gặp trong FY, đã gặp, sắp theo doanh số.","Not visited this FY, visited, sort by sales.") },
    { el:"#custPicBar", t:V("Theo PIC","By PIC"), x:V("Xem account của từng người.","See each person's accounts.") },
    { el:"[onclick=\"formCustomer(null)\"]", t:V("Account mới","New account"), x:V("Thêm khách hàng mới vào danh mục.","Add a new customer.") },
    { el:function(){ return TOUR.find("#a3-adp")||TOUR.find("#a3Side")||TOUR.find("#drwBody"); }, do:function(){ try{ var c=(S.custIndex||[])[0]; if(c) openCust(c.code); }catch(_){} }, wait:1200, when:function(){ try{ return !isTH() && (S.custIndex||[]).length>0; }catch(_){ return false; } },
      t:V("Chi tiết địa bàn","Account details"), x:V("Bấm 1 địa bàn ⇒ bên phải hiện ngay <b>Mục tiêu & tình trạng ADP</b> (nhóm A–D, target / actual, mục tiêu, hành động chính, tình trạng quý gần nhất), rồi tổng quan, người liên hệ, thông tin account.","Click an account ⇒ the right column shows <b>ADP targets & status</b> first, then overview, contacts and account info.") }
   ] },
 { id:"order", v:7, d:"2026-10-16", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"report", t:V("Đơn hàng","Sales orders"), x:V("Ghi và tra cứu đơn hàng theo tháng.","Record and look up orders by month."),
   when:function(){ try{ return !noOrder(); }catch(_){ return true; } },
   steps:[
    { el:"#ord_q", do:pg("order"), wait:600, when:function(){ try{ return !!(window.v320ApOnly && v320ApOnly()); }catch(_){ return false; } }, t:V("Đơn hàng của sales","Sales orders"), x:V("Người duyệt không tạo đơn — sales tạo đơn rồi gửi xác nhận cho bạn.","Approvers do not create orders — sales create them and send them to you.") },
    { el:"[onclick=\"formOrder(null)\"]", do:pg("order"), wait:600, when:function(){ try{ return !(window.v320ApOnly && v320ApOnly()); }catch(_){ return true; } }, t:V("Đơn hàng mới","New order"), x:V("Ghi đơn: account, sản phẩm, số lượng, giá.","Record account, products, quantity and price.") },
    { el:"#ord_q", t:V("Tìm đơn","Find an order"), x:V("Tìm theo account, mã, sản phẩm, NPP.","Search by account, code, product or distributor.") },
    { el:"#v322-mon", t:V("Theo tháng","By month"), x:V("Chọn tháng hoặc cả FY.","Pick a month or the whole FY.") },
    { el:"#v322-kp", do:function(){ try{ go("orderres"); }catch(_){} }, wait:700, t:V("Kết quả bán hàng ▸ Đơn hàng","Sales Result ▸ Orders"), x:V("Số đơn, số khách (không trùng), số tiền tháng và lũy kế FY (không tính đơn bị từ chối).","Orders, unique customers, amount this month and FY to date (rejected orders excluded).") },
    { el:"#v322-pg", t:V("Nhóm sản phẩm","Product groups"), x:V("Giá trị đơn theo nhóm sản phẩm.","Order value by product group.") },
    { el:"#v323-mt", t:V("Theo tháng","By month"), x:V("Số đơn, số khách, giá trị, đã duyệt và lũy kế từng tháng.","Orders, customers, amount, approved and cumulative per month.") },
    { el:function(){ return TOUR.find("#v322-tr"); }, do:function(){ try{ go("order"); }catch(_){} }, wait:700, when:function(){ return !!document.querySelector("#v322-tr"); }, t:V("Danh sách theo tháng","List by month"), x:V("Như Tiến độ công việc: tháng ▸ đơn ▸ dòng sản phẩm. Bấm mũi tên để mở dòng sản phẩm, chấm màu = trạng thái duyệt, dải ngày đánh dấu ngày đặt.","Like the task timeline: month ▸ order ▸ product lines. Click the arrow to open the lines; the dot colour shows approval, the day strip marks the order day.") },
    { el:function(){ return TOUR.find("#o_partnerSel") || TOUR.find("#o_partner"); }, do:function(){ try{ formOrder(null); }catch(_){} }, wait:500, when:function(){ try{ return curTeamKey()==="dental"; }catch(_){ return false; } },
      t:V("Nhà phân phối tự điền","Distributor filled in"), x:V("Theo PIC: Viet → Nam Dũng · Vinh → S.P.I · Phuong chọn Meci hoặc Việt Thái.","By PIC: Viet → Nam Dung · Vinh → S.P.I · Phuong picks Meci or Viet Thai.") },
    { el:"#v322-care", do:function(){ try{ if(!document.querySelector("#o_accName")) formOrder(null); }catch(_){} }, wait:500, when:function(){ try{ return !(window.v320ApOnly && v320ApOnly()); }catch(_){ return true; } },
      t:V("Lịch sử chăm sóc","Customer care history"), x:V("Đơn mới chỉ tạo được khi khách đã có hoạt động chăm sóc <b>Completed</b> (Visiting, Telephone, Message…) trong 30 ngày trước ngày đặt. Chưa có ⇒ bấm <b>Ghi hoạt động chăm sóc</b>. Lưu đơn mới ⇒ email thông báo tới Giám đốc.","A new order needs a <b>Completed</b> care activity (Visiting, Telephone, Message…) in the 30 days before the order date. None yet ⇒ click <b>Log a care activity</b>. A new order e-mails the Director.") },
    { el:function(){ return TOUR.find(".v321-ban"); }, do:function(){ try{ closeModal(); }catch(_){} }, wait:300, when:function(){ return !!document.querySelector(".v321-ban"); }, t:V("Thông báo đơn hàng","Order notices"),
      x:V("Số đơn chờ bạn xác nhận, đơn cần chỉnh sửa, đơn thiếu chứng từ hoặc chưa gửi. Số đỏ cạnh menu <b>Đơn hàng</b> cũng báo như vậy.","Orders waiting for your approval, returned, missing documents or not sent yet. The red number next to <b>Orders</b> in the menu shows the same.") },
    { el:function(){ return TOUR.find(".v320-acts"); }, do:function(){ try{ closeModal(); }catch(_){} }, wait:300, when:function(){ return !!document.querySelector(".v320-acts"); }, t:V("Gửi xác nhận · Xác nhận","Send for approval · Approve"),
      x:V("Đơn Chờ duyệt: sales bấm <b>Gửi xác nhận</b> ⇒ email tới chị Tuyên kèm chứng từ. Người duyệt bấm <b>Xác nhận</b>, <b>Yêu cầu chỉnh sửa</b> (khi thiếu chứng từ) hoặc <b>Không xác nhận</b> ngay trên thẻ đơn.","Pending orders: sales click <b>Send for approval</b> ⇒ the approver gets an e-mail with the documents. The approver clicks <b>Approve</b> / <b>Reject</b> right on the order card.") },
    { el:"#oa-btn", do:function(){ try{ closeModal(); }catch(_){} try{ if(S.ordMode==="res"||S.tab!=="order") go("order"); }catch(_){} }, wait:600, when:function(){ try{ return !!(window.v316OrdIsAp && v316OrdIsAp()); }catch(_){ return false; } }, t:V("Duyệt đơn hàng","Approve orders"),
      x:V("Đơn từ 10/2026 cần Order Type + chứng từ và được duyệt mới tính KPI C5. Duyệt từng đơn hoặc cả tháng của một sales.","Orders from 10/2026 need an order type + documents and approval before they count for C5. Approve one by one or a whole month per sales PIC.") }
   ] },
 { id:"pres", v:1, d:"2026-10-16", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"people", t:V("Thuyết trình sản phẩm","Product presentations"), x:V("Ghi buổi giới thiệu sản phẩm và báo cáo đủ 5 mục để được tính KPI.","Log product presentations and complete the 5-section report so they count for KPI."),
   steps:[
    { el:"#v322-pk", do:function(){ try{ go("present"); S.presTab="pres"; renderPresent(); }catch(_){} }, wait:700, t:V("Buổi tính KPI","Sessions counted"), x:V("Chỉ buổi có Actual participant > 0 và đủ 5 mục báo cáo mới được tính KPI. Ô cuối: số buổi đã diễn ra còn thiếu báo cáo.","Only sessions with Actual participant > 0 and all 5 report sections count. Last tile: past sessions still missing a report.") },
    { el:function(){ return TOUR.find(".v322-rem"); }, when:function(){ return !!document.querySelector(".v322-rem"); }, t:V("Nhắc hoàn thành báo cáo","Report reminder"), x:V("Buổi chưa đủ báo cáo hiện ở đây — bấm <b>Hoàn thành báo cáo</b> để điền.","Sessions with an incomplete report show here — click <b>Complete the report</b>.") },
    { el:"#v322-ps", do:function(){ try{ formPresent(null); }catch(_){} }, wait:600, t:V("5 khung báo cáo","5 report sections"), x:V("Điền từng khung: số người tham dự (tự lấy), tóm tắt hoạt động, phản hồi khách hàng, doanh số, hành động tiếp theo.","Fill each section: attendees (automatic), activity summary, customer feedback, sales, next actions.") },
    { el:"#v322-meter", t:V("Độ chi tiết","Detail meter"), x:V("Mục quá ngắn hiện <b>Ghi chi tiết hơn</b> — ghi cụ thể ai, sản phẩm gì, số lượng, khi nào.","Sections that are too short show <b>Add more detail</b> — say who, which product, how many, when.") }
   ] },
 { id:"te", v:1, d:"2026-10-13", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"people", t:V("Đào tạo khách hàng (T&E)","Customer training (T&E)"), x:V("Ghi buổi đào tạo khách hàng — lưu Training Master, tính KPI C10.","Log customer training sessions — saved to the Training Master, counted for C10."),
   when:function(){ try{ return !!(window.v316TeOn && v316TeOn()); }catch(_){ return false; } },
   steps:[
    { el:"#te-tab", do:function(){ try{ go("present"); S.presTab="te"; renderPresent(); }catch(_){} }, wait:700, t:V("Tab Đào tạo khách hàng","Customer training tab"), x:V("Trong trang Thuyết trình · Đào tạo KH.","Inside the Presentation · Customer training page.") },
    { el:"#te-add", t:V("Thêm buổi đào tạo","New session"), x:V("Ngày, chủ đề, sản phẩm, khách tham dự (chọn từ danh mục khách hàng). Hoàn thành cần Actual > 0 và review đủ 5 dòng mẫu.","Date, topic, product and attendees (picked from the customer list). Completed needs Actual > 0 and the 5-line review.") }
   ] },
 { id:"newacc", v:1, d:"2026-10-11", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"kpi", t:V("Mở mới & SKU mới","New accounts & SKUs"), x:V("Ghi case mở mới để tính KPI, quản lý duyệt.","Log new-account cases for KPI; managers approve."),
   steps:[
    { el:"[onclick=\"naForm(null)\"]", do:pg("newacc"), wait:700, t:V("Thêm case","Add a case"), x:V("Ghi khách mới / SKU mới kèm chứng từ. App tự đối chiếu 4 điều kiện.","Log the new customer or SKU with evidence. The app checks the 4 conditions.") },
    { el:"[onclick=\"naRules()\"]", t:V("Quy định KPI","KPI rules"), x:V("Xem cách tính KPI mở mới.","See how the new-account KPI is calculated.") }
   ] },
 { id:"report", v:1, d:"2026-10-11", g:V("Báo cáo & KPI","Reports & KPI"), ic:"mail", t:V("Gửi báo cáo","Send a report"), x:V("Báo cáo tuần / tháng / KPI bằng email kèm PDF.","Weekly, monthly or KPI report by email with PDF."),
   steps:[
    { el:function(){ return par("[onclick^=\"S.rpKind='week'\"]"); }, do:pg("report"), wait:600, t:V("Loại báo cáo","Report type"), x:V("Chọn báo cáo tuần, tháng hoặc KPI. Báo cáo tách riêng phần đi địa bàn và công việc khác.","Pick weekly, monthly or KPI. Field visits and other tasks are listed separately.") },
    { el:"[onclick=\"sendReport('self')\"]", t:V("Gửi thử cho tôi","Send me a test"), x:V("Gửi bản thử về email của bạn để xem trước.","Send a test copy to yourself first.") },
    { el:"[onclick=\"sendReport('team')\"]", t:V("Gửi chính thức","Send officially"), x:V("Gửi tới team và quản lý theo danh sách cố định.","Send to your team and managers.") },
    { el:"[onclick=\"sendReport('download')\"]", t:V("Tải PDF","Download PDF"), x:V("Tải file PDF về máy.","Download the PDF.") }
   ] },
 { id:"kpi", v:2, d:"2026-10-16", g:V("Báo cáo & KPI","Reports & KPI"), ic:"kpi", t:V("KPI & Mục tiêu","KPI & targets"), x:V("Số liệu KPI theo từng PIC.","KPI figures per PIC."),
   steps:[
    { el:"#k3-mon", do:pg("kpi"), wait:900, t:V("Chọn kỳ","Pick a period"), x:V("Tháng, Quý hoặc Lũy kế FY + tháng.","Month, quarter or FY to date + month.") },
    { el:function(){ return TOUR.find(".k3-pic")||TOUR.find("#k3 .card"); }, t:V("KPI theo PIC","KPI per PIC"), x:V("Mỗi PIC 1 bảng: trọng số, target, actual, %. Màu %: xám &lt; 90% · xanh 90–100% · vàng 100–120% · xanh lá &gt; 120%.","One table per PIC: weight, target, actual, %. Colours: grey &lt; 90% · blue 90–100% · yellow 100–120% · green &gt; 120%.") },
    { el:"[onclick=\"KR.open()\"]", t:V("Báo cáo KPI tháng","Monthly KPI report"), x:V("Hạn ngày 02 hằng tháng, 16:00.","Due on the 2nd of each month, 16:00.") },
    { el:"[onclick=\"SE.open()\"]", t:V("Setting Expectation","Setting Expectation"), x:V("Tự đánh giá quý, tải file Word.","Quarterly self-review, download the Word file.") }
   ] },
 { id:"meet", v:1, d:"2026-10-11", g:V("Báo cáo & KPI","Reports & KPI"), ic:"people", t:V("Họp tuần","Weekly meeting"), x:V("Biên bản họp theo 4 mục, so sánh tuần trước.","Meeting notes in 4 parts, compared with last week."),
   steps:[
    { el:"#mtTabs", do:pg("meet"), wait:800, t:V("Từng người","Each person"), x:V("Chọn từng thành viên để ghi.","Pick each team member.") },
    { el:"#mtSteps2", t:V("4 mục họp","4 parts"), x:V("Forecast NPP · Quan hệ KH &amp; thị trường · Tình hình thầu · Thông tin khác.","Distributor forecast · Customers &amp; market · Tenders · Other.") },
    { el:"[onclick=\"mtSave()\"]", t:V("Lưu biên bản","Save notes"), x:V("Lưu, xem lịch sử, gửi email tuần.","Save, see history, send the weekly email.") }
   ] },
 { id:"dash", v:3, d:"2026-10-16", g:V("Báo cáo & KPI","Reports & KPI"), ic:"kpi", t:V("Dashboard","Dashboard"), x:V("Doanh số và khách hàng — gọn trên 1 trang.","Sales and customers on one page."),
   steps:[
    { el:"#d3-mon", do:pg("dash"), wait:700, t:V("Chọn tháng","Pick a month"), x:V("Chọn tháng (quản lý chọn thêm PIC) — mọi số bên dưới đổi theo.","Pick a month (managers can also pick a PIC) — every figure below follows.") },
    { el:"#d3-tot", t:V("Tổng","Totals"), x:V("Khách hàng · Người liên hệ (CBC) · Lượt viếng thăm (Completed, có ảnh) · Đơn hàng · Giá trị đơn.","Customers · Contacts · Visits (Completed, with photo) · Orders · Order value.") },
    { el:"#d3-sales", t:V("Doanh số","Sales"), x:V("Bên trái: tháng đang chọn · bên phải: lũy kế FY. Thực tế / mục tiêu và % theo màu của file KPI.","Left: the selected month · right: FY to date. Actual / target and % in the KPI file colours.") },
    { el:"#d3-cust", t:V("Khách hàng","Customers"), x:V("Mở mới, độ phủ, account chưa chăm sóc quá 30 ngày, khách có đơn — kèm danh sách khách giá trị cao và khách cần chăm sóc lại.","New accounts, coverage, accounts without care for 30+ days, customers ordering — plus top customers and who to visit next.") }
   ] },
 { id:"testmode", v:2, d:"2026-10-13", g:V("Quản trị","Admin"), ic:"gear", t:V("TEST","TEST"), x:V("Admin dùng thử mọi chức năng với vai bất kỳ trên dữ liệu TEST riêng.","The Admin tries every function in any role on separate TEST data."),
   when:function(){ try{ return !!window.SBX && (SBX.on || (function(){ var o=JSON.parse(localStorage.getItem("mmh_tk")||"null"); return !!(o&&o.user&&o.user.admin); })()); }catch(_){ return false; } },
   steps:[
    { el:function(){ return TOUR.find("#sbx-chip") || TOUR.find("#tmBtn") || TOUR.find("nav.mob button:last-of-type"); }, t:V("Nút TEST","TEST button"), x:V("<i>(Điện thoại: <b>Thêm ▸ Tiện ích ▸ TEST</b>.)</i>","<i>(Phone: <b>More ▸ Tools ▸ TEST</b>.)</i>") },
    { el:".sbx-teams", do:function(){ try{ SBX.pick(); }catch(_){} }, wait:500, t:V("Chọn nhóm","Pick the team"), x:V("Dental · Surgical · Eyeless.","Dental · Surgical · Eyeless.") },
    { el:".sbx-people", t:V("Chọn người","Pick the person"), x:V("Bấm tên để dùng app như người đó: sales, trưởng nhóm, HOD, Giám đốc.","Click a name to use the app as that person: sales, team leader, HOD, Director.") }
   ] },
 { id:"theme", v:2, d:"2026-10-11", g:V("Cá nhân hoá","Personalise"), ic:"gear", t:V("Màu giao diện","Colour theme"), x:V("Chọn tông màu bạn thích.","Pick the colour theme you like."),
   steps:[
    { el:more("#thBtn"), t:V("Màu giao diện","Colour theme"), x:V("10 tông màu, lưu trên máy này.","10 themes, saved on this device.") },
    { el:more("#btnAct"), t:V("Bảng tin hoạt động","Activity feed"), x:V("Ai vừa thêm / sửa gì trong nhóm.","Who added or changed what in your team.") }
   ] }
]);
})();
