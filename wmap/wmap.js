/* ═════════ MMH CRM · WORKING MAP v1.0 (CRM v36.4 · 11/11/2026, người dùng yêu cầu) ═════════
   Màn hình "Working Map" = LỊCH làm việc (trên, gọn) + BẢN ĐỒ hoạt động địa bàn (dưới) + bảng chi tiết (phải / trượt lên trên điện thoại).
   Kế thừa giao diện bản đồ của Tender Map (SVG tự vẽ, không thư viện ngoài, chạy cả khi file://) cho Việt Nam (34 tỉnh) và Thái Lan (77 tỉnh).
   · Mở tự động sau khi đăng nhập (1 lần / lượt mở app); nút "CRM" quay về giao diện nhập liệu như cũ, nút "Working Map" trên thanh trên cùng mở lại.
   · Phạm vi xem (SCOPE): Nguyen Ha = Việt Nam (mặc định) | Thái Lan, mọi nhóm · Tuyen / Hoa = mọi nhóm Việt Nam · Giang = Surgical VN · Viet = Dental VN ·
     Dao = Surgical Thái Lan · còn lại (kể cả nhóm Dental Thái Lan) = chỉ việc của chính mình. Quản lý: mặc định xem theo phòng ban (cả nhóm), chọn được từng người.
   · Dữ liệu: chỉ ĐỌC backend CRM của từng nhóm (visitFeed · customerIndex · tfTrips), Surgical VN thêm fuVisits (vị trí đã ghim / GPS ảnh) + fuList (theo dõi thầu),
     Thailand Dental thêm acctList (toạ độ ACCOUNT TRACKING) + fuList / fuSave (TH_FollowUp.gs — follow-up thầu / mua sắm).
   · Tìm kiếm: khách CRM của nhóm + danh mục cơ sở y tế (VN: geo/wm-vn-csyt.js — bệnh viện, TTYT… kể cả chưa có trong CRM; TH: geo/wm-th-csyt.js — OpenStreetMap).
   · Thao tác nhanh dùng ĐÚNG form cũ của CRM: Thêm kế hoạch (formWeekly) · Thêm địa bàn mới (openNewAccount) · Đề xuất công tác (tripProposeOpen) · Mở hồ sơ (openAcc).
   API test: WM.open() · WM.close() · WM.state() · WM.data() · WM.scope() · WM.pick(kind, key) · WM.search(q) */
(function(){
"use strict";
var VER = "1.0";
var CFG = {
  /* ai xem được gì — c: quốc gia, t: nhóm ("*" = mọi nhóm của quốc gia đó) */
  SCOPE: {
    "Nguyen Ha": { c:["vn","th"], t:"*" },
    "Tuyen":     { c:["vn"], t:"*" },
    "Hoa":       { c:["vn"], t:"*" },
    "Giang":     { c:["vn"], t:["surgical"] },
    "Viet":      { c:["vn"], t:["dental"] },
    "Dao":       { c:["th"], t:["thai"] }
  },
  COUNTRY_TEAMS: { vn:["dental","surgical","eyeless"], th:["thai","thaid"] },
  TTL: 5*60000, HIST_MONTHS: 5,
  TENDER_MAP: "https://manimedicalhanoi.github.io/Tender-Result/map/"
};
/* 34 tỉnh / thành mới (01/07/2025) ⇐ tỉnh cũ — như Tender Map (tools/csyt_build.py) */
var VN_NEW = [["Hà Nội",["Hà Nội"]],["Bắc Ninh",["Bắc Ninh","Bắc Giang"]],["Quảng Ninh",["Quảng Ninh"]],["Hải Phòng",["Hải Phòng","Hải Dương"]],
  ["Hưng Yên",["Hưng Yên","Thái Bình"]],["Ninh Bình",["Ninh Bình","Nam Định","Hà Nam"]],["Cao Bằng",["Cao Bằng"]],["Tuyên Quang",["Tuyên Quang","Hà Giang"]],
  ["Lào Cai",["Lào Cai","Yên Bái"]],["Thái Nguyên",["Thái Nguyên","Bắc Kạn"]],["Lạng Sơn",["Lạng Sơn"]],["Phú Thọ",["Phú Thọ","Vĩnh Phúc","Hòa Bình"]],
  ["Điện Biên",["Điện Biên"]],["Lai Châu",["Lai Châu"]],["Sơn La",["Sơn La"]],["Thanh Hóa",["Thanh Hóa"]],["Nghệ An",["Nghệ An"]],["Hà Tĩnh",["Hà Tĩnh"]],
  ["Quảng Trị",["Quảng Trị","Quảng Bình"]],["Huế",["Thừa Thiên Huế","Thừa Thiên - Huế","TT Huế"]],["Đà Nẵng",["Đà Nẵng","Quảng Nam"]],["Quảng Ngãi",["Quảng Ngãi","Kon Tum"]],
  ["Khánh Hòa",["Khánh Hòa","Ninh Thuận"]],["Gia Lai",["Gia Lai","Bình Định"]],["Đắk Lắk",["Đắk Lắk","Phú Yên"]],["Lâm Đồng",["Lâm Đồng","Đắk Nông","Bình Thuận"]],
  ["Tây Ninh",["Tây Ninh","Long An"]],["Đồng Nai",["Đồng Nai","Bình Phước"]],["Hồ Chí Minh",["Hồ Chí Minh","TP HCM","HCM","Sài Gòn","Bình Dương","Bà Rịa - Vũng Tàu","Vũng Tàu"]],
  ["Vĩnh Long",["Vĩnh Long","Bến Tre","Trà Vinh"]],["Đồng Tháp",["Đồng Tháp","Tiền Giang"]],["An Giang",["An Giang","Kiên Giang"]],
  ["Cần Thơ",["Cần Thơ","Hậu Giang","Sóc Trăng"]],["Cà Mau",["Cà Mau","Bạc Liêu"]]];
var TH_ALIAS = { bkk:"Bangkok", krungthep:"Bangkok", bangkokmetropolis:"Bangkok", korat:"Nakhon Ratchasima", ayutthaya:"Phra Nakhon Si Ayutthaya",
  nakhonsiayutthaya:"Phra Nakhon Si Ayutthaya", chiangmai:"Chiang Mai", cnx:"Chiang Mai", hatyai:"Songkhla", pattaya:"Chon Buri", chonburi:"Chon Buri",
  phuket:"Phuket", khonkaen:"Khon Kaen", udon:"Udon Thani", ubon:"Ubon Ratchathani", nonthaburi:"Nonthaburi", pathumthani:"Pathum Thani",
  samutprakan:"Samut Prakan", samutprakarn:"Samut Prakan", lopburi:"Lop Buri", prachuap:"Prachuap Khiri Khan", huahin:"Prachuap Khiri Khan",
  nakhonpathom:"Nakhon Pathom", suratthani:"Surat Thani", nakhonsithammarat:"Nakhon Si Thammarat", buriram:"Buri Ram", sisaket:"Si Sa Ket",
  chachoengsao:"Chachoengsao", rayong:"Rayong", phitsanulok:"Phitsanulok", chiangrai:"Chiang Rai" };
var PAL = ["#3A5CAA","#2E8B7A","#C0782D","#8A56AC","#B8485A","#4E7D2F","#2C7FB8","#9C6B30","#5A6B7D","#A0457E"];
var KIND = {
  visit: { vi:"Đi địa bàn", en:"Visit" }, call: { vi:"Gọi điện", en:"Call" }, msg: { vi:"Nhắn tin / email", en:"Message" },
  event: { vi:"Thuyết trình / sự kiện", en:"Presentation / event" }, trip: { vi:"Công tác", en:"Business trip" }, other: { vi:"Việc khác", en:"Other" }
};
var ICO = {
  visit:'<path d="M8 14.2s4.6-4.1 4.6-7.6a4.6 4.6 0 1 0-9.2 0c0 3.5 4.6 7.6 4.6 7.6z"/><circle cx="8" cy="6.6" r="1.6"/>',
  call:'<path d="M5.2 2.6l1.6 3-1.3 1.2a8 8 0 0 0 3.7 3.7l1.2-1.3 3 1.6-.6 2.4c-5.6.2-10.4-4.6-10.2-10.2z"/>',
  msg:'<path d="M2.6 3.4h10.8v7.2H6.2L3.4 13V10.6h-.8z"/>',
  event:'<path d="M2.4 3h11.2v6.8H2.4zM8 9.8v2.4M5.6 13.4L8 12.2l2.4 1.2"/>',
  trip:'<path d="M14 2L7.6 8.4M14 2l-4 12-2.4-5.6L2 6z"/>',
  other:'<circle cx="8" cy="8" r="2.4"/>',
  back:'<path d="M9.8 3.4L5.2 8l4.6 4.6"/>', map:'<path d="M2 4l4-1.6 4 1.6 4-1.6v9.6L10 13.6 6 12l-4 1.6z"/><path d="M6 2.4V12M10 4v9.6"/>',
  search:'<circle cx="7" cy="7" r="4.4"/><path d="M10.4 10.4L14 14"/>', plus:'<path d="M8 3v10M3 8h10"/>', x:'<path d="M4 4l8 8M12 4l-8 8"/>',
  prev:'<path d="M9.8 3.4L5.2 8l4.6 4.6"/>', next:'<path d="M6.2 3.4L10.8 8l-4.6 4.6"/>', home:'<path d="M2.6 7.6L8 3l5.4 4.6M4.2 6.4V13h7.6V6.4"/>',
  zin:'<path d="M8 3.6v8.8M3.6 8h8.8"/>', zout:'<path d="M3.6 8h8.8"/>', open:'<path d="M9 3h4v4M13 3L7.6 8.4M11.6 9.4V13H3V4.4h3.6"/>',
  flag:'<path d="M3.6 14V2.6M3.6 3h8.2l-1.8 2.8 1.8 2.8H3.6"/>', reload:'<path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9"/><path d="M13.6 2.4v3.3h-3.3"/>'
};
function svg(k, cls){ return '<svg class="wm-i'+(cls?" "+cls:"")+'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICO[k]||ICO.other)+'</svg>'; }

/* ───────── tiện ích ───────── */
function EN(){ try{ return !!(window.I18N && I18N.on); }catch(_){ return false; } }
function L(vi, en){ return EN() ? en : vi; }
function E(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function nk(s){ return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().replace(/[^a-z0-9]+/g,""); }
function nw(s){ return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function $i(id){ return document.getElementById(id); }
function me(){ try{ return String((window.S && S.user && S.user.pic) || ""); }catch(_){ return ""; } }
function au(){ try{ return window.AUTH && AUTH.user && AUTH.user(); }catch(_){ return null; } }
function pad(n){ return ("0"+n).slice(-2); }
function iso(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function today(){ return iso(new Date()); }
function dOf(s){ var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||""); return m ? new Date(+m[1], +m[2]-1, +m[3]) : null; }
function addD(s, n){ var d=dOf(s); d.setDate(d.getDate()+n); return iso(d); }
function ym(s){ return String(s||"").slice(0,7); }
function ymAdd(m, n){ var y=+m.slice(0,4), mo=+m.slice(5,7)-1+n; var d=new Date(y, mo, 1); return d.getFullYear()+"-"+pad(d.getMonth()+1); }
function mEnd(m){ var d=new Date(+m.slice(0,4), +m.slice(5,7), 0); return iso(d); }
function monday(s){ var d=dOf(s), w=(d.getDay()+6)%7; d.setDate(d.getDate()-w); return iso(d); }
/* ngày từ backend: "yyyy-MM-dd" · "dd/MM/yyyy" · ISO có giờ (Thái) ⇒ "yyyy-MM-dd" giờ máy */
function toIso(v){
  if(v==null || v==="") return "";
  var s=String(v).trim(), m;
  if((m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s))) return s;
  if((m=/^(\d{4})-(\d{2})-(\d{2})[T ]/.exec(s))){ if(/T.*(Z|[+-]\d{2}:?\d{2})$/.test(s)){ var d=new Date(s); if(!isNaN(d)) return iso(d); } return m[1]+"-"+m[2]+"-"+m[3]; }
  if((m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s))) return m[3]+"-"+pad(+m[2])+"-"+pad(+m[1]);
  var d2=new Date(s); return isNaN(d2) ? "" : iso(d2);
}
function MON(m){ var mo=+m.slice(5,7), y=m.slice(0,4);
  return EN() ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][mo-1]+" "+y : "Tháng "+mo+"/"+y; }
function DOW(i){ return EN() ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i] : ["T2","T3","T4","T5","T6","T7","CN"][i]; }
function dmy(s){ var d=dOf(s); return d ? pad(d.getDate())+"/"+pad(d.getMonth()+1)+(d.getFullYear()!==new Date().getFullYear()?"/"+d.getFullYear():"") : ""; }
function hash(s){ var h=0; s=String(s); for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))|0; } return Math.abs(h); }
function team(k){ return (window.TEAMS||{})[k] || null; }
function teamLb(k){ var t=team(k); if(!t) return k; var vi={dental:"Dental",surgical:"Surgical",eyeless:"Eyeless",thai:"Surgical TH",thaid:"Dental TH"}[k]; return EN() ? (t.label||k) : (vi||t.label||k); }
function sbx(){ try{ return !!localStorage.getItem("mmh_sbx_crm") || !!window.__CRM_TEST; }catch(_){ return false; } }
function ini(p){ var r=(window.ROLES||{})[p]; if(r && r.ini) return r.ini; return String(p||"?").split(/\s+/).map(function(x){ return x[0]||""; }).join("").slice(0,2).toUpperCase(); }

