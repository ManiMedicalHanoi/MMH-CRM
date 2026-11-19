/* MMH CRM · Trợ lý quản lý — PHẠM VI XEM (dùng chung: manager/app.js + nút mở trong CRM, khối v376-js)
   Giám đốc · Admin = mọi nhóm · Tuyen / Hoa = 3 nhóm Việt Nam · HOD khác = 3 nhóm Việt Nam ·
   trưởng nhóm theo bảng LEAD · người khác ⇒ null (không mở được trang). */
(function(){
  var ALL = ["dental","surgical","eyeless","thai","thaid"], VN = ["dental","surgical","eyeless"];
  var LEAD = { "tuyen":VN, "hoa":VN, "viet":["dental"], "dao":["thai"], "owen":["thaid"] };
  window.MGR_SCOPE = function(u){
    if(!u || !u.pic) return null;
    var lv = String(u.level||"").toLowerCase(), p = String(u.pic).trim().toLowerCase();
    if(u.admin || lv === "director") return ALL.slice();
    if(LEAD[p]) return LEAD[p].slice();
    if(lv === "hod") return VN.slice();
    return null;
  };
})();
