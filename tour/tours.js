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
function V(vi,en){ return { vi:vi, en:en }; }
TOUR.add([
 { id:"start", v:1, d:"2026-10-11", g:V("Bắt đầu","Getting started"), ic:"start", t:V("Làm quen MMH CRM","Tour of MMH CRM"), x:V("Các khu vực chính và chỗ tìm mọi chức năng.","The main areas and where to find every feature."),
   steps:[
    { el:"#side", do:wk("cal"), zoom:false, t:V("Menu chức năng","Feature menu"), x:V("Mọi chức năng ở cột trái: Dashboard, KPI, Khách hàng, Cập nhật, Mở mới, Đơn hàng, Họp tuần, Gửi báo cáo…","Every feature is in the left menu: Dashboard, KPI, Customers, Updates, New accounts, Orders, Weekly meeting, Send report…") },
    { el:"#mcBtn", t:V("MMH Calendar","MMH Calendar"), x:V("Lịch chung của công ty: công tác, đào tạo, sự kiện.","The company calendar: trips, trainings, events.") },
    { el:"#qsBtn", t:V("Tìm nhanh","Quick search"), x:V("Bấm hoặc nhấn <b>Ctrl + K</b> để tìm khách hàng, việc, đơn hàng.","Click or press <b>Ctrl + K</b> to find customers, tasks, orders.") },
    { el:"#fySel", t:V("Năm tài chính","Fiscal year"), x:V("Chọn FY cần xem (FY bắt đầu từ tháng 9).","Pick the fiscal year to view (FY starts in September).") },
    { el:"#updBtn", t:V("Có gì mới","What's new"), x:V("Xem các bản cập nhật của app.","See the latest app updates.") },
    { el:"#btnUser", t:V("Tài khoản","Account"), x:V("Bấm để xem tài khoản, đổi nhóm (quản lý) hoặc đăng xuất.","Click to see your account, switch team (managers) or sign out.") }
   ] },
 { id:"calendar", v:2, d:"2026-10-11", g:V("Lịch & công việc","Calendar & tasks"), ic:"cal", t:V("Lịch công việc","Work calendar"), x:V("Xem đi địa bàn, việc khác, công tác theo tuần / tháng.","Field visits, other tasks and trips by week or month."),
   steps:[
    { el:function(){ return TOUR.find("select.cal-vs") || par("[onclick=\"calView('week')\"]"); }, do:wk("cal"), t:V("Kiểu xem","View"), x:V("Đổi giữa <b>Tuần</b>, <b>Tháng</b> và <b>Danh sách</b>.","Switch between <b>Week</b>, <b>Month</b> and <b>List</b>.") },
    { el:"[onclick=\"calNav(0)\"]", t:V("Hôm nay","Today"), x:V("Dùng ‹ › để chuyển tuần, bấm <b>Hôm nay</b> để quay về tuần này.","Use ‹ › to move between weeks, <b>Today</b> to come back.") },
    { el:function(){ return par(".cal-chip[onclick=\"calToggle('v')\"]"); }, t:V("Lọc loại việc","Filter by type"), x:V("Bật / tắt Đi địa bàn, Việc khác, Công tác, Đào tạo; ẩn việc đã xong.","Show or hide Field visits, Other tasks, Trips, Trainings; hide done tasks.") },
    { el:function(){ return par(".cal-chip[onclick=\"calSetPics('all')\"]"); }, t:V("Xem của ai","Whose tasks"), x:V("Team Leader và quản lý chọn được cả đội hoặc từng người.","Team leaders and managers can view the whole team or one person.") },
    { el:".cal-add", t:V("Thêm việc vào ngày","Add a task on a day"), x:V("Bấm <b>＋ Thêm việc</b> dưới một ngày để chọn: đi địa bàn hay việc khác.","Click <b>＋ Add task</b> under a day, then choose field visit or other task.") }
   ] },
 { id:"visit", v:2, d:"2026-10-11", g:V("Lịch & công việc","Calendar & tasks"), ic:"photo", t:V("Ghi nhanh đi địa bàn","Log a field visit"), x:V("Chọn account, ghi kết quả, lưu ngay.","Pick the account, write the result, save instantly."),
   steps:[
    { el:"#fab", do:wk("cal"), t:V("Nút ＋ Ghi nhanh","Quick-add button"), x:V("Nút tròn góc phải dưới — có ở mọi màn hình.","The round button at the bottom right — on every screen.") },
    { el:"#nt_accName", do:function(){ try{ formWeekly(null); }catch(_){} }, wait:700, t:V("Chọn account","Choose the account"), x:V("Bấm để xem danh sách hoặc gõ để lọc. Type / Province tự điền.","Click to list or type to filter. Type and province fill in automatically.") },
    { el:"[onclick=\"ntNewAcc()\"]", t:V("Địa bàn mới","New account"), x:V("Khách chưa có trong danh mục thì bấm <b>＋ Địa bàn mới</b>.","Customer not in the list yet? Click <b>＋ New account</b>.") },
    { el:"#nt_typeTask", t:V("Loại việc và hành động","Task type and action"), x:V("Chọn Type task và Type action đúng với buổi gặp.","Pick the task type and action that match the visit.") },
    { el:"#nt_result", t:V("Kết quả","Result"), x:V("Ghi người gặp, việc đã làm, kết quả, bước tiếp theo.","Write who you met, what you did, the outcome and next step.") },
    { el:"[onclick=\"insertResultTpl('nt_result')\"]", t:V("Khung 4 mục","4-part template"), x:V("Bấm để chèn sẵn khung 4 mục — chỉ việc điền. Có cả nút <b>Nói</b> để đọc thay gõ.","Click to insert the 4-part template. There is also a <b>Voice</b> button.") },
    { el:"#nt_status", t:V("Trạng thái","Status"), x:V("Mới lên kế hoạch để <b>To Do</b>; đã đi xong chọn <b>Completed</b>.","Just planned: <b>To Do</b>. Visit done: <b>Completed</b>.") },
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
 { id:"approve", v:1, d:"2026-10-11", g:V("Công tác","Business trips"), ic:"trip", t:V("Duyệt đề xuất công tác","Approve trip proposals"), x:V("Dành cho Giám đốc: duyệt nhiều đề xuất cùng lúc.","For the Director: approve several proposals at once."),
   when:function(){ var u=me(); return !!u && (u.level==="director" || u.admin); },
   steps:[
    { el:"#tfa-btn", t:V("Nút Duyệt công tác","Approve trips button"), x:V("Số đỏ = đề xuất đang chờ.","The red number = proposals waiting.") },
    { el:"#tfa-ov .tfa-it", do:function(){ try{ TFA.open(); }catch(_){} }, wait:900, t:V("Từng đề xuất","Each proposal"), x:V("Bấm thẻ để chọn.","Click a card to select it.") },
    { el:"#tfa-ov .tfa-ok", t:V("Duyệt / Từ chối","Approve / Reject"), x:V("Mỗi người đề xuất nhận 1 email riêng. Từ chối phải ghi lý do.","Each proposer gets their own email. A rejection needs a reason.") }
   ] },
 { id:"cust", v:1, d:"2026-10-11", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"people", t:V("Khách hàng","Customers"), x:V("Tìm, lọc và thêm account.","Find, filter and add accounts."),
   steps:[
    { el:"#cq", do:pg("cust"), wait:600, t:V("Tìm khách hàng","Find a customer"), x:V("Gõ tên, mã, tỉnh, PIC — không cần dấu.","Type a name, code, province or PIC.") },
    { el:"#custChips", t:V("Lọc nhanh","Quick filters"), x:V("Chưa gặp trong FY, đã gặp, sắp theo doanh số.","Not visited this FY, visited, sort by sales.") },
    { el:"#custPicBar", t:V("Theo PIC","By PIC"), x:V("Xem account của từng người.","See each person's accounts.") },
    { el:"[onclick=\"formCustomer(null)\"]", t:V("Account mới","New account"), x:V("Thêm khách hàng mới vào danh mục.","Add a new customer.") }
   ] },
 { id:"order", v:1, d:"2026-10-11", g:V("Khách hàng & bán hàng","Customers & sales"), ic:"report", t:V("Đơn hàng","Sales orders"), x:V("Ghi và tra cứu đơn hàng theo tháng.","Record and look up orders by month."),
   when:function(){ try{ return !noOrder(); }catch(_){ return true; } },
   steps:[
    { el:"[onclick=\"formOrder(null)\"]", do:pg("order"), wait:600, t:V("Đơn hàng mới","New order"), x:V("Ghi đơn: account, sản phẩm, số lượng, giá.","Record account, products, quantity and price.") },
    { el:"#ord_q", t:V("Tìm đơn","Find an order"), x:V("Tìm theo account, mã, sản phẩm, NPP.","Search by account, code, product or distributor.") },
    { el:function(){ return par("[onclick^=\"S.filt.month=''\"]"); }, t:V("Theo tháng","By month"), x:V("Chọn tháng hoặc cả FY.","Pick a month or the whole FY.") }
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
 { id:"kpi", v:1, d:"2026-10-11", g:V("Báo cáo & KPI","Reports & KPI"), ic:"kpi", t:V("KPI & Mục tiêu","KPI & targets"), x:V("Xem KPI tháng / quý / năm, báo cáo KPI, Setting Expectation.","Monthly / quarterly / yearly KPI, KPI report, Setting Expectation."),
   steps:[
    { el:"#kp-m", do:pg("kpi"), wait:900, t:V("Chọn kỳ","Pick a period"), x:V("Tháng, Quý hoặc Năm FY.","Month, quarter or FY.") },
    { el:"#kp-person", t:V("Người đang xem","Person"), x:V("Màu %: xám &lt; 90% · xanh 90–100% · vàng 100–120% · xanh lá &gt; 120%.","Colours: grey &lt; 90% · blue 90–100% · yellow 100–120% · green &gt; 120%.") },
    { el:"[onclick=\"KR.open()\"]", t:V("Báo cáo KPI tháng","Monthly KPI report"), x:V("Hạn ngày 02 hằng tháng, 16:00.","Due on the 2nd of each month, 16:00.") },
    { el:"[onclick=\"SE.open()\"]", t:V("Setting Expectation","Setting Expectation"), x:V("Tự đánh giá quý, tải file Word.","Quarterly self-review, download the Word file.") }
   ] },
 { id:"meet", v:1, d:"2026-10-11", g:V("Báo cáo & KPI","Reports & KPI"), ic:"people", t:V("Họp tuần","Weekly meeting"), x:V("Biên bản họp theo 4 mục, so sánh tuần trước.","Meeting notes in 4 parts, compared with last week."),
   steps:[
    { el:"#mtTabs", do:pg("meet"), wait:800, t:V("Từng người","Each person"), x:V("Chọn từng thành viên để ghi.","Pick each team member.") },
    { el:"#mtSteps2", t:V("4 mục họp","4 parts"), x:V("Forecast NPP · Quan hệ KH &amp; thị trường · Tình hình thầu · Thông tin khác.","Distributor forecast · Customers &amp; market · Tenders · Other.") },
    { el:"[onclick=\"mtSave()\"]", t:V("Lưu biên bản","Save notes"), x:V("Lưu, xem lịch sử, gửi email tuần.","Save, see history, send the weekly email.") }
   ] },
 { id:"dash", v:1, d:"2026-10-11", g:V("Báo cáo & KPI","Reports & KPI"), ic:"kpi", t:V("Dashboard","Dashboard"), x:V("Tổng quan khách hàng, đi địa bàn, kinh doanh.","Overview of customers, field visits and sales."),
   steps:[
    { el:function(){ return par("[onclick=\"setDashR('FY')\"]"); }, do:pg("dash"), wait:700, t:V("Khoảng thời gian","Period"), x:V("Cả FY, từng quý hoặc từng tháng.","Whole FY, a quarter or a month.") },
    { el:function(){ return par("[onclick=\"setDashG('all')\"]"); }, t:V("Nhóm chỉ số","Metric groups"), x:V("Tổng quan · Khách hàng · Đi địa bàn · Kinh doanh · ADP.","Overview · Customers · Field visits · Sales · ADP.") },
    { el:"#clogCard", t:V("Cập nhật dữ liệu khách hàng","Customer data updates"), x:V("Account nào vừa được cập nhật hoặc thêm mới.","Which accounts were updated or added.") }
   ] },
 { id:"theme", v:1, d:"2026-10-11", g:V("Cá nhân hoá","Personalise"), ic:"gear", t:V("Màu giao diện","Colour theme"), x:V("Chọn tông màu bạn thích.","Pick the colour theme you like."),
   steps:[
    { el:"#thBtn", t:V("Màu giao diện","Colour theme"), x:V("10 tông màu, lưu trên máy này.","10 themes, saved on this device.") },
    { el:"#btnAct", t:V("Bảng tin hoạt động","Activity feed"), x:V("Ai vừa thêm / sửa gì trong nhóm.","Who added or changed what in your team.") }
   ] }
]);
})();