/* ───────── JSONP tới backend 1 nhóm (AUTH tự gắn tk; thẻ <script> hỏng ⇒ fetch không cookie) ───────── */
function jp(url, params, ms){
  if(typeof window.__phaJp === "function") return window.__phaJp(url, params, ms||60000);
  return new Promise(function(res, rej){
    var cb="__wm_"+Date.now()+"_"+Math.floor(Math.random()*1e5), s=document.createElement("script");
    var t=setTimeout(function(){ done(); rej(new Error("__TIMEOUT__")); }, ms||60000);
    function done(){ clearTimeout(t); try{ delete window[cb]; }catch(_){} if(s.parentNode) s.parentNode.removeChild(s); }
    window[cb]=function(d){ done(); res(d); };
    var p=Object.assign({}, params, { callback:cb }); if(me() && !("pic" in p)) p.pic=me();
    s.src=url+"?"+Object.keys(p).map(function(k){ return encodeURIComponent(k)+"="+encodeURIComponent(p[k]==null?"":p[k]); }).join("&");
    s.onerror=function(){ done(); rej(new Error("load")); };
    document.body.appendChild(s);
  });
}

/* ───────── PHẠM VI XEM ───────── */
function scope(){
  var p=me(), c=CFG.SCOPE[p], u=au();
  if(!c && u && u.admin) c={ c:["vn","th"], t:"*" };
  if(c){
    var byC={};
    c.c.forEach(function(k){ var ts=(c.t==="*"?CFG.COUNTRY_TEAMS[k]:c.t.filter(function(x){ return CFG.COUNTRY_TEAMS[k].indexOf(x)>=0; })).filter(team); if(ts.length) byC[k]=ts; });
    var cs=Object.keys(byC);
    if(cs.length) return { mgr:true, countries:cs, teams:byC, me:p };
  }
  var tk="";
  try{ tk=(window.teamOfPic && teamOfPic(p)) || curTeamKey(); }catch(_){ tk="dental"; }
  if(!team(tk)) tk="dental";
  var cc=(tk==="thai"||tk==="thaid")?"th":"vn", o={}; o[cc]=[tk];
  return { mgr:false, countries:[cc], teams:o, me:p };
}

/* ───────── TRẠNG THÁI ───────── */
var ST={ open:false, country:"", team:"*", pic:"*", month:ym(today()), cal:"week", week:monday(today()), day:"", view:"act", sel:null, q:"", sheet:false };
var DB={};          /* DB[team] = { at, from, to, visits, accs, trips, fu, fuCols, fuKind, loc, err } */
var GEO={};         /* GEO[country] = { feats:[{n, key, paths, bb, c}], bb, proj } */
var CAT={};         /* CAT[country] = [{id,n,th,t,own,p,a,lat,lng}] */
var SC=null;

function teamsNow(){ var t=(SC.teams[ST.country]||[]); return ST.team==="*" ? t : t.filter(function(k){ return k===ST.team; }); }
function picsNow(){
  if(!SC.mgr) return [SC.me];
  var seen={}, out=[];
  teamsNow().forEach(function(k){
    var base=[]; try{ base=teamPicNames(k); }catch(_){}
    base.forEach(function(p){ if(!seen[p]){ seen[p]=1; out.push(p); } });
    var d=DB[k]; if(d && d.visits) d.visits.forEach(function(v){ if(v.pic && !seen[v.pic] && !/^test/i.test(v.pic)){ seen[v.pic]=1; out.push(v.pic); } });
  });
  return out;
}
function colorOf(p){ var all=[]; try{ Object.keys(window.ROLES||{}).forEach(function(x){ all.push(x); }); }catch(_){} var i=all.indexOf(p); if(i<0) i=hash(p); return PAL[i%PAL.length]; }
function picOk(p){ if(!SC.mgr) return picEq(p, SC.me); return ST.pic==="*" || picEq(p, ST.pic); }
function picEq(a,b){ return nk(a)===nk(b) && !!nk(a); }

/* ───────── TẢI DỮ LIỆU ───────── */
function winOf(m){ return { from: ymAdd(m, -CFG.HIST_MONTHS)+"-01", to: mEnd(ymAdd(m, 1)) }; }
function kindOf(ta, tt){
  var a=nw(ta)+" "+nw(tt);
  if(/visit/.test(a)) return "visit";
  if(/tele|call|phone|dien thoai|goi/.test(a)) return "call";
  if(/mess|zalo|email|e mail|chat|line|tin nhan/.test(a)) return "msg";
  if(/present|event|workshop|seminar|training|dao tao|hoi thao|demo|thuyet trinh|su kien/.test(a)) return "event";
  return "other";
}
function isDone(st){ return /complete|hoan thanh|done|finish/.test(nw(st)); }
function gpsOf(g){ var m=/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/.exec(String(g||"")); return m ? [+m[1], +m[2]] : null; }
function normVisit(w, k){
  var acc=String(w.accName||"") || (window.parseAcc ? parseAcc(w.account).name : String(w.account||"").split("/")[0]);
  var pa=window.parseAcc ? parseAcc(w.account) : {};
  var ph=[]; try{ ph=window.photoObjsOf ? photoObjsOf(w.photo) : []; }catch(_){}
  return { team:k, row:w._row, pic:String(w.pic||"").trim(), d:toIso(w.start), d2:toIso(w.finish)||toIso(w.start), acc:String(acc||"").trim(), raw:String(w.account||""),
    type:String(w.accType||pa.type||w.type||""), prov:String(w.accProv||pa.province||w.province||""), ta:String(w.typeAction||""), tt:String(w.typeTask||""),
    kind:kindOf(w.typeAction, w.typeTask), st:String(w.status||""), done:isDone(w.status), plan:String(w.plan||""), result:String(w.result||""),
    fb:String(w.feedback||""), next:String(w.nextAction||""), stop:String(w.stopReason||""), proc:String(w.process||""), prod:String(w.product||""),
    gps:gpsOf(w.gps), photo:(ph[0]&&ph[0].thumb)||"", photoBig:(ph[0]&&ph[0].full)||"", tbd:/^tbd\b|đi địa bàn$/i.test(acc) };
}
function normTrip(t, k){
  var dest=""; var m=/(?:Đi công tác|Business trip)\s+(.+?)\s+·/i.exec(String(t.subTask||"")); if(m) dest=m[1];
  return { team:k, pic:String(t.pic||""), d:toIso(t.start), d2:toIso(t.planned)||toIso(t.start), dest:dest, ap:String(t.approval||""), st:String(t.status||""),
    txt:String(t.subTask||""), result:String(t.result||""), kind:"trip" };
}
function load(k, force){
  var t=team(k); if(!t || !t.url) return Promise.resolve(null);
  var w=winOf(ST.month), d=DB[k];
  if(!force && d && !d.err && d.from<=w.from && d.to>=w.to && Date.now()-d.at<CFG.TTL) return Promise.resolve(d);
  if(d && d.busy) return d.busy;
  var url=t.url, rq=[], th=(k==="thai"||k==="thaid");
  var nd={ at:Date.now(), from:w.from, to:w.to, visits:[], accs:[], trips:[], fu:[], fuCols:[], fuKind:"", loc:{}, err:"" };
  rq.push(jp(url, { action:"visitFeed", from:w.from, to:w.to }, 90000).then(function(j){ nd.visits=((j&&j.rows)||[]).map(function(r){ return normVisit(r, k); }).filter(function(v){ return v.d; }); }));
  rq.push(jp(url, { action:"customerIndex" }, 60000).then(function(j){ nd.accs=((j&&j.rows)||[]).map(function(c){ return { team:k, code:String(c.code||""), name:String(c.name||""), type:String(c.type||""), prov:String(c.province||""), area:String(c.area||""), pic:String(c.pic||"") }; }).filter(function(c){ return c.name; }); }));
  var pics=[]; try{ pics=teamPicNames(k); }catch(_){}
  if(!SC.mgr) pics=[SC.me];
  if(pics.length) rq.push(jp(url, { action:"tfTrips", pics:JSON.stringify(pics) }, 45000).then(function(j){ nd.trips=((j&&(j.trips||j.rows))||[]).map(function(r){ return normTrip(r, k); }).filter(function(x){ return x.d; }); }).catch(function(){}));
  if(k==="surgical"){
    rq.push(jp(url, { action:"fuVisits", from:w.from }, 60000).then(function(j){
      if(!j || !j.acc || !j.accCols) return; var C=j.accCols, ix=function(n){ return C.indexOf(n); };
      j.acc.forEach(function(r){ var nm=r[ix("name")], ll=gpsOf(r[ix("loc")]) || gpsOf(r[ix("gps")]); var std=r[ix("std")];
        var key=nk(nm)+"|"+nk(r[ix("province")]); nd.loc[key]={ ll:ll, std:std||"", code:r[ix("code")], kind:r[ix("kind")] }; });
    }).catch(function(){}));
    rq.push(jp(url, { action:"fuList" }, 60000).then(function(j){ if(j && j.ok && j.rows){ nd.fu=j.rows; nd.fuCols=j.cols||[]; nd.fuKind="vn"; nd.fuStages=j.stages||[]; } }).catch(function(){}));
  }
  if(k==="thaid"){
    rq.push(jp(url, { action:"acctList" }, 60000).then(function(j){
      ((j&&(j.rows||j.items))||[]).forEach(function(r){ var lat=parseFloat(r.lat), lng=parseFloat(r.lng); if(!isNaN(lat)&&!isNaN(lng)&&lat) nd.loc[nk(r.name)+"|"+nk(r.province)]={ ll:[lat,lng], code:r.code, key:r.key }; });
    }).catch(function(){}));
    rq.push(jp(url, { action:"fuList" }, 60000).then(function(j){ if(j && j.ok && j.rows){ nd.fu=j.rows; nd.fuCols=j.cols||[]; nd.fuKind="th"; nd.fuStages=j.stages||[]; } }).catch(function(){}));
  }
  var p=Promise.all(rq.map(function(x){ return x.catch(function(e){ nd.err=String(e&&e.message||e); }); })).then(function(){
    if(nd.err && !nd.visits.length && !nd.accs.length && d){ d.busy=null; d.err=nd.err; return d; }
    DB[k]=nd; return nd;
  });
  if(d) d.busy=p; else DB[k]={ busy:p, visits:[], accs:[], trips:[], fu:[], loc:{}, from:"9", to:"0", at:0 };
  return p;
}
function loadAll(force){
  ST.loading=true; paintLoad();
  return Promise.all(teamsNow().map(function(k){ return load(k, force); })).then(function(){ ST.loading=false; paint(); })
    .catch(function(){ ST.loading=false; paint(); });
}

/* ───────── ĐỊA LÝ ───────── */
var SCRIPTS={};
function base(){ var s=document.querySelector('script[src*="wmap/wmap.js"]'); return s ? s.src.replace(/wmap\/wmap\.js.*$/, "") : ""; }
function need(file){
  if(SCRIPTS[file]) return SCRIPTS[file];
  return (SCRIPTS[file]=new Promise(function(res){ var s=document.createElement("script"); s.src=base()+"geo/"+file+"?v="+VER; s.onload=function(){ res(true); }; s.onerror=function(){ SCRIPTS[file]=null; res(false); }; document.head.appendChild(s); }));
}
function geoReady(c){
  if(GEO[c]) return Promise.resolve(GEO[c]);
  return need(c==="vn"?"wm-vn-geo.js":"wm-th-geo.js").then(function(){
    var fc=window.WM_DATA && WM_DATA[c==="vn"?"vnGeo":"thGeo"]; if(!fc) return null;
    if(GEO[c]) return GEO[c];
    var lat0=c==="vn"?16:13.5, cs=Math.cos(lat0*Math.PI/180), S0=100;
    var P=function(x, y){ return [ (x-100)*cs*S0, -(y-lat0)*S0 ]; };
    var feats=[], gb=[1e9,1e9,-1e9,-1e9];
    fc.features.forEach(function(f){
      var g=f.geometry, polys=g.type==="MultiPolygon"?g.coordinates:[g.coordinates], d="", bb=[1e9,1e9,-1e9,-1e9], best=null, ba=0;
      polys.forEach(function(poly){
        poly.forEach(function(ring, ri){
          var pts=ring.map(function(q){ return P(q[0], q[1]); });
          d+="M"+pts.map(function(q){ if(q[0]<bb[0])bb[0]=q[0]; if(q[1]<bb[1])bb[1]=q[1]; if(q[0]>bb[2])bb[2]=q[0]; if(q[1]>bb[3])bb[3]=q[1]; return q[0].toFixed(1)+","+q[1].toFixed(1); }).join("L")+"Z";
          if(ri===0){ var a=0, cx=0, cy=0; for(var i=0, j=pts.length-1; i<pts.length; j=i++){ var cr=pts[j][0]*pts[i][1]-pts[i][0]*pts[j][1]; a+=cr; cx+=(pts[j][0]+pts[i][0])*cr; cy+=(pts[j][1]+pts[i][1])*cr; }
            if(Math.abs(a)>ba){ ba=Math.abs(a); best=[cx/(3*a), cy/(3*a)]; } }
        });
      });
      gb=[Math.min(gb[0],bb[0]),Math.min(gb[1],bb[1]),Math.max(gb[2],bb[2]),Math.max(gb[3],bb[3])];
      var n=f.properties.n;
      feats.push({ n:n, th:f.properties.th||"", key:nk(n), d:d, bb:bb, c:best||[(bb[0]+bb[2])/2,(bb[1]+bb[3])/2] });
    });
    var alias={};
    if(c==="vn") VN_NEW.forEach(function(x){ alias[nk(x[0])]=x[0]; x[1].forEach(function(o){ alias[nk(o)]=x[0]; }); });
    else { feats.forEach(function(f){ alias[f.key]=f.n; if(f.th) alias[nk(f.th)]=f.n; }); Object.keys(TH_ALIAS).forEach(function(k){ alias[k]=TH_ALIAS[k]; }); }
    GEO[c]={ feats:feats, by:feats.reduce(function(o,f){ o[f.n]=f; return o; }, {}), bb:gb, P:P, alias:alias };
    return GEO[c];
  });
}
function lev(a, b){ if(Math.abs(a.length-b.length)>2) return 9; var m=[], i, j; for(i=0;i<=b.length;i++) m[i]=[i]; for(j=0;j<=a.length;j++) m[0][j]=j;
  for(i=1;i<=b.length;i++) for(j=1;j<=a.length;j++) m[i][j]=Math.min(m[i-1][j-1]+(b[i-1]===a[j-1]?0:1), m[i][j-1]+1, m[i-1][j]+1); return m[b.length][a.length]; }
var PCACHE={};
/* tên tỉnh trong CRM (mới / cũ / viết tắt) ⇒ tên tỉnh trên bản đồ */
function provOf(name, c){
  var g=GEO[c]; if(!g || !name) return "";
  var ck=c+"|"+name; if(ck in PCACHE) return PCACHE[ck];
  var k=nk(String(name).replace(/^(tỉnh|tinh|thành phố|thanh pho|tp\.?|t\.p\.?|province|changwat)\s+/i, "")), r=g.alias[k]||"";
  if(!r && c==="th"){ var best=9; Object.keys(g.alias).forEach(function(a){ if(a.length<4) return; var d=lev(k, a); if(d<best && d<=2){ best=d; r=g.alias[a]; } }); }
  if(!r){ Object.keys(g.alias).some(function(a){ if(a.length>=4 && k.indexOf(a)>=0){ r=g.alias[a]; return true; } return false; }); }
  return (PCACHE[ck]=r);
}
function catReady(c){
  if(CAT[c]) return Promise.resolve(CAT[c]);
  return need(c==="vn"?"wm-vn-csyt.js":"wm-th-csyt.js").then(function(){
    var D=window.WM_DATA && WM_DATA[c==="vn"?"vnCsyt":"thCsyt"]; if(!D) return (CAT[c]=[]);
    var C=D.cols, T=D.types||{};
    CAT[c]=D.rows.map(function(r){ var o={}; C.forEach(function(k, i){ o[k]=r[i]; }); o.tl=T[o.t]||""; o.k=nw(o.n+" "+(o.th||"")); o.nk=nk(o.n); return o; });
    return CAT[c];
  });
}

/* ───────── KHÁCH + LƯỢT TRONG PHẠM VI ───────── */
function accKey(team, name, prov){ return team+"|"+nk(name)+"|"+nk(prov); }
function model(){
  var c=ST.country, g=GEO[c], m=ST.month, from=m+"-01", to=mEnd(m), accs={}, list=[], cal=[], trips=[];
  teamsNow().forEach(function(k){
    var d=DB[k]; if(!d) return;
    (d.accs||[]).forEach(function(a){
      if(!SC.mgr && !picEq(a.pic, SC.me)) return;
      if(SC.mgr && ST.pic!=="*" && !picEq(a.pic, ST.pic)) return;
      var key=accKey(k, a.name, a.prov); if(accs[key]) return;
      accs[key]={ key:key, team:k, code:a.code, name:a.name, type:a.type, prov:a.prov, area:a.area, pic:a.pic, pv:provOf(a.prov, c), vis:[], inCrm:true };
    });
    (d.visits||[]).forEach(function(v){
      if(!picOk(v.pic) || v.tbd || !v.acc) return;
      var key=accKey(k, v.acc, v.prov), a=accs[key];
      if(!a){ var alt=Object.keys(accs).filter(function(x){ return x.indexOf(k+"|"+nk(v.acc)+"|")===0; })[0]; a=alt?accs[alt]:null; }
      if(!a){ a=accs[key]={ key:key, team:k, code:"", name:v.acc, type:v.type, prov:v.prov, area:"", pic:v.pic, pv:provOf(v.prov, c), vis:[], inCrm:false }; }
      a.vis.push(v);
    });
    (d.visits||[]).forEach(function(v){ if(picOk(v.pic) && v.d<=to && v.d2>=from) cal.push(v); });
    (d.trips||[]).forEach(function(t){ if(picOk(t.pic)) trips.push(t); });
  });
  Object.keys(accs).forEach(function(k){ var a=accs[k]; a.vis.sort(function(x,y){ return y.d.localeCompare(x.d); }); a.mon=a.vis.filter(function(v){ return v.d>=from && v.d<=to; }); a.ll=locate(a); list.push(a); });
  return { accs:accs, list:list, cal:cal, trips:trips, from:from, to:to };
}
var LOCC={};
function locate(a){
  var c=ST.country, d=DB[a.team]||{}, key=nk(a.name)+"|"+nk(a.prov), L0=(d.loc||{})[key];
  if(L0 && L0.ll) return { ll:L0.ll, src:"pin" };
  var g=[]; a.vis.forEach(function(v){ if(v.gps) g.push(v.gps); });
  if(g.length){ g.sort(function(x,y){ return x[0]-y[0]; }); var lat=g[Math.floor(g.length/2)][0]; g.sort(function(x,y){ return x[1]-y[1]; }); return { ll:[lat, g[Math.floor(g.length/2)][1]], src:"gps" }; }
  var ck=c+"|"+a.team+"|"+key; if(ck in LOCC) return LOCC[ck];
  var r=null, cat=CAT[c];
  if(cat && cat.length){
    var an=nk(L0&&L0.std?L0.std:a.name), best=null, bs=0;
    if(an.length>=5) cat.forEach(function(f){
      if(f.lat==="" || f.lat==null) return;
      var fp=c==="vn"?(f.p||""):f.p; if(a.pv && fp && fp!==a.pv && nk(f.o||"")!==nk(a.prov)) return;
      var s=0; if(f.nk===an) s=3; else if(f.nk.length>=6 && (an.indexOf(f.nk)>=0 || f.nk.indexOf(an)>=0)) s=2;
      if(s>bs){ bs=s; best=f; }
    });
    if(best) r={ ll:[+best.lat, +best.lng], src:"cat", fac:best };
  }
  if(!r && a.pv && GEO[c] && GEO[c].by[a.pv]){
    var f=GEO[c].by[a.pv], h=hash(a.name), j=0.08;
    r={ xy:[f.c[0]+((h%100)/100-0.5)*j*100*0.6, f.c[1]+(((h>>7)%100)/100-0.5)*j*100*0.6], src:"prov" };
  }
  return (LOCC[ck]=r);
}
function xyOf(a){ var g=GEO[ST.country]; if(!a.ll || !g) return null; if(a.ll.xy) return a.ll.xy; if(a.ll.ll) return g.P(a.ll.ll[1], a.ll.ll[0]); return null; }

/* ───────── DỰNG KHUNG ───────── */
var ROOT=null, M=null;
function build(){
  if(ROOT) return;
  ROOT=document.createElement("div"); ROOT.id="wm"; ROOT.setAttribute("role","dialog"); ROOT.setAttribute("aria-label","Working Map");
  ROOT.innerHTML=
    '<div class="wm-top">'+
      '<button class="wm-back" id="wm-back" type="button">'+svg("back")+'<span>CRM</span></button>'+
      '<div class="wm-tt"><b>Working Map</b><span id="wm-sub"></span></div>'+
      '<div class="wm-qs"><span class="wm-qi">'+svg("search")+'</span><input id="wm-q" type="search" autocomplete="off" spellcheck="false"><div class="wm-qr" id="wm-qr" hidden></div></div>'+
      '<div class="wm-mon"><button class="wm-ib" id="wm-mp" type="button">'+svg("prev")+'</button><span id="wm-ml"></span><button class="wm-ib" id="wm-mn" type="button">'+svg("next")+'</button></div>'+
      '<button class="wm-ib" id="wm-rl" type="button">'+svg("reload")+'</button>'+
    '</div>'+
    '<div class="wm-flt" id="wm-flt"></div>'+
    '<div class="wm-body">'+
      '<div class="wm-mainc">'+
        '<section class="wm-cal" id="wm-cal" aria-label="Calendar"></section>'+
        '<section class="wm-mapc" id="wm-mapc">'+
          '<svg id="wm-svg" role="img" aria-label="Map"><g id="wm-g"><g id="wm-pv"></g><g id="wm-lb"></g><g id="wm-mk"></g></g></svg>'+
          '<div class="wm-mui"><button class="wm-z" id="wm-zi" type="button">'+svg("zin")+'</button><button class="wm-z" id="wm-zo" type="button">'+svg("zout")+'</button><button class="wm-z" id="wm-zh" type="button">'+svg("home")+'</button></div>'+
          '<div class="wm-seg wm-vw" id="wm-vw"></div>'+
          '<div class="wm-lg" id="wm-lg"></div>'+
          '<div class="wm-tip" id="wm-tip" hidden></div>'+
          '<div class="wm-ld" id="wm-ld" hidden></div>'+
        '</section>'+
      '</div>'+
      '<aside class="wm-side" id="wm-side"><div class="wm-grab" id="wm-grab"></div><div class="wm-sc" id="wm-sc"></div></aside>'+
    '</div>';
  document.body.appendChild(ROOT);
  $i("wm-back").onclick=function(){ close(true); };
  $i("wm-mp").onclick=function(){ setMonth(ymAdd(ST.month,-1)); };
  $i("wm-mn").onclick=function(){ setMonth(ymAdd(ST.month,1)); };
  $i("wm-rl").onclick=function(){ loadAll(true); };
  $i("wm-zi").onclick=function(){ zoomBy(1.6); };
  $i("wm-zo").onclick=function(){ zoomBy(1/1.6); };
  $i("wm-zh").onclick=function(){ fit(); };
  $i("wm-grab").onclick=function(){ ST.sheet=!ST.sheet; ROOT.classList.toggle("wm-up", ST.sheet); };
  var q=$i("wm-q");
  q.addEventListener("input", function(){ ST.q=q.value; paintQ(); });
  q.addEventListener("focus", function(){ if(q.value) paintQ(); });
  q.addEventListener("keydown", function(e){ if(e.key==="Escape"){ q.value=""; ST.q=""; paintQ(); q.blur(); } if(e.key==="Enter"){ var f=document.querySelector("#wm-qr .wm-qo"); if(f) f.click(); } });
  document.addEventListener("click", function(e){ if(!e.target.closest || !e.target.closest(".wm-qs")){ var r=$i("wm-qr"); if(r) r.hidden=true; } });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape" && ST.open && !document.querySelector("#ov.on,#ov2.on,#drw.on") && document.activeElement!==q){ if(ST.sel){ ST.sel=null; paintSide(); paintMap(); } } });
  wireMap();
}
function i18nStatic(){
  $i("wm-q").placeholder=L("Tìm khách hàng, bệnh viện, tỉnh…","Search accounts, hospitals, provinces…");
  $i("wm-back").title=L("Về giao diện CRM nhập liệu","Back to the CRM screens");
  $i("wm-rl").title=L("Tải lại dữ liệu","Reload data");
  $i("wm-zi").title=L("Phóng to","Zoom in"); $i("wm-zo").title=L("Thu nhỏ","Zoom out"); $i("wm-zh").title=L("Toàn bộ","Whole country");
  $i("wm-mp").title=L("Tháng trước","Previous month"); $i("wm-mn").title=L("Tháng sau","Next month");
}

/* ───────── BỘ LỌC: quốc gia · phòng ban · người ───────── */
function paintFlt(){
  var h="";
  if(SC.countries.length>1) h+='<div class="wm-seg">'+SC.countries.map(function(c){ return '<button type="button" data-c="'+c+'" class="'+(ST.country===c?"on":"")+'">'+(c==="vn"?L("Việt Nam","Vietnam"):L("Thái Lan","Thailand"))+'</button>'; }).join("")+'</div>';
  var ts=SC.teams[ST.country]||[];
  if(SC.mgr && ts.length>1) h+='<div class="wm-seg">'+['*'].concat(ts).map(function(k){ return '<button type="button" data-t="'+k+'" class="'+(ST.team===k?"on":"")+'">'+(k==="*"?L("Tất cả phòng ban","All teams"):E(teamLb(k)))+'</button>'; }).join("")+'</div>';
  else if(SC.mgr) h+='<span class="wm-tag">'+E(teamLb(ts[0]))+'</span>';
  if(SC.mgr){
    var ps=picsNow();
    h+='<div class="wm-pics"><button type="button" data-p="*" class="wm-pall'+(ST.pic==="*"?" on":"")+'">'+L("Cả nhóm","Whole team")+'</button>'+
      ps.map(function(p){ return '<button type="button" data-p="'+E(p)+'" class="wm-pc'+(picEq(ST.pic,p)?" on":"")+'" title="'+E(p)+'"><i style="background:'+colorOf(p)+'">'+E(ini(p))+'</i><span>'+E(p)+'</span></button>'; }).join("")+'</div>';
  } else h+='<span class="wm-tag"><i class="wm-av" style="background:'+colorOf(SC.me)+'">'+E(ini(SC.me))+'</i>'+E(SC.me)+' · '+E(teamLb(ts[0]))+'</span>';
  var f=$i("wm-flt"); f.innerHTML=h;
  [].forEach.call(f.querySelectorAll("[data-c]"), function(b){ b.onclick=function(){ setCountry(b.getAttribute("data-c")); }; });
  [].forEach.call(f.querySelectorAll("[data-t]"), function(b){ b.onclick=function(){ ST.team=b.getAttribute("data-t"); ST.pic="*"; ST.sel=null; LOCC={}; loadAll(); }; });
  [].forEach.call(f.querySelectorAll("[data-p]"), function(b){ b.onclick=function(){ var p=b.getAttribute("data-p"); ST.pic=(p==="*"||picEq(ST.pic,p))?"*":p; ST.sel=null; paint(); }; });
  $i("wm-sub").textContent=SC.mgr ? ((ST.team==="*" && ts.length>1) ? (ST.country==="vn"?L("Sales Việt Nam","Vietnam sales"):L("Sales Thái Lan","Thailand sales")) : teamLb(ST.team==="*"?ts[0]:ST.team)) + (ST.pic!=="*"?" · "+ST.pic:"") : SC.me;
  $i("wm-ml").textContent=MON(ST.month);
}
function setCountry(c){ if(c===ST.country) return; ST.country=c; ST.team="*"; ST.pic="*"; ST.sel=null; PCACHE={}; LOCC={}; Z=null; prep().then(function(){ loadAll(); }); }
function setMonth(m){ ST.month=m; ST.day=""; var w=monday(m+"-01"); if(ym(ST.week)!==m && ym(addD(ST.week,6))!==m) ST.week=(m===ym(today()))?monday(today()):w; LOCC={}; loadAll(); }

/* ───────── LỊCH ───────── */
function calItems(Mo){
  var out={};
  function put(d, it){ (out[d]=out[d]||[]).push(it); }
  Mo.cal.forEach(function(v){ var d=v.d, e=v.d2&&v.d2>v.d?v.d2:v.d, n=0; while(d<=e && n<40){ put(d, v); d=addD(d,1); n++; } });
  Mo.trips.forEach(function(t){ var d=t.d, e=t.d2&&t.d2>t.d?t.d2:t.d, n=0; while(d<=e && n<40){ put(d, t); d=addD(d,1); n++; } });
  return out;
}
function paintCal(Mo){
  var el=$i("wm-cal"), by=calItems(Mo), td=today(), days=[], single=!SC.mgr || ST.pic!=="*";
  var start, n;
  if(ST.cal==="week"){ start=ST.week; n=7; } else { start=monday(ST.month+"-01"); var e=mEnd(ST.month), w=monday(e); n=Math.round((dOf(w)-dOf(start))/864e5)+7; }
  for(var i=0;i<n;i++) days.push(addD(start,i));
  var lbl=ST.cal==="week" ? dmy(days[0])+" – "+dmy(days[6]) : MON(ST.month);
  var h='<div class="wm-ch"><div class="wm-seg sm">'+
      '<button type="button" data-cm="week" class="'+(ST.cal==="week"?"on":"")+'">'+L("Tuần","Week")+'</button>'+
      '<button type="button" data-cm="month" class="'+(ST.cal==="month"?"on":"")+'">'+L("Tháng","Month")+'</button></div>'+
    (ST.cal==="week"?'<button class="wm-ib sm" type="button" data-wk="-1">'+svg("prev")+'</button><span class="wm-cl">'+E(lbl)+'</span><button class="wm-ib sm" type="button" data-wk="1">'+svg("next")+'</button>':'<span class="wm-cl">'+E(lbl)+'</span>')+
    '<button class="wm-lk" type="button" data-wk="0">'+L("Hôm nay","Today")+'</button>'+
    (ST.day?'<button class="wm-chip" type="button" data-dc="1">'+E(dmy(ST.day))+' '+svg("x")+'</button>':'')+
    '<div class="wm-kl">'+["visit","call","event","trip","other"].map(function(k){ return '<span>'+svg(k,"k-"+k)+E(L(KIND[k].vi,KIND[k].en))+'</span>'; }).join("")+'</div></div>';
  h+='<div class="wm-cg '+(ST.cal==="week"?"wk":"mo")+'">';
  for(var j=0;j<7;j++) h+='<div class="wm-dh">'+DOW(j)+'</div>';
  days.forEach(function(d){
    var its=by[d]||[], out=ym(d)!==ST.month, cls="wm-dc"+(d===td?" td":"")+(out?" out":"")+(ST.day===d?" sel":"")+(its.length?" has":"");
    h+='<button type="button" class="'+cls+'" data-d="'+d+'"><span class="wm-dn">'+(+d.slice(8))+'</span>'+cellHtml(its, single)+'</button>';
  });
  h+='</div>';
  el.innerHTML=h;
  [].forEach.call(el.querySelectorAll("[data-cm]"), function(b){ b.onclick=function(){ ST.cal=b.getAttribute("data-cm"); paintCal(model()); }; });
  [].forEach.call(el.querySelectorAll("[data-wk]"), function(b){ b.onclick=function(){ var k=+b.getAttribute("data-wk");
    if(k===0){ ST.week=monday(today()); ST.day=""; if(ym(today())!==ST.month) return setMonth(ym(today())); return paint(); }
    ST.week=addD(ST.week, 7*k); var mm=ym(addD(ST.week,3)); if(mm!==ST.month){ ST.month=mm; ST.day=""; LOCC={}; return loadAll(); } paint(); }; });
  [].forEach.call(el.querySelectorAll("[data-dc]"), function(b){ b.onclick=function(){ ST.day=""; ST.sel=null; paint(); }; });
  [].forEach.call(el.querySelectorAll("[data-d]"), function(b){ b.onclick=function(){ var d=b.getAttribute("data-d"); if(ST.day===d){ ST.day=""; ST.sel=null; } else { ST.day=d; ST.sel={ kind:"day", key:d }; if(ym(d)!==ST.month){ ST.month=ym(d); LOCC={}; return loadAll(); } } paint(); }; });
}
function cellHtml(its, single){
  if(!its.length) return "";
  var wk=ST.cal==="week";
  if(single){
    var cnt={}; its.forEach(function(v){ cnt[v.kind]=(cnt[v.kind]||0)+1; });
    if(!wk) return '<span class="wm-ks">'+Object.keys(cnt).slice(0,3).map(function(k){ return svg(k,"k-"+k); }).join("")+(its.length>1?'<b>'+its.length+'</b>':"")+'</span>';
    return '<span class="wm-tl">'+its.slice(0,3).map(function(v){ return '<span class="wm-tr'+(v.kind==="trip"?" trp":"")+(v.done?" dn":"")+'">'+svg(v.kind,"k-"+v.kind)+'<em>'+E(v.kind==="trip"?(v.dest||L("Công tác","Trip")):short(v.acc))+'</em></span>'; }).join("")+(its.length>3?'<span class="wm-more">+'+(its.length-3)+'</span>':"")+'</span>';
  }
  var by={}, order=[];
  its.forEach(function(v){ if(!by[v.pic]){ by[v.pic]={}; order.push(v.pic); } by[v.pic][v.kind]=(by[v.pic][v.kind]||0)+1; });
  var max=wk?4:3, h='<span class="wm-avs">';
  order.slice(0, max).forEach(function(p){
    var ks=Object.keys(by[p]), tot=ks.reduce(function(s,k){ return s+by[p][k]; },0);
    h+='<span class="wm-ap" title="'+E(p+" · "+ks.map(function(k){ return by[p][k]+" "+L(KIND[k].vi,KIND[k].en); }).join(", "))+'"><i style="background:'+colorOf(p)+'">'+E(ini(p))+'</i>'+
      (wk?'<span class="wm-ks">'+ks.slice(0,2).map(function(k){ return svg(k,"k-"+k); }).join("")+(tot>1?'<b>'+tot+'</b>':"")+'</span>':'')+'</span>';
  });
  if(order.length>max) h+='<span class="wm-more">+'+(order.length-max)+'</span>';
  return h+'</span>';
}
function short(s){ s=String(s||""); return s.length>22 ? s.slice(0,21)+"…" : s; }

/* ───────── BẢN ĐỒ (SVG, kéo / cuộn / chụm để phóng) ───────── */
var Z=null, BASEK=1;   /* { k, x, y } · BASEK = tỉ lệ khi xem cả nước */
function box(){ var r=$i("wm-svg").getBoundingClientRect(); return { w:Math.max(200, r.width), h:Math.max(160, r.height) }; }
function fit(bb, pad0){
  var g=GEO[ST.country]; if(!g) return; bb=bb||g.bb; var b=box(), pd=pad0==null?24:pad0;
  var k=Math.min((b.w-2*pd)/(bb[2]-bb[0]||1), (b.h-2*pd)/(bb[3]-bb[1]||1)); if(!isFinite(k)||k<=0) k=1;
  if(bb!==g.bb){ var k0=Math.min((b.w-2*pd)/(g.bb[2]-g.bb[0]), (b.h-2*pd)/(g.bb[3]-g.bb[1])); k=Math.min(k, k0*14); }
  var kb=Math.min((b.w-2*pd)/(g.bb[2]-g.bb[0]||1), (b.h-2*pd)/(g.bb[3]-g.bb[1]||1)); if(isFinite(kb)&&kb>0) BASEK=kb;
  Z={ k:k, x:b.w/2-k*(bb[0]+bb[2])/2, y:b.h/2-k*(bb[1]+bb[3])/2 }; apply(true);
}
function apply(re){ var gg=$i("wm-g"); if(!gg || !Z) return; gg.setAttribute("transform","translate("+Z.x.toFixed(1)+","+Z.y.toFixed(1)+") scale("+Z.k.toFixed(4)+")"); if(re) schedule(); }
var RAF=0; function schedule(){ if(RAF) return; RAF=requestAnimationFrame(function(){ RAF=0; paintMarks(); }); }
function zoomAt(f, cx, cy){ if(!Z) return; var g=GEO[ST.country], b=box(), k0=Math.min(b.w/(g.bb[2]-g.bb[0]), b.h/(g.bb[3]-g.bb[1]));
  var nk2=Math.max(k0*0.6, Math.min(k0*40, Z.k*f)); f=nk2/Z.k; Z.x=cx-(cx-Z.x)*f; Z.y=cy-(cy-Z.y)*f; Z.k=nk2; apply(true); }
function zoomBy(f){ var b=box(); zoomAt(f, b.w/2, b.h/2); }
function wireMap(){
  var el=$i("wm-svg"), P={}, last=null, moved=false, pinch=null;
  el.addEventListener("wheel", function(e){ e.preventDefault(); var r=el.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY*0.0016), e.clientX-r.left, e.clientY-r.top); }, { passive:false });
  el.addEventListener("pointerdown", function(e){ P[e.pointerId]={ x:e.clientX, y:e.clientY }; moved=false; last={ x:e.clientX, y:e.clientY }; try{ el.setPointerCapture(e.pointerId); }catch(_){}
    var ids=Object.keys(P); if(ids.length===2){ var a=P[ids[0]], b=P[ids[1]]; pinch={ d:Math.hypot(a.x-b.x, a.y-b.y) }; } });
  el.addEventListener("pointermove", function(e){
    if(!P[e.pointerId]){ hover(e); return; }
    P[e.pointerId]={ x:e.clientX, y:e.clientY }; var ids=Object.keys(P);
    if(ids.length===2 && pinch){ var a=P[ids[0]], b=P[ids[1]], d=Math.hypot(a.x-b.x, a.y-b.y), r=el.getBoundingClientRect(); if(pinch.d>0) zoomAt(d/pinch.d, (a.x+b.x)/2-r.left, (a.y+b.y)/2-r.top); pinch.d=d; moved=true; return; }
    if(!last || !Z) return; var dx=e.clientX-last.x, dy=e.clientY-last.y; if(Math.abs(dx)+Math.abs(dy)>3) moved=true;
    if(moved){ Z.x+=dx; Z.y+=dy; last={ x:e.clientX, y:e.clientY }; apply(false); tipHide(); }
  });
  function up(e){ var wasTap=!moved && Object.keys(P).length===1; delete P[e.pointerId]; if(Object.keys(P).length<2) pinch=null; if(!Object.keys(P).length){ last=null; schedule(); }
    if(wasTap) tap(e); }
  el.addEventListener("pointerup", up); el.addEventListener("pointercancel", function(e){ delete P[e.pointerId]; pinch=null; last=null; });
  el.addEventListener("pointerleave", tipHide);
  window.addEventListener("resize", function(){ if(ST.open){ schedule(); } });
}
function hit(e){ var t=document.elementFromPoint(e.clientX, e.clientY); return t && t.closest ? t.closest("[data-mk],[data-pv]") : null; }
function tap(e){
  var t=hit(e); if(!t){ return; }
  if(t.hasAttribute("data-mk")){ var ks=t.getAttribute("data-mk").split("\u0001");
    if(ks.length===1) return pick("acc", ks[0]);
    var x=+t.getAttribute("data-x"), y=+t.getAttribute("data-y"); var b=box(); var r=$i("wm-svg").getBoundingClientRect(); zoomAt(2.2, e.clientX-r.left, e.clientY-r.top); return; }
  if(t.hasAttribute("data-pv")) pick("prov", t.getAttribute("data-pv"));
}
var TIPT=0;
function hover(e){
  if(e.pointerType==="touch") return;
  var t=hit(e), tip=$i("wm-tip"); if(!t){ tipHide(); return; }
  var h="";
  if(t.hasAttribute("data-mk")){ var ks=t.getAttribute("data-mk").split("\u0001"), Mo=CUR; if(!Mo) return;
    if(ks.length===1){ var a=Mo.accs[ks[0]]; if(!a) return; var v=a.vis[0];
      h=(v&&v.photo?'<img src="'+E(v.photo)+'" alt="" loading="lazy">':'')+'<b>'+E(a.name)+'</b><span>'+E([a.type, a.prov].filter(String).join(" · "))+'</span>'+
        '<span>'+(a.mon.length? L(a.mon.length+" hoạt động trong tháng", a.mon.length+" activities this month") : L("Chưa có hoạt động trong tháng","No activity this month"))+(SC.mgr&&a.pic?' · '+E(a.pic):'')+'</span>'+
        (v?'<em>'+E(dmy(v.d))+' · '+E(L(KIND[v.kind].vi,KIND[v.kind].en))+(v.result?' — '+E(short2(v.result, 120)):'')+'</em>':''); }
    else h='<b>'+ks.length+' '+L("khách hàng","accounts")+'</b><span>'+L("Bấm để phóng to","Click to zoom in")+'</span>';
  } else { var pv=t.getAttribute("data-pv"), s=(CUR&&CUR.pst||{})[pv]||{};
    h='<b>'+E(pv)+'</b><span>'+L("Khách CRM: ","CRM accounts: ")+(s.n||0)+' · '+L("đã gặp trong tháng: ","visited this month: ")+(s.v||0)+(s.n?' ('+Math.round(100*(s.v||0)/s.n)+'%)':'')+'</span><span>'+L("Hoạt động trong tháng: ","Activities this month: ")+(s.a||0)+'</span>'; }
  tip.innerHTML=h; tip.hidden=false;
  var r=$i("wm-mapc").getBoundingClientRect(), x=e.clientX-r.left+14, y=e.clientY-r.top+14;
  if(x+260>r.width) x=e.clientX-r.left-270; if(y+160>r.height) y=Math.max(6, e.clientY-r.top-170);
  tip.style.left=x+"px"; tip.style.top=y+"px";
}
function tipHide(){ var t=$i("wm-tip"); if(t) t.hidden=true; }
function short2(s, n){ s=String(s||"").replace(/\s+/g," ").trim(); return s.length>n ? s.slice(0,n-1)+"…" : s; }
function shortL(s, n){ s=String(s||"").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim(); return s.length>n ? s.slice(0,n-1)+"…" : s; }
var CUR=null;
function paintProv(){
  var g=GEO[ST.country], el=$i("wm-pv"); if(!g || !el) return;
  if(el.getAttribute("data-c")!==ST.country){
    el.innerHTML=g.feats.map(function(f){ return '<path data-pv="'+E(f.n)+'" d="'+f.d+'"/>'; }).join(""); el.setAttribute("data-c", ST.country);
  }
  var pst=CUR.pst, cov=ST.view==="cov", mx=0;
  Object.keys(pst).forEach(function(k){ mx=Math.max(mx, pst[k].a||0); });
  [].forEach.call(el.querySelectorAll("path"), function(p){
    var n=p.getAttribute("data-pv"), s=pst[n]||{}, cls="";
    if(cov){ if(s.n){ var r=(s.v||0)/s.n; cls=r>=0.7?"c4":r>=0.4?"c3":r>=0.15?"c2":r>0?"c1":"c0"; } }
    else if(s.a){ var q=s.a/(mx||1); cls=q>0.66?"a3":q>0.33?"a2":"a1"; }
    if(ST.sel && ST.sel.kind==="prov" && ST.sel.key===n) cls+=" sel";
    p.setAttribute("class", cls);
  });
  var lb=$i("wm-lb"), h="";
  if(cov) Object.keys(pst).forEach(function(n){ var s=pst[n], f=g.by[n]; if(!f || !s.n) return; h+='<text x="'+f.c[0].toFixed(1)+'" y="'+f.c[1].toFixed(1)+'">'+Math.round(100*(s.v||0)/s.n)+'%</text>'; });
  lb.innerHTML=h;
}
function paintMarks(){
  if(!CUR || !Z) return;
  var el=$i("wm-mk"), lb=$i("wm-lb"), k=Z.k, cell=34/k, R=7/k, G={}, pts=[];
  if(lb) [].forEach.call(lb.querySelectorAll("text"), function(t){ t.setAttribute("font-size", (11/k).toFixed(3)); });
  var showAll=ST.view==="cov";
  CUR.list.forEach(function(a){
    var act=ST.day ? a.vis.filter(function(v){ return v.d<=ST.day && v.d2>=ST.day; }) : a.mon;
    if(!act.length && !showAll) return;
    if(ST.day && !act.length) return;
    var xy=xyOf(a); if(!xy) return;
    pts.push({ a:a, xy:xy, act:act });
  });
  pts.forEach(function(p){ var gx=Math.floor(p.xy[0]/cell), gy=Math.floor(p.xy[1]/cell), key=gx+"_"+gy; (G[key]=G[key]||[]).push(p); });
  var h="", sel=ST.sel && ST.sel.kind==="acc" ? ST.sel.key : "";
  Object.keys(G).forEach(function(key){
    var L2=G[key];
    if(L2.length===1 || k>=BASEK*9){
      L2.forEach(function(p){
        var a=p.a, n=p.act.length, done=p.act.some(function(v){ return v.done; }), col=SC.mgr&&ST.pic==="*" ? colorOf(a.pic) : "#3A5CAA";
        var r=n? R*(1+Math.min(0.9, Math.log(n+1)/2.2)) : R*0.62, cls="wm-m"+(n?(done?" dn":" pl"):" no")+(a.key===sel?" sel":"")+(a.ll&&a.ll.src==="prov"?" ap":"");
        h+='<circle class="'+cls+'" data-mk="'+E(a.key)+'" cx="'+p.xy[0].toFixed(2)+'" cy="'+p.xy[1].toFixed(2)+'" r="'+r.toFixed(3)+'" style="--c:'+col+'" stroke-width="'+(1.6/k).toFixed(3)+'"/>';
      });
    } else {
      var cx=0, cy=0, n2=0, dn=0; L2.forEach(function(p){ cx+=p.xy[0]; cy+=p.xy[1]; n2+=p.act.length; if(p.act.some(function(v){ return v.done; })) dn++; });
      cx/=L2.length; cy/=L2.length; var r2=R*(1.5+Math.min(1.4, Math.log(L2.length)/1.6));
      h+='<g class="wm-cl" data-mk="'+E(L2.map(function(p){ return p.a.key; }).join("\u0001"))+'" data-x="'+cx+'" data-y="'+cy+'"><circle cx="'+cx.toFixed(2)+'" cy="'+cy.toFixed(2)+'" r="'+r2.toFixed(3)+'" stroke-width="'+(1.4/k).toFixed(3)+'"/>'+
        '<text x="'+cx.toFixed(2)+'" y="'+(cy+3.6/k).toFixed(2)+'" font-size="'+(10.5/k).toFixed(3)+'">'+L2.length+'</text></g>';
    }
  });
  el.innerHTML=h;
}
function paintLegend(){
  var lg=$i("wm-lg");
  if(ST.view==="cov") lg.innerHTML='<b>'+L("Độ phủ trong tháng","Coverage this month")+'</b><span class="wm-sw c1"></span>&lt;15% <span class="wm-sw c2"></span>15–40% <span class="wm-sw c3"></span>40–70% <span class="wm-sw c4"></span>≥70%'+
    '<span class="wm-lh">'+L("= khách CRM đã gặp ÷ khách CRM trong tỉnh","= CRM accounts visited ÷ CRM accounts in the province")+'</span>';
  else lg.innerHTML='<span class="wm-dot dn"></span>'+L("Đã làm","Done")+' <span class="wm-dot pl"></span>'+L("Kế hoạch","Planned")+(SC.mgr&&ST.pic==="*"?' <span class="wm-lh">· '+L("màu = người phụ trách","colour = PIC")+'</span>':'');
  var vw=$i("wm-vw");
  vw.innerHTML='<button type="button" data-v="act" class="'+(ST.view==="act"?"on":"")+'">'+L("Hoạt động","Activity")+'</button><button type="button" data-v="cov" class="'+(ST.view==="cov"?"on":"")+'">'+L("Độ phủ","Coverage")+'</button>';
  [].forEach.call(vw.querySelectorAll("[data-v]"), function(b){ b.onclick=function(){ ST.view=b.getAttribute("data-v"); paint(); }; });
}
function paintMap(){
  if(!CUR) return;
  paintProv(); paintLegend();
  var g=GEO[ST.country];
  if(!Z && g) fit(); else paintMarks();
}

/* ───────── BẢNG BÊN ───────── */
function stats(Mo){
  var pst={}, tot={ a:0, v:0, done:0, accN:0, accV:0, prov:{} };
  Mo.list.forEach(function(a){
    var pv=a.pv||"—", s=pst[pv]=pst[pv]||{ n:0, v:0, a:0 };
    if(a.inCrm){ s.n++; tot.accN++; }
    var vm=a.mon.filter(function(v){ return v.kind==="visit" && v.done; });
    if(vm.length){ s.v++; tot.accV++; tot.prov[pv]=1; }
    s.a+=a.mon.length; tot.a+=a.mon.length; tot.done+=a.mon.filter(function(v){ return v.done; }).length; tot.v+=vm.length;
  });
  Mo.pst=pst; Mo.tot=tot; return Mo;
}
function sideHead(title, sub, extra){ return '<div class="wm-sh">'+(ST.sel?'<button class="wm-ib sm" type="button" data-bk="1" title="'+E(L("Quay lại tổng quan","Back to overview"))+'">'+svg("back")+'</button>':'')+'<div><h3>'+E(title)+'</h3>'+(sub?'<p>'+sub+'</p>':'')+'</div>'+(extra||"")+'</div>'; }
function paintSide(){
  var el=$i("wm-sc"); if(!CUR){ el.innerHTML=""; return; }
  var s=ST.sel, h;
  if(s && s.kind==="acc" && CUR.accs[s.key]) h=accHtml(CUR.accs[s.key]);
  else if(s && s.kind==="prov") h=provHtml(s.key);
  else if(s && s.kind==="fac") h=facHtml(s.fac);
  else if(s && s.kind==="day") h=dayHtml(s.key);
  else h=sumHtml();
  el.innerHTML=h;
  wireSide(el);
  ROOT.classList.toggle("wm-hasSel", !!s);
}
function kpi(n, l){ return '<div class="wm-k"><b>'+n+'</b><span>'+l+'</span></div>'; }
function sumHtml(){
  var t=CUR.tot, h=sideHead(MON(ST.month), E(SC.mgr ? (ST.pic==="*" ? L("Cả nhóm","Whole team") : ST.pic) : SC.me));
  h+='<div class="wm-ks4">'+kpi(t.a, L("Hoạt động","Activities"))+kpi(t.v, L("Lượt gặp khách","Customer visits"))+kpi(t.accV, L("Khách đã gặp","Accounts visited"))+
    kpi(t.accN?Math.round(100*t.accV/t.accN)+"%":"—", L("Độ phủ","Coverage"))+'</div>';
  if(ST.loading) h+='<p class="wm-mu">'+L("Đang tải dữ liệu…","Loading data…")+'</p>';
  var errs=teamsNow().filter(function(k){ return DB[k] && DB[k].err && !(DB[k].visits||[]).length; });
  if(errs.length) h+='<p class="wm-err">'+L("Chưa đọc được dữ liệu nhóm ","Could not read data of ")+E(errs.map(teamLb).join(", "))+'. <button type="button" class="wm-lk" data-rl="1">'+L("Thử lại","Retry")+'</button></p>';
  if(SC.mgr && ST.pic==="*"){
    var P={}; CUR.list.forEach(function(a){ a.mon.forEach(function(v){ var p=P[v.pic]=P[v.pic]||{ a:0, v:0, acc:{} }; p.a++; if(v.kind==="visit"&&v.done){ p.v++; p.acc[a.key]=1; } }); });
    var ps=picsNow(), mx=1; ps.forEach(function(p){ mx=Math.max(mx, (P[p]||{}).a||0); });
    h+='<h4>'+L("Theo nhân sự","By person")+'</h4><div class="wm-pl">'+ps.map(function(p){ var x=P[p]||{ a:0, v:0, acc:{} };
      return '<button type="button" class="wm-pr" data-p="'+E(p)+'"><i style="background:'+colorOf(p)+'">'+E(ini(p))+'</i><span class="nm">'+E(p)+'</span><span class="bar"><s style="width:'+Math.round(100*x.a/mx)+'%;background:'+colorOf(p)+'"></s></span><span class="nb">'+x.a+'</span><span class="mu">'+L(x.v+" gặp · "+Object.keys(x.acc).length+" KH", x.v+" visits · "+Object.keys(x.acc).length+" acc.")+'</span></button>'; }).join("")+'</div>';
  }
  var pv=Object.keys(CUR.pst).filter(function(k){ return k!=="—" && (CUR.pst[k].a||CUR.pst[k].v); }).sort(function(a,b){ return CUR.pst[b].a-CUR.pst[a].a; }).slice(0, 12);
  if(pv.length) h+='<h4>'+L("Tỉnh có hoạt động","Provinces with activity")+'</h4><div class="wm-lst">'+pv.map(function(n){ var s=CUR.pst[n];
    return '<button type="button" class="wm-li" data-pv="'+E(n)+'"><span class="nm">'+E(n)+'</span><span class="mu">'+s.a+' '+L("hoạt động","activities")+' · '+(s.n?Math.round(100*s.v/s.n)+'% '+L("độ phủ","coverage"):L("chưa có khách CRM","no CRM account"))+'</span></button>'; }).join("")+'</div>';
  else if(!ST.loading) h+='<p class="wm-mu">'+L("Chưa có hoạt động trong tháng này. Tìm khách hàng ở ô tìm kiếm để thêm kế hoạch.","No activity this month yet. Search an account above to add a plan.")+'</p>';
  var up=[]; CUR.cal.forEach(function(v){ if(!v.done && v.d>=today()) up.push(v); }); up.sort(function(a,b){ return a.d.localeCompare(b.d); });
  if(up.length) h+='<h4>'+L("Kế hoạch sắp tới","Upcoming plans")+'</h4><div class="wm-lst">'+up.slice(0,8).map(actRow).join("")+'</div>';
  return h;
}
function actRow(v){
  var k=accKey(v.team, v.acc, v.prov);
  return '<button type="button" class="wm-li" data-acc="'+E(k)+'"><span class="nm">'+svg(v.kind,"k-"+v.kind)+E(v.kind==="trip"?(L("Công tác ","Trip ")+(v.dest||"")):v.acc)+'</span><span class="mu">'+E(dmy(v.d))+(SC.mgr?' · '+E(v.pic):'')+' · '+E(v.st||(v.done?L("Đã làm","Done"):L("Kế hoạch","Planned")))+'</span></button>';
}
function dayHtml(d){
  var its=(calItems(CUR)[d]||[]), h=sideHead(dmy(d)+" · "+(DOW((dOf(d).getDay()+6)%7)), its.length+" "+L("việc","tasks"));
  h+=actionBar([["plan", L("Thêm kế hoạch ngày này","Add a plan on this day"), "plus", d]]);
  if(!its.length) return h+'<p class="wm-mu">'+L("Không có việc nào.","Nothing planned.")+'</p>';
  var by={}; its.forEach(function(v){ (by[v.pic]=by[v.pic]||[]).push(v); });
  Object.keys(by).forEach(function(p){
    h+='<h4><i class="wm-av" style="background:'+colorOf(p)+'">'+E(ini(p))+'</i>'+E(p)+'</h4><div class="wm-lst">'+by[p].map(function(v){
      if(v.kind==="trip") return '<div class="wm-li st"><span class="nm">'+svg("trip","k-trip")+E(v.txt||L("Công tác","Business trip"))+'</span><span class="mu">'+E(v.ap||"")+'</span></div>';
      return actRow(v); }).join("")+'</div>';
  });
  return h;
}
function provHtml(n){
  var s=CUR.pst[n]||{ n:0, v:0, a:0 }, accs=CUR.list.filter(function(a){ return a.pv===n; });
  accs.sort(function(a,b){ return (b.mon.length-a.mon.length) || ((b.vis[0]||{}).d||"").localeCompare((a.vis[0]||{}).d||""); });
  var h=sideHead(n, (s.n?L(s.v+" / "+s.n+" khách CRM đã gặp trong tháng",s.v+" / "+s.n+" CRM accounts visited this month"):L("Chưa có khách CRM","No CRM account yet"))+' · '+s.a+' '+L("hoạt động","activities"));
  var acts=[]; if(tripOk()) acts.push(["trip", L("Đề xuất công tác tới "+n,"Propose a business trip to "+n), "trip", n]);
  acts.push(["find", L("Tìm cơ sở y tế ở tỉnh này","Find facilities in this province"), "search", n]);
  h+=actionBar(acts);
  h+='<div class="wm-lst">'+accs.slice(0,80).map(function(a){ var v=a.vis[0];
    return '<button type="button" class="wm-li" data-acc="'+E(a.key)+'"><span class="nm">'+(a.mon.length?'<i class="wm-ok"></i>':'<i class="wm-no"></i>')+E(a.name)+'</span><span class="mu">'+E([a.type, SC.mgr?a.pic:""].filter(String).join(" · "))+(v?' · '+L("lần cuối ","last ")+E(dmy(v.d)):' · '+L("chưa có lượt","no visit yet"))+'</span></button>'; }).join("")+'</div>';
  if(accs.length>80) h+='<p class="wm-mu">+'+(accs.length-80)+'</p>';
  return h;
}
function actionBar(list){ return '<div class="wm-acts">'+list.map(function(a, i){ return '<button type="button" class="wm-ab'+(i===0?" pri":"")+'" data-act="'+a[0]+'" data-arg="'+E(a[3]==null?"":a[3])+'">'+svg(a[2])+'<span>'+E(a[1])+'</span></button>'; }).join("")+'</div>'; }
function tripOk(){ try{ return typeof window.tripProposeOpen==="function" && !(team(curTeamKey())||{}).noTrip; }catch(_){ return false; } }
function sameTeam(k){ try{ return curTeamKey()===k; }catch(_){ return false; } }
function accHtml(a){
  var sub=E([a.type, a.pv||a.prov, a.code].filter(String).join(" · "))+(SC.mgr&&a.pic?' · PIC '+E(a.pic):'')+(a.ll&&a.ll.src==="prov"?' · <span class="wm-mu">'+L("vị trí gần đúng (tâm tỉnh)","approximate location (province centre)")+'</span>':'');
  var h=sideHead(a.name, sub);
  var v0=a.vis.filter(function(v){ return v.photo; })[0];
  if(v0) h+='<a class="wm-ph" href="'+E(v0.photoBig||v0.photo)+'" target="_blank" rel="noopener"><img src="'+E(v0.photo)+'" alt="" loading="lazy"><span>'+E(dmy(v0.d))+'</span></a>';
  var acts=[];
  if(sameTeam(a.team)) acts.push(["plan", L("Thêm kế hoạch","Add a plan"), "plus", a.key]);
  else acts.push(["team", L("Mở nhóm "+teamLb(a.team)+" để thêm kế hoạch","Open team "+teamLb(a.team)+" to add a plan"), "plus", a.team]);
  if(tripOk() && a.pv) acts.push(["trip", L("Đề xuất công tác tới "+a.pv,"Propose a trip to "+a.pv), "trip", a.pv]);
  if(a.inCrm && sameTeam(a.team)) acts.push(["crm", L("Mở hồ sơ trong CRM","Open the CRM profile"), "open", a.key]);
  h+=actionBar(acts);
  h+=fuHtml(a);
  var mo=a.vis.length;
  h+='<h4>'+L("Hoạt động","Activities")+' <span class="wm-mu">'+L(mo+" lượt · "+CFG.HIST_MONTHS+" tháng gần nhất", mo+" · last "+CFG.HIST_MONTHS+" months")+'</span></h4>';
  if(!a.vis.length) h+='<p class="wm-mu">'+L("Chưa có hoạt động nào.","No activity yet.")+'</p>';
  h+='<ol class="wm-tl2">'+a.vis.slice(0,40).map(function(v){
    var res=v.result||"", st=v.st||(v.done?L("Đã làm","Done"):L("Kế hoạch","Planned"));
    return '<li class="'+(v.done?"dn":"pl")+'"><div class="hd">'+svg(v.kind,"k-"+v.kind)+'<b>'+E(dmy(v.d))+'</b><span>'+E(v.ta||L(KIND[v.kind].vi,KIND[v.kind].en))+'</span><span class="st">'+E(st)+'</span>'+(SC.mgr?'<span class="mu">'+E(v.pic)+'</span>':'')+'</div>'+
      (v.plan?'<div class="ln"><i>'+L("Kế hoạch","Plan")+'</i>'+E(short2(v.plan, 400))+'</div>':'')+
      (res?'<div class="ln"><i>'+L("Kết quả","Result")+'</i><span class="pre">'+E(short2(res, 700))+'</span></div>':'')+
      (v.fb?'<div class="ln"><i>'+L("Phản hồi","Feedback")+'</i>'+E(v.fb)+'</div>':'')+
      (v.next?'<div class="ln"><i>'+L("Bước tiếp theo","Next step")+'</i>'+E(short2(v.next, 300))+'</div>':'')+
      (v.stop?'<div class="ln"><i>'+L("Lý do dừng","Stop reason")+'</i>'+E(v.stop)+'</div>':'')+
      '</li>'; }).join("")+'</ol>';
  return h;
}
function facHtml(f){
  var c=ST.country, h=sideHead(f.n, E([f.tl, f.p, f.own==="tn"?L("Tư nhân","Private"):f.own==="cl"?L("Công lập","Public"):""].filter(String).join(" · "))+(f.a?'<br>'+E(f.a):''));
  if(f.th) h+='<p class="wm-mu">'+E(f.th)+'</p>';
  var crm=CUR.list.filter(function(a){ return a.inCrm && (nk(a.name)===f.nk || (f.nk.length>=6 && nk(a.name).indexOf(f.nk)>=0)); });
  if(crm.length) h+='<h4>'+L("Đã có trong CRM","Already in the CRM")+'</h4><div class="wm-lst">'+crm.map(function(a){ return '<button type="button" class="wm-li" data-acc="'+E(a.key)+'"><span class="nm">'+E(a.name)+'</span><span class="mu">'+E([a.type,a.prov,a.pic].filter(String).join(" · "))+'</span></button>'; }).join("")+'</div>';
  var acts=[["newacc", L("Thêm vào CRM và lên kế hoạch","Add to the CRM and plan a visit"), "plus", f.id]];
  if(tripOk() && f.p) acts.push(["trip", L("Đề xuất công tác tới "+f.p,"Propose a trip to "+f.p), "trip", f.p]);
  h+=actionBar(acts);
  h+='<p class="wm-mu">'+L("Nguồn: ","Source: ")+(c==="vn"?L("danh mục cơ sở y tế của Tender Map (OpenStreetMap, KQTT)","Tender Map facility list (OpenStreetMap, tender results)"):"OpenStreetMap")+'</p>';
  return h;
}
/* ── theo dõi thầu / mua sắm (Surgical VN: Tender Map · Thailand Dental: FOLLOW UP) ── */
function fuOf(a){
  var d=DB[a.team]; if(!d || !d.fu || !d.fu.length) return null;
  var C=d.fuCols, ix=function(n){ return C.indexOf(n); }, an=nk(a.name), cur={};
  d.fu.forEach(function(r){ var id=r[ix("id")], h=nk(r[ix("hosp")]), code=ix("code")>=0?r[ix("code")]:"";
    if(!(h===an || (a.code && code===a.code) || (an.length>=6 && h.length>=6 && (h.indexOf(an)>=0 || an.indexOf(h)>=0)))) return;
    var o={}; C.forEach(function(k,i){ o[k]=r[i]; }); cur[id]=o; });
  return Object.keys(cur).map(function(k){ return cur[k]; }).sort(function(x,y){ return String(y.at).localeCompare(String(x.at)); });
}
function fuHtml(a){
  var d=DB[a.team]||{}; if(!d.fuKind) return "";
  var L2=fuOf(a)||[], th=d.fuKind==="th", open=L2.filter(function(o){ var s=+o.stage; return (s>=1&&s<=5)||(s>=11&&s<=14); });
  var h='<h4>'+L("Theo dõi thầu / mua sắm","Tender / purchase follow-up")+' <span class="wm-mu">'+L(open.length+" đang theo dõi",open.length+" open")+'</span></h4>';
  h+=L2.length?'<div class="wm-lst">'+L2.map(function(o){ var s=+o.stage, cls=(s===7||s===15)?"won":(s===8||s===18)?"lost":(s===9||s===10||s===19)?"stop":"run";
    return '<div class="wm-fu '+cls+'"'+(th?' data-fu="'+E(o.id)+'"':'')+'><b>'+E(o.pkg||o.ptype||L("Gói / cơ hội","Opportunity"))+'</b><span class="stg">'+E(o.stageName||"")+'</span>'+
      '<span class="mu">'+E([o.ptype, o.value?Number(o.value).toLocaleString(EN()?"en-US":"vi-VN")+(th?" THB":" đ"):"", o.due?L("mốc ","next ")+dmy(toIso(o.due)):""].filter(String).join(" · "))+'</span>'+
      (o.note?'<span class="nt">'+E(short2(o.note, 220))+'</span>':'')+'<span class="mu">'+E(String(o.at||"").slice(0,16))+' · '+E(o.pic||"")+'</span></div>'; }).join("")+'</div>'
    : '<p class="wm-mu">'+L("Chưa có gói / cơ hội nào.","No follow-up yet.")+'</p>';
  if(th && sameTeam(a.team)) h+='<button type="button" class="wm-ab" data-act="fu" data-arg="">'+svg("flag")+'<span>'+L("Thêm theo dõi","New follow-up")+'</span></button>';
  if(!th) h+='<a class="wm-ab" target="_blank" rel="noopener" href="'+E(CFG.TENDER_MAP+"?v=fu#"+encodeURIComponent(a.pv||a.prov)+"/"+encodeURIComponent(a.name))+'">'+svg("open")+'<span>'+L("Cập nhật trên Tender Map","Update on Tender Map")+'</span></a>';
  return h;
}
function wireSide(el){
  [].forEach.call(el.querySelectorAll("[data-bk]"), function(b){ b.onclick=function(){ ST.sel=null; ST.day=""; paint(); }; });
  [].forEach.call(el.querySelectorAll("[data-rl]"), function(b){ b.onclick=function(){ loadAll(true); }; });
  [].forEach.call(el.querySelectorAll("[data-pv]"), function(b){ b.onclick=function(){ pick("prov", b.getAttribute("data-pv")); }; });
  [].forEach.call(el.querySelectorAll("[data-acc]"), function(b){ b.onclick=function(){ pick("acc", b.getAttribute("data-acc")); }; });
  [].forEach.call(el.querySelectorAll(".wm-pr[data-p]"), function(b){ b.onclick=function(){ ST.pic=b.getAttribute("data-p"); ST.sel=null; paint(); }; });
  [].forEach.call(el.querySelectorAll("[data-fu]"), function(b){ b.onclick=function(){ fuForm(CUR.accs[ST.sel.key], b.getAttribute("data-fu")); }; });
  [].forEach.call(el.querySelectorAll("[data-act]"), function(b){ b.onclick=function(){ act(b.getAttribute("data-act"), b.getAttribute("data-arg")); }; });
}

/* ───────── THAO TÁC (dùng lại form của CRM) ───────── */
function act(kind, arg){
  try{
    if(kind==="plan"){
      var a=CUR.accs[arg], iso0=ST.day && ST.day>=today() ? ST.day : (/^\d{4}-\d{2}-\d{2}$/.test(arg)?arg:"");
      planFor(a, iso0); return;
    }
    if(kind==="team"){ try{ sessionStorage.setItem("mmh_wm_reopen", JSON.stringify(ST.sel||{})); }catch(_){} close(false); if(window.switchTeam) switchTeam(arg); return; }
    if(kind==="trip"){ tripTo(arg); return; }
    if(kind==="crm"){ var b=CUR.accs[arg]; close(false); if(window.openAcc) openAcc(b.code, b.name); return; }
    if(kind==="find"){ var q=$i("wm-q"); q.value=arg; ST.q=arg; q.focus(); paintQ(true); return; }
    if(kind==="newacc"){ var f=ST.sel && ST.sel.fac; if(f) newAcc(f); return; }
    if(kind==="fu"){ fuForm(CUR.accs[ST.sel.key], ""); return; }
  }catch(e){ try{ toast(String(e && e.message || e), "err"); }catch(_){} }
}
function planFor(a, d){
  if(typeof window.formWeekly!=="function") return;
  var accStr=a ? (a.inCrm && window.mkAcc ? mkAcc({ name:a.name, type:a.type, province:a.prov, area:a.area }) : (a.vis[0]&&a.vis[0].raw)||a.name) : "";
  formWeekly(null, accStr);
  afterForm(function(){
    var st=$i("nt_start"); if(st && d){ st.value=d; try{ st.dispatchEvent(new Event("change", { bubbles:true })); }catch(_){} }
    var ta=$i("nt_typeAction"); if(ta && !ta.value){ [].some.call(ta.options, function(o){ if(/visit/i.test(o.value)){ ta.value=o.value; return true; } return false; }); }
  });
  watchSave();
}
function afterForm(fn){ var n=0; (function w(){ if($i("nt_start") || n++>30) return fn(); setTimeout(w, 80); })(); }
function tripTo(prov){
  if(!tripOk()) return;
  var d=ST.day && ST.day>=today() ? ST.day : "";
  tripProposeOpen(d);
  var n=0; (function w(){
    var m=window.MS && MS.dest;
    if(m && $i("ms-i-dest")){ var opt=(m.opts||[]).filter(function(x){ return nk(x)===nk(prov) || nk(x).indexOf(nk(prov))>=0; })[0] || prov;
      if((m.sel||[]).map(nk).indexOf(nk(opt))<0) m.sel.push(opt); try{ msPaint("dest"); }catch(_){} return; }
    if(n++<120) setTimeout(w, 150);
  })();
  watchSave();
}
function newAcc(f){
  if(typeof window.openNewAccount!=="function") return;
  openNewAccount({ name:f.n, withCbc:true, onDone:function(c){ setTimeout(function(){ try{ formWeekly(null, mkAcc(c)); afterForm(function(){ if(ST.day && ST.day>=today() && $i("nt_start")) $i("nt_start").value=ST.day; }); watchSave(); }catch(_){} }, 350); } });
  setTimeout(function(){
    var pv=$i("na_province"), ty=$i("na_type"), want=nk(f.p||""), old=nk(f.o||"");
    if(pv) [].some.call(pv.options, function(o){ var v=nk(o.value); if(v && (v===want || v===old || provOf(o.value, ST.country)===f.p)){ pv.value=o.value; try{ pv.dispatchEvent(new Event("change", { bubbles:true })); }catch(_){} return true; } return false; });
    if(ty){ var re=f.t==="d" ? /dental|nha khoa|clinic/i : /hospital|bệnh viện|benh vien|bv/i; [].some.call(ty.options, function(o){ if(o.value && re.test(o.value)){ ty.value=o.value; return true; } return false; }); }
  }, 250);
}
/* sau khi form của CRM đóng ⇒ đọc lại dữ liệu nhóm hiện tại (ghi ngầm qua hàng đợi ⇒ chờ vài giây) */
var WS=0;
function watchSave(){
  clearInterval(WS); var seen=false;
  WS=setInterval(function(){ var on=!!document.querySelector("#ov.on,#ov2.on"); if(on) seen=true; else if(seen){ clearInterval(WS); setTimeout(function(){ var k=curTeamKey(); if(DB[k]) DB[k].at=0; if(ST.open) loadAll(true); }, 4500); } }, 400);
}
/* follow-up Thailand Dental: form nhỏ trong #ov của CRM */
function fuForm(a, id){
  if(!a || typeof window.openModal!=="function") return;
  var d=DB[a.team]||{}, prev=id ? (fuOf(a)||[]).filter(function(o){ return o.id===id; })[0] : null, S0=d.fuStages||[];
  var st=function(lo, hi){ var o=""; for(var i=lo;i<=hi;i++) if(S0[i]) o+='<option value="'+i+'"'+(prev&&+prev.stage===i?" selected":"")+'>'+E(S0[i])+'</option>'; return o; };
  var body='<div class="fld"><label>Account</label><input class="inp" value="'+E(a.name)+'" readonly></div>'+
    '<div class="fld"><label>Opportunity / tender name</label><input class="inp" id="wmfu_pkg" value="'+E(prev?prev.pkg:"")+'" placeholder="e.g. Composite 2027 tender"></div>'+
    '<div class="row"><div class="fld"><label>Products</label><input class="inp" id="wmfu_pt" value="'+E(prev?prev.ptype:"")+'" placeholder="e.g. JIZAI, DIA-BURS"></div>'+
    '<div class="fld"><label>Est. quantity</label><input class="inp" id="wmfu_q" inputmode="numeric" value="'+E(prev?prev.qty:"")+'"></div>'+
    '<div class="fld"><label>Est. value (THB)</label><input class="inp" id="wmfu_v" inputmode="numeric" value="'+E(prev?prev.value:"")+'"></div></div>'+
    '<div class="row"><div class="fld"><label>Stage <span class="rq">*</span></label><select class="inp" id="wmfu_s"><option value="">— choose —</option><optgroup label="Public tender">'+st(1,10)+'</optgroup><optgroup label="Private purchase">'+st(11,19)+'</optgroup></select></div>'+
    '<div class="fld"><label>Next date</label><input class="inp" type="date" id="wmfu_d" value="'+E(prev?toIso(prev.due):"")+'"></div></div>'+
    '<div class="fld"><label>Situation</label><textarea class="inp" id="wmfu_n" placeholder="What happened, who decides, next step">'+E(prev?prev.note:"")+'</textarea></div>'+
    '<div class="hint">Saved to sheet FOLLOW UP of the Thailand Dental CRM file — every update is a new row, the history is kept.</div>';
  openModal(prev?"Update follow-up":"New follow-up", body, '<button class="btn" onclick="closeModal()">Cancel</button><div style="flex:1"></div><button class="btn pri" id="wmfu_ok">Save</button>', false);
  $i("wmfu_ok").onclick=function(){
    var s=$i("wmfu_s").value; if(!s){ try{ toast("Please choose a stage","warn"); }catch(_){} return; }
    var b=$i("wmfu_ok"); b.disabled=true; b.textContent="Saving…";
    var q={ action:"fuSave", rid:"wmfu"+Date.now()+Math.floor(Math.random()*1e4), hosp:a.name, code:a.code||"", prov:a.prov||"", pkg:$i("wmfu_pkg").value, ptype:$i("wmfu_pt").value,
      qty:$i("wmfu_q").value, value:$i("wmfu_v").value, stage:s, due:$i("wmfu_d").value, note:$i("wmfu_n").value };
    if(prev) q["case"]=prev.id;
    jp(team(a.team).url, q, 60000).then(function(j){
      if(!j || j.ok===false) throw new Error((j&&j.error)||"Error");
      var rec=j.rec; if(rec){ d.fu=(d.fu||[]).concat([rec]); if(!d.fuCols||!d.fuCols.length) d.fuCols=j.cols; }
      closeModal(); try{ toast("Follow-up saved","ok"); }catch(_){} paintSide();
    }).catch(function(e){ b.disabled=false; b.textContent="Save"; try{ toast(String(e && e.message || e), "err"); }catch(_){} });
  };
}

/* ───────── TÌM KIẾM ───────── */
function search(q){
  var w=nw(q); if(w.length<2) return [];
  var parts=w.split(" "), out=[], c=ST.country, seen={};
  function sc(t){ var s=0; for(var i=0;i<parts.length;i++){ var p=parts[i]; if(t.indexOf(p)<0) return -1; s+=(t.indexOf(" "+p)>=0||t.indexOf(p)===0)?2:1; } return s; }
  (CUR?CUR.list:[]).forEach(function(a){ var s=sc(nw(a.name+" "+a.prov+" "+(a.pv||"")+" "+a.code)); if(s>=0){ out.push({ k:"acc", a:a, s:s+3+(a.mon.length?1:0) }); seen[nk(a.name)]=1; } });
  var g=GEO[c]; if(g) g.feats.forEach(function(f){ var s=sc(nw(f.n+" "+f.th)); if(s>=0) out.push({ k:"prov", n:f.n, s:s+4 }); });
  (CAT[c]||[]).forEach(function(f){ if(seen[f.nk]) return; var s=sc(f.k+" "+nw(f.p+" "+(f.o||""))); if(s>=0) out.push({ k:"fac", f:f, s:s+(f.t==="bv"||f.t==="h"?1:0) }); });
  out.sort(function(x,y){ return y.s-x.s; });
  return out.slice(0, 40);
}
function paintQ(force){
  var r=$i("wm-qr"), L2=search(ST.q);
  if(!L2.length){ r.hidden=!(force || nw(ST.q).length>=2); r.innerHTML='<div class="wm-qe">'+L("Không tìm thấy","Nothing found")+'</div>'; if(nw(ST.q).length<2) r.hidden=true; return; }
  r.innerHTML=L2.map(function(x, i){
    if(x.k==="acc") return '<button type="button" class="wm-qo" data-i="'+i+'"><b>'+E(x.a.name)+'</b><span>'+E([x.a.type, x.a.pv||x.a.prov].filter(String).join(" · "))+'</span><em class="crm">CRM'+(SC.mgr&&x.a.pic?" · "+E(x.a.pic):"")+'</em></button>';
    if(x.k==="prov") return '<button type="button" class="wm-qo" data-i="'+i+'"><b>'+E(x.n)+'</b><span>'+L("Tỉnh / thành","Province")+'</span><em>'+svg("map")+'</em></button>';
    return '<button type="button" class="wm-qo" data-i="'+i+'"><b>'+E(x.f.n)+'</b><span>'+E([x.f.tl, x.f.p].filter(String).join(" · "))+'</span><em class="cat">'+L("Danh mục","Directory")+'</em></button>';
  }).join("");
  r.hidden=false;
  [].forEach.call(r.querySelectorAll("[data-i]"), function(b){ b.onclick=function(){ var x=L2[+b.getAttribute("data-i")]; r.hidden=true;
    if(x.k==="acc") pick("acc", x.a.key); else if(x.k==="prov") pick("prov", x.n); else pick("fac", x.f); }; });
}

/* ───────── CHỌN ───────── */
function pick(kind, key){
  if(kind==="fac"){ ST.sel={ kind:"fac", fac:key }; paintSide(); flyTo(key.lat!==""&&key.lat!=null ? GEO[ST.country].P(+key.lng, +key.lat) : (GEO[ST.country].by[key.p]||{}).c, 6); facPin(key); openSheet(); return; }
  ST.sel={ kind:kind, key:key };
  if(kind==="acc"){ var a=CUR.accs[key]; if(!a) return; var xy=xyOf(a); if(xy) flyTo(xy, 5); }
  if(kind==="prov"){ var f=GEO[ST.country].by[key]; if(f) fit(f.bb, 40); }
  paintSide(); paintProv(); paintMarks(); openSheet();
}
function facPin(f){ var g=$i("wm-mk"); if(!g || f.lat===""||f.lat==null) return; var xy=GEO[ST.country].P(+f.lng, +f.lat), k=Z.k;
  g.insertAdjacentHTML("beforeend", '<circle class="wm-m fac" cx="'+xy[0].toFixed(2)+'" cy="'+xy[1].toFixed(2)+'" r="'+(8/k).toFixed(3)+'" stroke-width="'+(2/k).toFixed(3)+'"/>'); }
function flyTo(xy, mult){ if(!xy || !Z) return; var g=GEO[ST.country], b=box(), k0=Math.min(b.w/(g.bb[2]-g.bb[0]), b.h/(g.bb[3]-g.bb[1])), k=Math.max(Z.k, k0*(mult||5));
  Z={ k:k, x:b.w/2-k*xy[0], y:b.h/2-k*xy[1] }; apply(true); }
function openSheet(){ if(window.matchMedia && matchMedia("(max-width: 760px)").matches){ ST.sheet=true; ROOT.classList.add("wm-up"); } }

/* ───────── VẼ ───────── */
function paintLoad(){ var l=$i("wm-ld"); if(!l) return; l.hidden=!ST.loading; l.textContent=L("Đang đọc dữ liệu…","Loading data…"); }
function paint(){
  if(!ST.open) return;
  CUR=stats(model());
  paintFlt(); paintCal(CUR); paintMap(); paintSide(); paintLoad();
  if(ST.q && !$i("wm-qr").hidden) paintQ();
}
function prep(){ return Promise.all([geoReady(ST.country), catReady(ST.country)]).then(function(){ Z=null; var el=$i("wm-pv"); if(el) el.setAttribute("data-c",""); }); }

/* ───────── MỞ / ĐÓNG ───────── */
function open(){
  if(!window.S || !S.user) return;
  SC=scope(); build(); i18nStatic();
  if(!ST.country || SC.countries.indexOf(ST.country)<0) ST.country=SC.countries.indexOf("vn")>=0?"vn":SC.countries[0];
  if(!SC.mgr){ ST.team="*"; ST.pic="*"; }
  ST.open=true; ROOT.classList.add("on"); document.documentElement.classList.add("wm-on");
  try{ sessionStorage.setItem("mmh_wm_seen","1"); }catch(_){}
  paintFlt(); ST.loading=true; paintLoad();
  prep().then(function(){
    var re=null; try{ re=JSON.parse(sessionStorage.getItem("mmh_wm_reopen")||"null"); sessionStorage.removeItem("mmh_wm_reopen"); }catch(_){}
    return loadAll().then(function(){ if(re && re.kind==="acc" && CUR && CUR.accs[re.key]) pick("acc", re.key); });
  });
  paintBtn();
}
function close(user){
  ST.open=false; if(ROOT) ROOT.classList.remove("on","wm-up"); document.documentElement.classList.remove("wm-on"); tipHide();
  if(user){ try{ sessionStorage.setItem("mmh_wm_crm","1"); }catch(_){} }
  paintBtn();
}

/* ───────── NÚT TRÊN THANH TRÊN CÙNG + TỰ MỞ SAU KHI ĐĂNG NHẬP ───────── */
function paintBtn(){
  var h=document.querySelector("#app header"); if(!h) return;
  var b=$i("wmBtn");
  if(!b){ b=document.createElement("button"); b.type="button"; b.className="tb2"; b.id="wmBtn"; b.onclick=function(){ ST.open?close(true):open(); };
    var at=$i("rhn-btn")||$i("updBtn")||$i("btnHelp")||$i("btnUser"); if(at) h.insertBefore(b, at); else h.appendChild(b); }
  b.innerHTML=svg("map")+"<span>Working Map</span>"; b.title=L("Bản đồ + lịch làm việc","Map + work calendar");
}
function ready(){ try{ var a=$i("app"); return !!(a && a.classList.contains("on") && window.S && S.user && S.user.pic && !document.querySelector("#login.on")); }catch(_){ return false; } }
(function wait(){
  if(ready()){
    paintBtn();
    var auto=true; try{ auto=!sessionStorage.getItem("mmh_wm_seen") || !!sessionStorage.getItem("mmh_wm_reopen"); }catch(_){}
    if(auto && !window.__tourOn && !window.__WM_NOAUTO) setTimeout(function(){ if(!ST.open && !window.__tourOn) open(); }, 600);
    return;
  }
  setTimeout(wait, 700);
})();
/* điện thoại: Thêm ▸ Working Map */
(function hookMore(){
  var mo=window.V30 && V30.more; if(!mo){ return setTimeout(hookMore, 1500); }
  V30.more=function(){ var r=mo.apply(this, arguments);
    try{ var box0=document.getElementById("v30-more"); if(box0 && !box0.querySelector("[data-wm]")){ var g=box0.querySelector(".gt"); var b=document.createElement("button"); b.setAttribute("data-wm","1"); b.className="wm-more-b";
      b.innerHTML=svg("map")+"<span>Working Map</span>"; b.onclick=function(){ try{ V30.close && V30.close(); }catch(_){} var ov=document.getElementById("v30-more"); if(ov) ov.classList.remove("on"); open(); };
      if(g && g.parentNode) g.parentNode.insertBefore(b, g); else box0.appendChild(b); } }catch(_){}
    return r; };
})();
/* đang chạy hướng dẫn của CRM ⇒ đóng bản đồ để không che phần tử */
setInterval(function(){ if(ST.open && window.__tourOn && !window.__wmTour) close(false); }, 800);

window.WM={ open:open, close:close, state:function(){ return ST; }, data:function(){ return DB; }, scope:function(){ return scope(); }, model:function(){ return CUR; },
  pick:pick, search:search, provOf:provOf, ver:VER, cfg:CFG };
})();
