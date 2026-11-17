/* ═════════ MMH CRM · TRỢ LÝ QUẢN LÝ v1.0 (17/11/2026, người dùng yêu cầu) ═════════
   Trang riêng cho quản lý (manager/) — hỏi bằng GIỌNG NÓI · GÕ · BẤM CHỌN, trả lời bằng chữ + bảng gọn trên màn hình.
   · Miễn phí, không token / API key: nhận giọng nói bằng trình duyệt (Web Speech API, vi-VN / en-US); câu hỏi hiểu bằng từ khoá + mẫu câu (parse);
     số liệu tính trên máy từ backend CRM sẵn có — chỉ ĐỌC: visitFeed · tfTrips · orderPending (all=1) · ordList (Dental Thái) · naList · rpStatus.
   · Đăng nhập dùng chung phiên CRM (localStorage mmh_tk, cùng trang github.io); chưa có ⇒ email + mật khẩu / mã email (Training Hub rhAuth*).
   · Phạm vi xem: manager/scope.js (MGR_SCOPE). Nhóm Thái ⇒ giao diện tiếng Anh mặc định (nút VI / EN).
   API test: window.MGR = { ask(text), parse(text), data(), state(), load(force) } */
(function(){
"use strict";
var VER = "1.0";
var HUB = "https://script.google.com/macros/s/AKfycbwsX4cQEoH4LNlmcNfe8qWIM9K6EiDEXy7PjhP9bHY2citL6xHn5L1unsAlQJHyL9EP/exec";
/* backend CRM từng nhóm — GIỐNG TEAMS trong index.html (đổi URL ở đó thì đổi cả ở đây) */
var TEAMS = {
  dental:   { c:"vn", vi:"Dental", en:"Dental VN", cur:"VND", ord:"vn", photo:true, rp:true,
              url:"https://script.google.com/macros/s/AKfycbyzmhECZZfbOZUyXOK5O70ukwTgQ9DHp70MN-HUAL0wMpOptdTTbaGcvMEmcnCrCji6/exec" },
  surgical: { c:"vn", vi:"Surgical", en:"Surgical VN", cur:"VND", ord:"vn", photo:true, rp:true,
              url:"https://script.google.com/macros/s/AKfycbxxckrqwkfhE0fszm1XVdpYyEHU_PCKQWMKE_2wBnMTgoJCZ-1nRZ_fhOCPXXsVfEE/exec" },
  eyeless:  { c:"vn", vi:"Eyeless", en:"Eyeless", cur:"VND", ord:"vn", photo:true, rp:true,
              url:"https://script.google.com/macros/s/AKfycbxsoTRbRWZRaf-z7-xRy_oIkM-Yv1HoCOjVRO-K6oRRh3Dr7MMg4v53K0qqpMfZ_K5IAg/exec" },
  thai:     { c:"th", vi:"Surgical Thái", en:"Thailand Surgical", cur:"THB", ord:"", photo:false, rp:false,
              url:"https://script.google.com/macros/s/AKfycbwglPhfcC3y20-lPO8mRC7yapGUyVHSO2Mp3k4fyPJXnraQEu6bbO4dysL0E9MNadwHwg/exec" },
  thaid:    { c:"th", vi:"Dental Thái", en:"Thailand Dental", cur:"THB", ord:"th", photo:false, rp:false,
              url:"https://script.google.com/macros/s/AKfycbwEvi4Y2rnLKwR0JKaqJKNCiHgyS6SEY473dEM9meSGHZ8B6b4tVka5jB4ppEAEPPHQ/exec" }
};
/* nhân sự Sales từng nhóm (chỉ tên — như ROLES của CRM); người mới tự thêm từ dữ liệu */
var ROSTER = { dental:["Viet","Phuong","Vinh"], surgical:["Viet Ha","Khang"], eyeless:["Trang"], thai:["Dao","Miew"], thaid:["Yong","Man","Sui"] };
var TTL = 5*60000, GAP = 15;

/* ───────── tiện ích ───────── */
var LANG = "vi";
function L(vi, en){ return LANG === "en" ? en : vi; }
function E(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function nw(s){ return " "+String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()+" "; }
function nk(s){ return nw(s).replace(/\s+/g,""); }
function $(id){ return document.getElementById(id); }
function lsG(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
function lsS(k, v){ try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k, v); }catch(_){} }
function pad(n){ return (n<10?"0":"")+n; }
function iso(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function dOf(s){ var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(s||"")); return m ? new Date(+m[1], +m[2]-1, +m[3]) : null; }
function today(){ return iso(new Date()); }
function addD(s, n){ var d=dOf(s); d.setDate(d.getDate()+n); return iso(d); }
function monday(s){ var d=dOf(s), w=(d.getDay()+6)%7; d.setDate(d.getDate()-w); return iso(d); }
function mStart(y, m){ return iso(new Date(y, m, 1)); }
function mEnd(y, m){ return iso(new Date(y, m+1, 0)); }
function toIso(v){
  var s=String(v==null?"":v).trim(); if(!s) return "";
  var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s); if(m) return m[1]+"-"+m[2]+"-"+m[3];
  m=/^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s); if(m) return m[3]+"-"+pad(+m[2])+"-"+pad(+m[1]);
  var d=new Date(s); return isNaN(d) ? "" : iso(d);
}
function dm(s){ var d=dOf(s); return d ? pad(d.getDate())+"/"+pad(d.getMonth()+1) : ""; }
function dmy(s){ var d=dOf(s); return d ? pad(d.getDate())+"/"+pad(d.getMonth()+1)+"/"+d.getFullYear() : ""; }
function money(v, cur){
  v=+v||0; if(!v) return "—";
  if(cur==="THB") return "฿"+Math.round(v).toLocaleString("en-US");
  if(Math.abs(v)>=1e9) return (v/1e9).toFixed(2).replace(/\.?0+$/,"").replace(".",",")+L(" tỷ"," bn");
  if(Math.abs(v)>=1e6) return (v/1e6).toFixed(1).replace(/\.0$/,"").replace(".",",")+L(" tr"," m");
  return Math.round(v).toLocaleString("vi-VN");
}
function picEq(a, b){ return !!nk(a) && nk(a)===nk(b); }
function teamLb(k){ var t=TEAMS[k]; return t ? (LANG==="en"?t.en:t.vi) : k; }
function uniq(a){ var s={}, o=[]; a.forEach(function(x){ var k=nk(x); if(k && !s[k]){ s[k]=1; o.push(x); } }); return o; }
function snip(s, n){ s=String(s||"").replace(/\s+/g," ").trim(); return s.length>n ? s.slice(0, n-1)+"…" : s; }

/* ───────── phiên đăng nhập (chung với CRM / Report Hub / Tender Map) ───────── */
function sess(){
  var o=null; try{ o=JSON.parse(lsG("mmh_tk")||"null"); }catch(_){}
  if(!o || !o.tk || !o.user || !o.user.pic) return null;
  if(o.exp && Date.now()>o.exp){ lsS("mmh_tk", null); return null; }
  return o;
}
function me(){ var s=sess(); return s ? s.user : null; }

/* ───────── gọi Apps Script: fetch không cookie trước, hỏng ⇒ thẻ <script> (JSONP) ───────── */
var SEQ=0;
function qs(p){ return Object.keys(p).map(function(k){ return encodeURIComponent(k)+"="+encodeURIComponent(p[k]==null?"":p[k]); }).join("&"); }
function jsonp(url, ms){
  return new Promise(function(res, rej){
    var cb="__mgr_"+Date.now()+"_"+(++SEQ), s=document.createElement("script");
    var t=setTimeout(function(){ done(); rej(new Error("timeout")); }, ms);
    function done(){ clearTimeout(t); try{ delete window[cb]; }catch(_){ window[cb]=undefined; } if(s.parentNode) s.parentNode.removeChild(s); }
    window[cb]=function(d){ done(); res(d); };
    s.onerror=function(){ done(); rej(new Error("load")); };
    s.src=url+"&callback="+cb; document.body.appendChild(s);
  });
}
function api(url, params, ms){
  ms=ms||60000;
  var s=sess(), p=Object.assign({}, params||{});
  if(s){ p.tk=s.tk; if(!("pic" in p)) p.pic=s.user.pic; }
  p._ts=Date.now();
  var full=url+"?"+qs(p);
  var ctl=window.AbortController?new AbortController():null, to=setTimeout(function(){ if(ctl) ctl.abort(); }, ms);
  return fetch(full, { credentials:"omit", signal:ctl?ctl.signal:undefined })
    .then(function(r){ clearTimeout(to); if(!r.ok) throw new Error("HTTP "+r.status); return r.text(); })
    .then(function(t){ var m=String(t||"").trim().replace(/^[^{[]*/, "").replace(/\);?\s*$/, ""); return JSON.parse(m); })
    .catch(function(){ clearTimeout(to); return jsonp(full, ms); })
    .then(function(j){ if(j && j.code==="AUTH" && /phiên|session|đăng nhập|sign/i.test(String(j.error||""))) AUTH_BAD=true; return j; });
}
var AUTH_BAD=false;

/* ───────── TẢI DỮ LIỆU ───────── */
var DB={};      /* DB[team] = { at, from, to, visits, trips, orders, na, rp, err:{} } */
var SCOPE=[];
function kindOf(ta, tt){
  var a=nw(ta)+" "+nw(tt);
  if(/visit/.test(a)) return "visit";
  if(/ tele| call| phone| dien thoai| goi /.test(a)) return "call";
  if(/ mess| zalo| email| e mail| chat| line | tin nhan/.test(a)) return "msg";
  if(/ present| event| workshop| seminar| training| dao tao| hoi thao| demo| thuyet trinh| su kien/.test(a)) return "event";
  return "other";
}
function stOf(s){ var x=nw(s); return /complete|hoan thanh| done |finish/.test(x) ? "done" : /cancel|huy|dung lai|stop/.test(x) ? "cancel" : "open"; }
function accName(a){ return String(a||"").split("/")[0].trim(); }
function normVisit(w, k){
  var acc=String(w.accName||"").trim() || accName(w.account);
  var d=toIso(w.start), d2=toIso(w.finish)||d;
  return { team:k, pic:String(w.pic||"").trim(), d:d, d2:d2, acc:acc, type:String(w.accType||w.type||""), prov:String(w.accProv||w.province||""),
    ta:String(w.typeAction||""), kind:kindOf(w.typeAction, w.typeTask), st:stOf(w.status), stRaw:String(w.status||""),
    plan:String(w.plan||""), result:String(w.result||""), fb:String(w.feedback||""), next:String(w.nextAction||""),
    photo:!!String(w.photo||"").trim(), t:String(w.shotAt||w.upAt||""), up:!w.shotAt && !!w.upAt, gps:gpsOf(w.gps), tbd:/^tbd\b/i.test(acc) };
}
function gpsOf(g){ var m=/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/.exec(String(g||"")); return m ? [+m[1], +m[2]] : null; }
function normTrip(t, k){
  var txt=String(t.subTask||""), m=/(?:Đi công tác|Business trip)\s+(.+?)\s+·/i.exec(txt);
  return { team:k, pic:String(t.pic||""), d:toIso(t.start), d2:toIso(t.planned)||toIso(t.start), dest:m?m[1]:"", ap:String(t.approval||""), st:String(t.status||""), txt:txt };
}
function win(){ var n=new Date(); return { from:mStart(n.getFullYear(), n.getMonth()-1), to:addD(today(), 45) }; }
function loadTeam(k, need, force){
  var t=TEAMS[k], d=DB[k], w=win();
  if(need){ if(need.from<w.from) w.from=need.from; if(need.to>w.to) w.to=need.to; }
  if(d && d.busy) return d.busy;
  if(!force && d && d.at && Date.now()-d.at<TTL && d.from<=w.from && d.to>=w.to) return Promise.resolve(d);
  var nd={ at:Date.now(), from:w.from, to:w.to, visits:[], trips:[], orders:[], na:[], rp:null, err:{} };
  var pics=ROSTER[k].slice(), rq=[];
  function fail(part){ return function(e){ nd.err[part]=String(e&&e.message||e||"error"); }; }
  rq.push(api(t.url, { action:"visitFeed", from:w.from, to:w.to, pic:"" }, 90000).then(function(j){
    if(!j || j.ok===false) throw new Error((j&&j.error)||"visitFeed");
    nd.visits=(j.rows||[]).map(function(r){ return normVisit(r, k); }).filter(function(v){ return v.d && v.pic && !/^test/i.test(v.pic); });
    pics=uniq(pics.concat(nd.visits.map(function(v){ return v.pic; })));
  }).catch(fail("visits")).then(function(){
    return api(t.url, { action:"tfTrips", pics:JSON.stringify(pics) }, 60000).then(function(j){
      nd.trips=((j&&(j.trips||j.rows))||[]).map(function(r){ return normTrip(r, k); }).filter(function(x){ return x.d; });
    }).catch(fail("trips"));
  }));
  if(t.ord==="vn") rq.push(api(t.url, { action:"orderPending", all:1 }, 60000).then(function(j){
    if(!j || j.ok===false) throw new Error((j&&j.error)||"orderPending");
    var out=[]; (j.groups||[]).forEach(function(g){ (g.orders||[]).forEach(function(o){ out.push({ team:k, key:o.key, no:String(o.orderNo||""), pic:String(o.pic||g.pic||""),
      day:toIso(o.day), month:String(o.month||g.month||""), acc:String(o.account||""), amount:+o.amount||0, appr:String(o.appr||""), note:String(o.apprNote||""),
      lines:(o.lines||[]).length, warn:(o.warn||[]).length?o.warn:[] }); }); });
    nd.orders=out;
  }).catch(fail("orders")));
  if(t.ord==="th") rq.push(api(t.url, { action:"ordList" }, 60000).then(function(j){
    var by={}, out=[];
    ((j&&j.rows)||[]).forEach(function(r){ var key=String(r.orderNo||"")+"|"+nk(r.account); var g=by[key];
      if(!g){ g=by[key]={ team:k, key:key, no:String(r.orderNo||""), pic:String(r.pic||""), day:toIso(r.day), month:String(r.month||""), acc:accName(r.account), amount:0, appr:"", note:"", lines:0, warn:[] }; out.push(g); }
      g.amount+=+r.amount||0; g.lines++; });
    nd.orders=out;
  }).catch(fail("orders")));
  rq.push(api(t.url, { action:"naList" }, 60000).then(function(j){
    if(!j || j.ok===false) throw new Error((j&&j.error)||"naList");
    nd.na=(j.rows||[]).map(function(o){ return { team:k, id:o.id, pic:String(o.pic||""), type:String(o.type||""), acc:String(o.account||""), month:String(o.month||""),
      st:String(o.status||""), created:toIso(o.created), dec:toIso(o.decAt), sub:toIso(o.subAt), kpi:String(o.kpi||"") }; });
  }).catch(fail("na")));
  if(t.rp) rq.push(api(t.url, { action:"rpStatus" }, 45000).then(function(j){ if(j && j.ok) nd.rp={ sent:j.sent||{}, since:String(j.since||"") }; }).catch(fail("rp")));
  var p=Promise.all(rq).then(function(){ nd.pics=uniq(ROSTER[k].concat(nd.visits.map(function(v){ return v.pic; }), nd.trips.map(function(v){ return v.pic; }))); DB[k]=nd; return nd; });
  if(d) d.busy=p; else DB[k]={ busy:p };
  return p.then(function(x){ if(DB[k]) delete DB[k].busy; return x; });
}
function loadAll(teams, need, force){
  var n=0;
  progress(0, teams.length);
  return Promise.all(teams.map(function(k){ return loadTeam(k, need, force).then(function(x){ progress(++n, teams.length); return x; }); }));
}

/* ───────── HIỂU CÂU HỎI ───────── */
function period(k, a){
  var t=today(), n=new Date(), y=n.getFullYear(), m=n.getMonth();
  switch(k){
    case "today":     return { k:k, from:t, to:t, lb:L("Hôm nay","Today")+" ("+dm(t)+")" };
    case "yesterday": var yd=addD(t,-1); return { k:k, from:yd, to:yd, lb:L("Hôm qua","Yesterday")+" ("+dm(yd)+")" };
    case "tomorrow":  var tm=addD(t,1); return { k:k, from:tm, to:tm, lb:L("Ngày mai","Tomorrow")+" ("+dm(tm)+")" };
    case "week":      var w0=monday(t); return { k:k, from:w0, to:addD(w0,6), lb:L("Tuần này","This week")+" ("+dm(w0)+"–"+dm(addD(w0,6))+")" };
    case "lastweek":  var w1=addD(monday(t),-7); return { k:k, from:w1, to:addD(w1,6), lb:L("Tuần trước","Last week")+" ("+dm(w1)+"–"+dm(addD(w1,6))+")" };
    case "nextweek":  var w2=addD(monday(t),7); return { k:k, from:w2, to:addD(w2,6), lb:L("Tuần sau","Next week")+" ("+dm(w2)+"–"+dm(addD(w2,6))+")" };
    case "month":     return { k:k, from:mStart(y,m), to:mEnd(y,m), lb:L("Tháng này","This month")+" ("+pad(m+1)+"/"+y+")" };
    case "lastmonth": var lm=new Date(y,m-1,1); return { k:k, from:mStart(y,m-1), to:mEnd(y,m-1), lb:L("Tháng trước","Last month")+" ("+pad(lm.getMonth()+1)+"/"+lm.getFullYear()+")" };
    case "nextmonth": var nm=new Date(y,m+1,1); return { k:k, from:mStart(y,m+1), to:mEnd(y,m+1), lb:L("Tháng sau","Next month")+" ("+pad(nm.getMonth()+1)+"/"+nm.getFullYear()+")" };
    case "upcoming":  return { k:k, from:t, to:addD(t,45), lb:L("Sắp tới (45 ngày)","Upcoming (45 days)") };
    case "days":      var dd=addD(t,-(a-1)); return { k:k, from:dd, to:t, lb:L(a+" ngày gần đây",a===1?"Today":"Last "+a+" days")+" ("+dm(dd)+"–"+dm(t)+")" };
    case "mon":       var yy=a>m+3?y-1:y; return { k:k, from:mStart(yy,a-1), to:mEnd(yy,a-1), lb:L("Tháng ","Month ")+pad(a)+"/"+yy };
  }
  return null;
}
var RX = {
  photo:  / anh | bat thuong| canh bao| photo| alert| 15 phut/,
  order:  / don hang| don | order| duyet don/,
  na:     / mo moi| sku moi| dai ly moi| khach hang moi| new account| new sku| new customer/,
  trip:   / cong tac| business trip| trip/,
  report: / bao cao tuan| chua gui| gui bao cao| weekly report| report| bao cao /,
  plan:   / ke hoach| lich | lich lam| sap toi| du kien| plan| schedule| upcoming| tuan sau| tuan toi| next week| ngay mai| tomorrow/,
  visit:  / dia ban| di tham| tham | visit| gap khach| hoat dong| activit| goi dien| cuoc goi| lam gi| khach /,
  over:   / tong hop| tong quan| tinh hinh| tom tat| overview| summary| status| tat ca| moi nhom| cac nhom/
};
function parse(text){
  var s=nw(text), q={ text:text, topic:"", per:null, team:"", pic:"", f:{} };
  /* nhóm */
  if(/ dental thai| thai dental| thailand dental| nha khoa thai/.test(s)) q.team="thaid";
  else if(/ surgical thai| thai surgical| thailand surgical| ngoai khoa thai| nhan khoa thai/.test(s)) q.team="thai";
  else if(/ thai lan| thailand| thai /.test(s)) q.team="th";
  else if(/ eyeless| kim lien chi/.test(s)) q.team="eyeless";
  else if(/ surgical| nhan khoa| ngoai khoa/.test(s)) q.team="surgical";
  else if(/ dental| nha khoa/.test(s)) q.team="dental";
  /* người: tên dài trước ("Viet Ha" trước "Viet") */
  var names=[]; SCOPE.forEach(function(k){ names=names.concat(ROSTER[k], (DB[k]&&DB[k].pics)||[]); });
  uniq(names).sort(function(a, b){ return nk(b).length-nk(a).length; }).some(function(p){
    var re=new RegExp(nw(p).replace(/ /g, "\\s").replace(/\\s$/,"")+"\\s"); if(re.test(s)){ q.pic=p; return true; } return false; });
  /* thời gian */
  var m;
  if(/ hom nay| today| ngay hom nay/.test(s)) q.per=period("today");
  else if(/ hom qua| yesterday/.test(s)) q.per=period("yesterday");
  else if(/ ngay mai| tomorrow/.test(s)) q.per=period("tomorrow");
  else if(/ tuan truoc| tuan roi| last week/.test(s)) q.per=period("lastweek");
  else if(/ tuan sau| tuan toi| next week/.test(s)) q.per=period("nextweek");
  else if(/ tuan nay| this week| trong tuan/.test(s)) q.per=period("week");
  else if(/ thang truoc| thang roi| last month/.test(s)) q.per=period("lastmonth");
  else if(/ thang sau| thang toi| next month/.test(s)) q.per=period("nextmonth");
  else if(/ thang nay| this month| trong thang/.test(s)) q.per=period("month");
  else if((m=/ thang (\d{1,2}) /.exec(s)) && +m[1]>=1 && +m[1]<=12) q.per=period("mon", +m[1]);
  else if((m=/ (\d{1,3}) ngay (qua|gan day|vua qua) | last (\d{1,3}) days /.exec(s))) q.per=period("days", Math.min(120, +(m[1]||m[3])));
  else if(/ sap toi| upcoming| coming/.test(s)) q.per=period("upcoming");
  /* cờ */
  q.f.pending=/ cho duyet| chua duyet| pending| waiting| can duyet/.test(s);
  q.f.overdue=/ qua han| tre han| overdue| late | chua lam| chua hoan thanh| not done/.test(s);
  q.f.notSent=/ chua gui| not sent| missing| ai chua/.test(s);
  /* chủ đề */
  var spec=["photo","order","na","trip","report","plan","visit"].filter(function(k){ return RX[k].test(s); });
  if(spec.indexOf("report")>=0 && RX.over.test(s) && !/ bao cao tuan| chua gui| weekly report/.test(s)) spec.splice(spec.indexOf("report"), 1);
  if(spec.indexOf("plan")>=0 && spec.indexOf("trip")>=0) spec.splice(spec.indexOf("plan"), 1);
  if(spec.indexOf("visit")>=0 && spec.length>1) spec.splice(spec.indexOf("visit"), 1);
  q.topic=spec[0] || (RX.over.test(s) || !s.trim() ? "over" : "");
  if(!q.topic && (q.pic || q.team)) q.topic="over";
  if(!q.topic && q.per) q.topic="visit";
  return q;
}

/* ───────── TRẢ LỜI ───────── */
var UI={ team:"*", pic:"*" };
function teamsOf(q){
  var t=q.team==="th" ? ["thai","thaid"] : q.team ? [q.team] : UI.team!=="*" ? [UI.team] : SCOPE.slice();
  return t.filter(function(k){ return SCOPE.indexOf(k)>=0; });
}
function picOf(q){ return q.pic || (UI.pic!=="*" ? UI.pic : ""); }
function inPer(x, per){ return !per || ((x.d2||x.d)>=per.from && x.d<=per.to); }
function okPic(x, p){ return !p || picEq(x.pic, p); }
function picsOf(teams, p){
  if(p) return [p];
  var out=[]; teams.forEach(function(k){ out=out.concat((DB[k]&&DB[k].pics)||ROSTER[k]); });
  return uniq(out);
}
function teamOfPic(p, teams){ for(var i=0;i<teams.length;i++){ var d=DB[teams[i]]; if(((d&&d.pics)||ROSTER[teams[i]]).some(function(x){ return picEq(x, p); })) return teams[i]; } return teams[0]; }
function scopeLb(teams, p){
  var a=[]; if(p) a.push(p);
  a.push(teams.length===SCOPE.length && SCOPE.length>1 ? L("Mọi nhóm","All teams") : teams.map(teamLb).join(" · "));
  return a.join(" · ");
}
function chip(txt, q, cls){ return '<button type="button" class="mg-chip'+(cls?" "+cls:"")+'" data-q="'+E(q)+'">'+E(txt)+'</button>'; }
function tbl(head, rows, num){
  if(!rows.length) return "";
  return '<div class="mg-tw"><table class="mg-t"><thead><tr>'+head.map(function(h, i){ return '<th'+(num&&num[i]?' class="n"':'')+'>'+E(h)+'</th>'; }).join("")+'</tr></thead><tbody>'+
    rows.map(function(r){ return '<tr'+(r.cls?' class="'+r.cls+'"':'')+(r.q?' data-q="'+E(r.q)+'"':'')+'>'+r.c.map(function(c, i){ return '<td'+(num&&num[i]?' class="n"':'')+'>'+c+'</td>'; }).join("")+'</tr>'; }).join("")+'</tbody></table></div>';
}
function errNote(teams, parts){
  var bad=[]; teams.forEach(function(k){ var d=DB[k]; if(!d||!d.err) return; parts.forEach(function(p){ if(d.err[p]) bad.push(teamLb(k)); }); });
  bad=uniq(bad); return bad.length ? '<p class="mg-warn">'+E(L("Chưa đọc được dữ liệu của: ","Could not read data of: ")+bad.join(", "))+'</p>' : "";
}
function card(title, sub, body, follow){
  return '<div class="mg-a"><div class="mg-ah"><b>'+E(title)+'</b>'+(sub?'<span>'+E(sub)+'</span>':'')+'</div>'+body+
    (follow&&follow.length?'<div class="mg-fol">'+follow.join("")+'</div>':'')+'</div>';
}
function stLb(v){ return v.st==="done" ? '<span class="mg-s ok">'+E(L("Xong","Done"))+'</span>' : v.st==="cancel" ? '<span class="mg-s no">'+E(L("Huỷ","Cancelled"))+'</span>'
  : (v.d2<today() ? '<span class="mg-s late">'+E(L("Quá hạn","Overdue"))+'</span>' : '<span class="mg-s plan">'+E(L("Kế hoạch","Planned"))+'</span>'); }
function kindLb(k){ return { visit:L("Đi địa bàn","Visit"), call:L("Gọi điện","Call"), msg:L("Nhắn tin","Message"), event:L("Thuyết trình / sự kiện","Presentation / event"), other:L("Việc khác","Other") }[k]||k; }
function firstLine(r){
  var s=String(r||""), m=/1\.\s*(?:Actions Taken|Hành động)[^:]*:\s*([^\n]*)/i.exec(s); if(m && m[1].trim()) return m[1];
  return s.split(/\n/).filter(function(x){ return x.trim() && !/^(Người gặp|Person met)/i.test(x); })[0]||"";
}
function detailList(items, max){
  if(!items.length) return "";
  max=max||40;
  var h=items.slice(0, max).map(function(v){
    return '<details class="mg-it"><summary><span class="mg-d">'+dm(v.d)+'</span><span class="mg-p">'+E(v.pic)+'</span><span class="mg-ac">'+E(v.acc||"—")+'</span>'+
      '<span class="mg-k">'+E(v.ta||kindLb(v.kind))+'</span>'+stLb(v)+'</summary><div class="mg-ibd">'+
      (v.prov?'<div><i>'+E(L("Tỉnh","Province"))+'</i> '+E(v.prov)+'</div>':'')+
      (v.plan?'<div><i>'+E(L("Kế hoạch","Plan"))+'</i> '+E(snip(v.plan, 300))+'</div>':'')+
      (v.result?'<div><i>'+E(L("Kết quả","Result"))+'</i> '+E(snip(v.result, 600))+'</div>':'')+
      (v.fb?'<div><i>'+E(L("Phản hồi","Feedback"))+'</i> '+E(v.fb)+'</div>':'')+
      (v.next?'<div><i>'+E(L("Bước tiếp theo","Next action"))+'</i> '+E(v.next)+'</div>':'')+'</div></details>'; }).join("");
  return '<div class="mg-list">'+h+(items.length>max?'<p class="mg-more">'+E(L("… và "+(items.length-max)+" mục khác. Hỏi theo từng người để xem đủ.","… and "+(items.length-max)+" more. Ask per person to see all."))+'</p>':'')+'</div>';
}

/* 1. Đi địa bàn / hoạt động */
function ansVisit(q){
  var teams=teamsOf(q), p=picOf(q), per=q.per||period("week"), t=today();
  var all=[]; teams.forEach(function(k){ all=all.concat(((DB[k]&&DB[k].visits)||[]).filter(function(v){ return okPic(v, p) && inPer(v, per) && !v.tbd; })); });
  if(q.f.overdue) all=all.filter(function(v){ return v.st==="open" && v.d2<t; });
  all.sort(function(a, b){ return b.d.localeCompare(a.d) || a.pic.localeCompare(b.pic); });
  var by={}; picsOf(teams, p).forEach(function(x){ by[nk(x)]={ pic:x, vd:0, od:0, pl:0, late:0, cn:0, acc:{} }; });
  all.forEach(function(v){ var o=by[nk(v.pic)]||(by[nk(v.pic)]={ pic:v.pic, vd:0, od:0, pl:0, late:0, cn:0, acc:{} });
    if(v.st==="done"){ if(v.kind==="visit"){ o.vd++; o.acc[nk(v.acc)]=1; } else o.od++; }
    else if(v.st==="cancel") o.cn++;
    else if(v.d2<t) o.late++; else o.pl++; });
  var list=Object.keys(by).map(function(k){ return by[k]; }).sort(function(a, b){ return b.vd-a.vd || b.od-a.od || a.pic.localeCompare(b.pic); });
  var S={ vd:0, od:0, pl:0, late:0, acc:0 }; list.forEach(function(o){ S.vd+=o.vd; S.od+=o.od; S.pl+=o.pl; S.late+=o.late; S.acc+=Object.keys(o.acc).length; });
  var zero=list.filter(function(o){ return !o.vd && !o.od; }).map(function(o){ return o.pic; });
  var sum='<p class="mg-sum">'+(q.f.overdue
    ? E(L("Có "+all.length+" việc quá hạn chưa hoàn thành.","There are "+all.length+" overdue tasks not completed."))
    : E(L(S.vd+" lượt đi địa bàn đã hoàn thành ("+S.acc+" khách), "+S.od+" hoạt động khác (gọi, nhắn, thuyết trình), "+S.pl+" kế hoạch chưa tới hạn, "+S.late+" việc quá hạn.",
          S.vd+" visits completed ("+S.acc+" accounts), "+S.od+" other activities (calls, messages, presentations), "+S.pl+" planned, "+S.late+" overdue.")))+'</p>';
  if(!q.f.overdue && list.length>1 && list[0].vd) sum+='<p class="mg-sum">'+E(L("Nhiều nhất: ","Most visits: ")+list[0].pic+" ("+list[0].vd+")")+(zero.length?' · '+E(L("Chưa có hoạt động hoàn thành: ","No completed activity: ")+zero.join(", ")):"")+'</p>';
  var rows=list.map(function(o){ return { q:L("Đi địa bàn của ","Visits of ")+o.pic+" "+per.lb.replace(/\s*\(.*$/,"").toLowerCase(), cls:(!o.vd&&!o.od)?"z":"",
    c:[E(o.pic), String(o.vd), String(Object.keys(o.acc).length), String(o.od), String(o.pl), o.late?'<b class="mg-late">'+o.late+'</b>':"0"] }; });
  var body=sum+errNote(teams, ["visits"])+tbl([L("Người","Person"), L("Đi địa bàn","Visits"), L("Số khách","Accounts"), L("HĐ khác","Other"), L("Kế hoạch","Planned"), L("Quá hạn","Overdue")], rows, [0,1,1,1,1,1])+
    '<h4>'+E(L("Chi tiết","Details"))+' ('+all.length+')</h4>'+(all.length?detailList(all):'<p class="mg-empty">'+E(L("Không có hoạt động nào.","No activity."))+'</p>');
  var fol=[chip(L("Tuần trước","Last week"), L("Đi địa bàn tuần trước","Visits last week")), chip(L("Việc quá hạn","Overdue"), L("Việc quá hạn chưa làm","Overdue tasks")), chip(L("Kế hoạch tuần sau","Plan next week"), L("Kế hoạch tuần sau","Plan for next week"))];
  return card(L("Đi địa bàn & hoạt động","Field visits & activities"), per.lb+" · "+scopeLb(teams, p), body, fol);
}
/* 2. Kế hoạch (đi địa bàn chưa làm + công tác) */
function ansPlan(q){
  var teams=teamsOf(q), p=picOf(q), per=q.per||period("nextweek");
  var vs=[], tr=[];
  teams.forEach(function(k){ var d=DB[k]||{};
    vs=vs.concat((d.visits||[]).filter(function(v){ return okPic(v, p) && inPer(v, per) && v.st==="open"; }));
    tr=tr.concat((d.trips||[]).filter(function(x){ return okPic(x, p) && inPer(x, per); })); });
  vs.sort(function(a, b){ return a.d.localeCompare(b.d); }); tr.sort(function(a, b){ return a.d.localeCompare(b.d); });
  var by={}; picsOf(teams, p).forEach(function(x){ by[nk(x)]={ pic:x, v:0, t:0, acc:{} }; });
  vs.forEach(function(v){ var o=by[nk(v.pic)]||(by[nk(v.pic)]={ pic:v.pic, v:0, t:0, acc:{} }); o.v++; o.acc[nk(v.acc)]=1; });
  tr.forEach(function(x){ var o=by[nk(x.pic)]||(by[nk(x.pic)]={ pic:x.pic, v:0, t:0, acc:{} }); o.t++; });
  var list=Object.keys(by).map(function(k){ return by[k]; }).sort(function(a, b){ return b.v-a.v || a.pic.localeCompare(b.pic); });
  var none=list.filter(function(o){ return !o.v && !o.t; }).map(function(o){ return o.pic; });
  var body='<p class="mg-sum">'+E(L(vs.length+" lượt đi địa bàn / hoạt động đã lên kế hoạch, "+tr.length+" chuyến công tác.", vs.length+" planned visits / activities, "+tr.length+" business trips."))+
    (none.length?' '+E(L("Chưa có kế hoạch: ","No plan yet: ")+none.join(", ")+"."):"")+'</p>'+
    tbl([L("Người","Person"), L("Kế hoạch","Planned"), L("Số khách","Accounts"), L("Công tác","Trips")], list.map(function(o){ return { cls:(!o.v&&!o.t)?"z":"", c:[E(o.pic), String(o.v), String(Object.keys(o.acc).length), String(o.t)] }; }), [0,1,1,1])+
    (tr.length?'<h4>'+E(L("Công tác","Business trips"))+'</h4>'+tripRows(tr):'')+
    '<h4>'+E(L("Lịch đi địa bàn","Planned visits"))+' ('+vs.length+')</h4>'+(vs.length?detailList(vs):'<p class="mg-empty">'+E(L("Chưa có kế hoạch nào.","No plans."))+'</p>');
  return card(L("Kế hoạch","Plans"), per.lb+" · "+scopeLb(teams, p), errNote(teams, ["visits","trips"])+body,
    [chip(L("Kế hoạch tuần này","Plan this week"), L("Kế hoạch tuần này","Plan this week")), chip(L("Công tác sắp tới","Upcoming trips"), L("Công tác sắp tới","Upcoming business trips"))]);
}
function apLb(a){ var s=nw(a); return /approved| da duyet| approve /.test(s) ? '<span class="mg-s ok">'+E(L("Đã duyệt","Approved"))+'</span>' : /reject| tu choi/.test(s) ? '<span class="mg-s no">'+E(L("Từ chối","Rejected"))+'</span>'
  : '<span class="mg-s plan">'+E(L("Chờ duyệt","Waiting"))+'</span>'; }
function tripRows(tr){
  return tbl([L("Ngày","Dates"), L("Người","Person"), L("Nơi đến","Destination"), L("Phê duyệt","Approval")], tr.map(function(x){
    var on=x.d<=today() && x.d2>=today();
    return { cls:on?"on":"", c:[dm(x.d)+(x.d2&&x.d2!==x.d?"–"+dm(x.d2):""), E(x.pic), E(x.dest||snip(x.txt, 60))+(on?' <span class="mg-s ok">'+E(L("Đang đi","On trip"))+'</span>':''), apLb(x.ap)] }; }));
}
/* 3. Công tác */
function ansTrip(q){
  var teams=teamsOf(q), p=picOf(q), per=q.per||period("upcoming"), t=today();
  var tr=[]; teams.forEach(function(k){ tr=tr.concat(((DB[k]&&DB[k].trips)||[]).filter(function(x){ return okPic(x, p) && inPer(x, per); })); });
  tr.sort(function(a, b){ return a.d.localeCompare(b.d); });
  var on=tr.filter(function(x){ return x.d<=t && x.d2>=t; }), wait=tr.filter(function(x){ return !/approved| da duyet/.test(nw(x.ap)) && !/reject| tu choi/.test(nw(x.ap)); });
  var body='<p class="mg-sum">'+E(L(tr.length+" chuyến công tác.", tr.length+" business trips."))+
    (on.length?' '+E(L("Đang đi: ","On a trip now: ")+on.map(function(x){ return x.pic+(x.dest?" ("+x.dest+L(", đến ",", until ")+dm(x.d2)+")":""); }).join("; ")+"."):"")+
    (wait.length?' '+E(L(wait.length+" chuyến chưa được duyệt.", wait.length+" not approved yet.")):"")+'</p>'+errNote(teams, ["trips"])+
    (tr.length?tripRows(tr):'<p class="mg-empty">'+E(L("Không có chuyến công tác nào.","No business trips."))+'</p>');
  return card(L("Công tác","Business trips"), per.lb+" · "+scopeLb(teams, p), body,
    [chip(L("Tháng này","This month"), L("Công tác tháng này","Business trips this month")), chip(L("Tháng trước","Last month"), L("Công tác tháng trước","Business trips last month"))]);
}
/* 4. Đơn hàng */
function ansOrder(q){
  var teams=teamsOf(q).filter(function(k){ return TEAMS[k].ord; }), p=picOf(q);
  if(!teams.length) return card(L("Đơn hàng","Sales orders"), scopeLb(teamsOf(q), p), '<p class="mg-empty">'+E(L("Nhóm này không ghi đơn hàng trên CRM.","This team does not log sales orders in the CRM."))+'</p>');
  var pend=q.f.pending || !q.per, per=q.per||period("month");
  var os=[]; teams.forEach(function(k){ os=os.concat(((DB[k]&&DB[k].orders)||[]).filter(function(o){ return okPic(o, p); })); });
  var body="", cur=function(o){ return TEAMS[o.team].cur; };
  if(pend){
    var w=os.filter(function(o){ return o.appr==="wait"; }).sort(function(a, b){ return String(a.day).localeCompare(String(b.day)); });
    var sumV={}; w.forEach(function(o){ sumV[cur(o)]=(sumV[cur(o)]||0)+o.amount; });
    body+='<p class="mg-sum">'+E(L(w.length+" đơn đang chờ duyệt", w.length+" orders waiting for approval"))+(w.length?" · "+E(Object.keys(sumV).map(function(c){ return money(sumV[c], c); }).join(" + ")):"")+'.</p>'+
      tbl([L("Ngày đặt","Order date"), L("Người","Person"), L("Khách","Account"), L("Giá trị","Amount"), L("Tình trạng","Status")], w.map(function(o){
        var sent=/đã gửi xác nhận|sent for/i.test(o.note), need=/cần bổ sung/i.test(o.note);
        return { c:[dm(o.day)||"—", E(o.pic), E(o.acc)+(o.no?' <small>'+E(o.no)+'</small>':''), money(o.amount, cur(o)),
          need?'<span class="mg-s late">'+E(L("Yêu cầu chỉnh sửa","Changes requested"))+'</span>':sent?'<span class="mg-s plan">'+E(L("Đã gửi xác nhận","Sent for approval"))+'</span>':'<span class="mg-s no">'+E(L("Chưa gửi xác nhận","Not sent yet"))+'</span>'] }; }), [0,0,0,1,0]);
    if(!w.length) body+='<p class="mg-empty">'+E(L("Không có đơn nào chờ duyệt.","No orders waiting."))+'</p>';
  }
  if(!pend || !q.f.pending){
    var m=os.filter(function(o){ return o.day && o.day>=per.from && o.day<=per.to && o.appr!=="no"; });
    var by={}; m.forEach(function(o){ var k=o.pic+"|"+cur(o); var x=by[k]||(by[k]={ pic:o.pic, cur:cur(o), n:0, v:0, ok:0, acc:{} }); x.n++; x.v+=o.amount; if(o.appr==="ok"||!o.appr) x.ok++; x.acc[nk(o.acc)]=1; });
    var list=Object.keys(by).map(function(k){ return by[k]; }).sort(function(a, b){ return b.v-a.v; });
    var tot={}; list.forEach(function(x){ tot[x.cur]=(tot[x.cur]||0)+x.v; });
    body+='<h4>'+E(per.lb)+'</h4><p class="mg-sum">'+E(L(m.length+" đơn (bỏ đơn bị từ chối), tổng ", m.length+" orders (rejected excluded), total "))+E(Object.keys(tot).map(function(c){ return money(tot[c], c); }).join(" + ")||"0")+'.</p>'+
      tbl([L("Người","Person"), L("Số đơn","Orders"), L("Số khách","Accounts"), L("Giá trị","Amount")], list.map(function(x){ return { c:[E(x.pic), String(x.n), String(Object.keys(x.acc).length), money(x.v, x.cur)] }; }), [0,1,1,1]);
  }
  return card(L("Đơn hàng","Sales orders"), (pend?L("Chờ duyệt","Waiting")+" · ":"")+per.lb+" · "+scopeLb(teams, p), errNote(teams, ["orders"])+body,
    [chip(L("Đơn tháng này","Orders this month"), L("Đơn hàng tháng này","Sales orders this month")), chip(L("Đơn tháng trước","Orders last month"), L("Đơn hàng tháng trước","Sales orders last month"))]);
}
/* 5. Mở mới */
function naSt(s){ var x=nw(s); return /approved/.test(x) ? '<span class="mg-s ok">'+E(L("Đã duyệt","Approved"))+'</span>' : /reject/.test(x) ? '<span class="mg-s no">'+E(L("Từ chối","Rejected"))+'</span>'
  : /pending/.test(x) ? '<span class="mg-s plan">'+E(L("Chờ duyệt","Waiting"))+'</span>' : '<span class="mg-s">'+E(L("Nháp","Draft"))+'</span>'; }
function ansNa(q){
  var teams=teamsOf(q), p=picOf(q), per=q.per||period("month");
  var ns=[]; teams.forEach(function(k){ ns=ns.concat(((DB[k]&&DB[k].na)||[]).filter(function(o){ return okPic(o, p); })); });
  var pend=ns.filter(function(o){ return /pending/i.test(o.st); });
  var ym=function(o){ var m=String(o.month||"").replace(/\D/g,""); return m.length>=6 ? m.slice(0,4)+"-"+m.slice(4,6)+"-01" : (o.dec||o.created||""); };
  var inP=ns.filter(function(o){ var d=/approved/i.test(o.st) ? (o.dec||ym(o)) : (o.sub||o.created||ym(o)); return d && d.slice(0,7)>=per.from.slice(0,7) && d.slice(0,7)<=per.to.slice(0,7); });
  var ok=inP.filter(function(o){ return /approved/i.test(o.st); });
  var body='<p class="mg-sum">'+E(L(pend.length+" hồ sơ đang chờ duyệt. "+per.lb+": "+inP.length+" hồ sơ, "+ok.length+" đã duyệt.", pend.length+" cases waiting for approval. "+per.lb+": "+inP.length+" cases, "+ok.length+" approved."))+'</p>'+errNote(teams, ["na"]);
  var rows=function(a){ return tbl([L("Ngày","Date"), L("Người","Person"), L("Khách / SKU","Account / SKU"), L("Loại","Type"), L("Tình trạng","Status")], a.map(function(o){
    return { c:[dm(o.sub||o.created)||"—", E(o.pic), E(o.acc||"—"), E(/sku/i.test(o.type)?L("SKU mới","New SKU"):L("KH / đại lý mới","New account")), naSt(o.st)] }; })); };
  if(pend.length) body+='<h4>'+E(L("Chờ duyệt","Waiting for approval"))+'</h4>'+rows(pend);
  if(inP.length) body+='<h4>'+E(per.lb)+'</h4>'+rows(inP.filter(function(o){ return pend.indexOf(o)<0; }));
  if(!pend.length && !inP.length) body+='<p class="mg-empty">'+E(L("Không có hồ sơ mở mới nào.","No new-account cases."))+'</p>';
  return card(L("Mở mới địa bàn & SKU","New accounts & SKUs"), per.lb+" · "+scopeLb(teams, p), body,
    [chip(L("Tháng trước","Last month"), L("Mở mới tháng trước","New accounts last month"))]);
}
/* 6. Báo cáo tuần */
function ansReport(q){
  var all=teamsOf(q), teams=all.filter(function(k){ return TEAMS[k].rp; }), p=picOf(q);
  var w=q.per && /week/.test(q.per.k) ? q.per : period("lastweek");
  if(!teams.length) return card(L("Báo cáo tuần","Weekly reports"), scopeLb(all, p), '<p class="mg-empty">'+E(L("Nhóm Thái chưa có dữ liệu gửi báo cáo tuần trên app này.","Weekly-report status of the Thailand teams is not available here yet."))+'</p>');
  var rows=[], miss=[];
  teams.forEach(function(k){ var d=DB[k]||{}, rp=d.rp;
    picsOf([k], p).forEach(function(x){
      var s=rp && rp.sent ? (rp.sent[x] || rp.sent[Object.keys(rp.sent).filter(function(y){ return picEq(y, x); })[0]]) : null;
      var since=rp && rp.since && rp.since>w.to;
      var ok=s && s.from>=w.from;
      if(!ok && !since) miss.push(x);
      rows.push({ cls:ok?"":"z", c:[E(x), E(teamLb(k)), ok?'<span class="mg-s ok">'+E(L("Đã gửi","Sent"))+'</span>':since?'<span class="mg-s">'+E(L("Chưa ghi nhận","Not tracked"))+'</span>':'<span class="mg-s no">'+E(L("Chưa gửi","Not sent"))+'</span>',
        E(s&&s.at?String(s.at).replace(/^(\d{4})-(\d{2})-(\d{2})/, "$3/$2"):"—")] });
    }); });
  var body='<p class="mg-sum">'+(miss.length?E(L("Chưa gửi: ","Not sent: ")+miss.join(", ")+"."):E(L("Mọi người đã gửi báo cáo tuần.","Everyone has sent the weekly report.")))+'</p>'+errNote(teams, ["rp"])+
    tbl([L("Người","Person"), L("Nhóm","Team"), L("Tình trạng","Status"), L("Gửi lúc (lần gần nhất)","Last sent")], rows);
  return card(L("Báo cáo tuần","Weekly reports"), w.lb+" · "+scopeLb(teams, p), body,
    [chip(L("Tuần này","This week"), L("Ai chưa gửi báo cáo tuần này","Who has not sent the report this week"))]);
}
/* 7. Ảnh đi địa bàn < 15 phút (như cảnh báo của CRM v35.5) */
function tMin(s){ var m=/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(s||"")); return m ? { d:m[1]+"-"+m[2]+"-"+m[3], m:(+m[4])*60+(+m[5]), hm:m[4]+":"+m[5] } : null; }
function km(a, b){ if(!a||!b) return null; var R=6371, r=Math.PI/180, dl=(b[0]-a[0])*r, dn=(b[1]-a[1])*r, x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)*Math.sin(dn/2); return 2*R*Math.asin(Math.sqrt(x)); }
function chains(rows){
  var g={}, out=[];
  rows.forEach(function(v){ if(!v.photo) return; var t=tMin(v.t); if(!t) return; var k=nk(v.pic)+"|"+t.d; (g[k]=g[k]||[]).push({ v:v, t:t }); });
  Object.keys(g).forEach(function(k){ var a=g[k].sort(function(x, y){ return x.t.m-y.t.m; }), cur=null;
    for(var i=1;i<a.length;i++){ var gap=a[i].t.m-a[i-1].t.m, diff=nk(a[i].v.acc)!==nk(a[i-1].v.acc);
      if(diff && gap<GAP){ if(!cur){ cur={ pic:a[i].v.pic, team:a[i].v.team, d:a[i].t.d, items:[a[i-1]] }; out.push(cur); } cur.items.push(a[i]); }
      else cur=null; } });
  return out.sort(function(a, b){ return b.d.localeCompare(a.d) || b.items.length-a.items.length; });
}
function ansPhoto(q){
  var all=teamsOf(q), teams=all.filter(function(k){ return TEAMS[k].photo; }), p=picOf(q), per=q.per||period("days", 7);
  if(!teams.length) return card(L("Ảnh đi địa bàn","Field photos"), scopeLb(all, p), '<p class="mg-empty">'+E(L("Nhóm này không chụp ảnh đi địa bàn.","This team does not take field photos."))+'</p>');
  var rows=[]; teams.forEach(function(k){ rows=rows.concat(((DB[k]&&DB[k].visits)||[]).filter(function(v){ return okPic(v, p) && inPer(v, per); })); });
  var cs=chains(rows);
  var body='<p class="mg-sum">'+E(cs.length ? L(cs.length+" chuỗi ảnh chụp ở các khách khác nhau cách nhau chưa đến "+GAP+" phút. Cần xem lại chất lượng các lượt thăm và xác thực thông tin cập nhật.",
    cs.length+" chains of photos at different accounts taken less than "+GAP+" minutes apart. Please review these visits and verify the updates.")
    : L("Không có ảnh nào cách nhau dưới "+GAP+" phút.","No photos taken less than "+GAP+" minutes apart."))+'</p>'+errNote(teams, ["visits"]);
  cs.forEach(function(c){
    var n=c.items.length, lv=n>=5?L("Rất bất thường","Highly unusual"):n>=3?L("Bất thường","Unusual"):L("Cần xem","Check");
    body+='<div class="mg-ch"><div class="mg-chh"><b>'+E(c.pic)+'</b> · '+dmy(c.d)+' · '+E(L(n+" ảnh trong "+(c.items[n-1].t.m-c.items[0].t.m)+" phút", n+" photos in "+(c.items[n-1].t.m-c.items[0].t.m)+" min"))+
      ' <span class="mg-s '+(n>=3?"no":"late")+'">'+E(lv)+'</span></div>'+
      tbl([L("Giờ","Time"), L("Khách","Account"), L("Cách ảnh trước","From previous")], c.items.map(function(it, i){
        var pv=c.items[i-1], dist=pv?km(pv.v.gps, it.v.gps):null;
        return { c:[it.t.hm+(it.v.up?'<small> '+E(L("(giờ tải)","(upload)"))+'</small>':''), E(it.v.acc), pv?E((it.t.m-pv.t.m)+L(" phút"," min")+(dist!=null?" · "+(dist<1?Math.round(dist*1000)+" m":dist.toFixed(1)+" km"):"")):"—"] }; }))+'</div>'; });
  return card(L("Ảnh đi địa bàn < "+GAP+" phút","Field photos < "+GAP+" min"), per.lb+" · "+scopeLb(teams, p), body,
    [chip(L("30 ngày","30 days"), L("Ảnh bất thường 30 ngày qua","Unusual photos last 30 days"))]);
}
/* 0. TỔNG HỢP — 1 bấm ra tình hình mọi nhóm */
function ansOver(q){
  var teams=teamsOf(q), p=picOf(q), t=today(), wk=period("week"), lw=period("lastweek"), mo=period("month"), p7=period("days", 7);
  var cards=teams.map(function(k){
    var d=DB[k]||{}, ok=function(x){ return okPic(x, p); };
    var vis=(d.visits||[]).filter(ok), tr=(d.trips||[]).filter(ok), os=(d.orders||[]).filter(ok), na=(d.na||[]).filter(ok);
    var td=vis.filter(function(v){ return v.d<=t && v.d2>=t && !v.tbd; }), tdDone=td.filter(function(v){ return v.st==="done"; }).length;
    var wv=vis.filter(function(v){ return inPer(v, wk) && !v.tbd; }), wDone=wv.filter(function(v){ return v.st==="done" && v.kind==="visit"; }).length,
        wPl=wv.filter(function(v){ return v.st==="open" && v.d2>=t; }).length, late=vis.filter(function(v){ return v.st==="open" && v.d2<t && v.d2>=addD(t,-30) && !v.tbd; }).length;
    var on=tr.filter(function(x){ return x.d<=t && x.d2>=t; }), up=tr.filter(function(x){ return x.d>t && x.d<=addD(t,14); });
    var ow=os.filter(function(o){ return o.appr==="wait"; }), om=os.filter(function(o){ return o.day>=mo.from && o.day<=mo.to && o.appr!=="no"; }), cur=TEAMS[k].cur;
    var nw0=na.filter(function(o){ return /pending/i.test(o.st); }), nok=na.filter(function(o){ return /approved/i.test(o.st) && (o.dec||"").slice(0,7)===t.slice(0,7); });
    var miss=[]; if(TEAMS[k].rp && d.rp){ picsOf([k], p).forEach(function(x){ var s=d.rp.sent[x]||d.rp.sent[Object.keys(d.rp.sent).filter(function(y){ return picEq(y, x); })[0]];
      if(!(s && s.from>=lw.from) && !(d.rp.since && d.rp.since>lw.to)) miss.push(x); }); }
    var ph=TEAMS[k].photo ? chains(vis.filter(function(v){ return inPer(v, p7); })).length : -1;
    var tlb=teamLb(k), line=function(lbl, val, qq, warn){ return '<div class="mg-ol'+(warn?" w":"")+'" data-q="'+E(qq)+'"><span>'+E(lbl)+'</span><b>'+val+'</b></div>'; };
    var h='<div class="mg-oc"><div class="mg-och">'+E(tlb)+(d.err&&Object.keys(d.err).length?' <span class="mg-s late" title="'+E(Object.keys(d.err).join(", "))+'">'+E(L("thiếu dữ liệu","partial"))+'</span>':'')+'</div>';
    h+=line(L("Hôm nay","Today"), E(L(td.length+" việc · "+tdDone+" xong", td.length+(td.length===1?" task · ":" tasks · ")+tdDone+" done")), L("Hoạt động hôm nay nhóm ","Activities today team ")+tlb);
    h+=line(L("Đi địa bàn tuần này","Visits this week"), E(L(wDone+" xong · "+wPl+" kế hoạch", wDone+" done · "+wPl+" planned")), L("Đi địa bàn tuần này nhóm ","Visits this week team ")+tlb);
    h+=line(L("Quá hạn (30 ngày)","Overdue (30 days)"), String(late), L("Việc quá hạn nhóm ","Overdue tasks team ")+tlb, late>0);
    h+=line(L("Công tác","Business trips"), E(L((on.length?"đang đi "+on.length+" · ":"")+up.length+" sắp tới (14 ngày)", (on.length?on.length+" on trip · ":"")+up.length+" next 14 days")), L("Công tác sắp tới nhóm ","Upcoming business trips team ")+tlb);
    if(TEAMS[k].ord){
      if(TEAMS[k].ord==="vn") h+=line(L("Đơn chờ duyệt","Orders waiting"), E(ow.length+(ow.length?" · "+money(ow.reduce(function(s, o){ return s+o.amount; }, 0), cur):"")), L("Đơn hàng chờ duyệt nhóm ","Orders waiting for approval team ")+tlb, ow.length>0);
      h+=line(L("Đơn tháng này","Orders this month"), E(om.length+" · "+money(om.reduce(function(s, o){ return s+o.amount; }, 0), cur)), L("Đơn hàng tháng này nhóm ","Sales orders this month team ")+tlb);
    }
    h+=line(L("Mở mới (tháng này)","New accounts (month)"), E(L(nw0.length+" chờ duyệt · "+nok.length+" đã duyệt", nw0.length+" waiting · "+nok.length+" approved")), L("Mở mới nhóm ","New accounts team ")+tlb, nw0.length>0);
    if(TEAMS[k].rp) h+=line(L("Báo cáo tuần trước","Last week report"), E(miss.length?L("chưa gửi: ","not sent: ")+miss.join(", "):L("đủ","all sent")), L("Ai chưa gửi báo cáo tuần trước nhóm ","Who has not sent the report last week team ")+tlb, miss.length>0);
    if(ph>=0) h+=line(L("Ảnh < 15 phút (7 ngày)","Photos < 15 min (7 days)"), String(ph), L("Ảnh bất thường nhóm ","Unusual photos team ")+tlb, ph>0);
    return h+'</div>';
  });
  return card(L("Tổng hợp tình hình","Team status"), today().split("-").reverse().join("/")+" · "+scopeLb(teams, p),
    '<p class="mg-sum">'+E(L("Bấm vào một dòng để xem chi tiết.","Click a line to see the details."))+'</p><div class="mg-og">'+cards.join("")+'</div>', []);
}
function ansHelp(text){
  return card(L("Chưa hiểu câu hỏi","I did not understand"), text?"“"+text+"”":"",
    '<p class="mg-sum">'+E(L("Thử hỏi theo mẫu: nội dung (đi địa bàn, kế hoạch, công tác, đơn hàng, mở mới, báo cáo tuần, ảnh) + thời gian (hôm nay, tuần này, tháng trước…) + tên người hoặc nhóm.",
      "Try: topic (visits, plans, business trips, orders, new accounts, weekly reports, photos) + time (today, this week, last month…) + a person or a team."))+'</p>', suggest(6));
}
var ANS={ over:ansOver, visit:ansVisit, plan:ansPlan, trip:ansTrip, order:ansOrder, na:ansNa, report:ansReport, photo:ansPhoto };
function need(q){
  var w=win(); if(q.per){ if(q.per.from<w.from) w.from=q.per.from; if(q.per.to>w.to) w.to=q.per.to; } return w;
}

/* ───────── GIAO DIỆN ───────── */
var ST={ busy:false, last:"", lst:false };
var MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
var SEND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>';
var RELOAD='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4.5h-4.5"/></svg>';
var GRID='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>';
function menu(){
  return [
    { g:L("Tổng hợp","Overview"), it:[[L("Tổng hợp mọi nhóm","Status of all teams"), L("Tổng hợp tình hình","Team status"), "pri"]] },
    { g:L("Đi địa bàn","Field visits"), it:[[L("Hôm nay","Today"), L("Hoạt động hôm nay","Activities today")], [L("Tuần này","This week"), L("Đi địa bàn tuần này","Visits this week")],
      [L("Tuần trước","Last week"), L("Đi địa bàn tuần trước","Visits last week")], [L("Tháng này","This month"), L("Đi địa bàn tháng này","Visits this month")], [L("Việc quá hạn","Overdue"), L("Việc quá hạn chưa làm","Overdue tasks")]] },
    { g:L("Kế hoạch & công tác","Plans & trips"), it:[[L("Kế hoạch tuần sau","Plan next week"), L("Kế hoạch tuần sau","Plan for next week")], [L("Kế hoạch tuần này","Plan this week"), L("Kế hoạch tuần này","Plan this week")],
      [L("Công tác sắp tới","Upcoming trips"), L("Công tác sắp tới","Upcoming business trips")], [L("Công tác tháng này","Trips this month"), L("Công tác tháng này","Business trips this month")]] },
    { g:L("Đơn hàng & mở mới","Orders & new accounts"), it:[[L("Đơn chờ duyệt","Orders waiting"), L("Đơn hàng chờ duyệt","Orders waiting for approval")], [L("Đơn tháng này","Orders this month"), L("Đơn hàng tháng này","Sales orders this month")],
      [L("Mở mới chờ duyệt","New accounts waiting"), L("Mở mới chờ duyệt","New accounts waiting for approval")], [L("Mở mới tháng này","New accounts this month"), L("Mở mới tháng này","New accounts this month")]] },
    { g:L("Báo cáo & cảnh báo","Reports & alerts"), it:[[L("Chưa gửi báo cáo tuần","Weekly report not sent"), L("Ai chưa gửi báo cáo tuần trước","Who has not sent the report last week")],
      [L("Ảnh bất thường 7 ngày","Unusual photos 7 days"), L("Ảnh bất thường 7 ngày qua","Unusual photos last 7 days")]] }
  ];
}
function menuHtml(){
  var m=menu(), top=m[0].it[0];
  return '<div class="mg-top1">'+chip(top[0], top[1], "pri")+'<span>'+E(L("Tình hình mọi nhóm trong 1 bấm","Every team in one tap"))+'</span></div><div class="mg-menu">'+m.slice(1).map(function(g){ return '<div class="mg-mg"><div class="mg-mgh">'+E(g.g)+'</div><div class="mg-mgi">'+g.it.map(function(x){ return chip(x[0], x[1], x[2]); }).join("")+'</div></div>'; }).join("")+'</div>';
}
function suggest(n){ var a=[]; menu().forEach(function(g){ g.it.forEach(function(x){ a.push(chip(x[0], x[1])); }); }); return a.slice(0, n||8); }
function shell(){
  var u=me();
  document.body.innerHTML=
    '<div id="mg"><header class="mg-top"><div class="mg-brand"><img src="../media/app/icon-192.png" alt="" onerror="this.style.display=\'none\'"><div><b>'+E(L("Trợ lý quản lý","Manager assistant"))+'</b><span>MMH CRM</span></div></div>'+
    '<div class="mg-tr"><button type="button" class="mg-tb" id="mg-lang" title="VI / EN">'+(LANG==="en"?"EN":"VI")+'</button>'+
    '<a class="mg-tb" href="../" id="mg-crm">CRM</a><button type="button" class="mg-tb mg-u" id="mg-user" title="'+E(L("Đăng xuất","Sign out"))+'">'+E(u.pic)+'</button></div></header>'+
    '<div class="mg-flt"><label><span>'+E(L("Nhóm","Team"))+'</span><select id="mg-team"></select></label><label><span>'+E(L("Người","Person"))+'</span><select id="mg-pic"></select></label>'+
    '<button type="button" class="mg-tb" id="mg-reload" title="'+E(L("Tải lại dữ liệu","Reload data"))+'">'+RELOAD+'<span>'+E(L("Làm mới","Refresh"))+'</span></button><span id="mg-prog"></span></div>'+
    '<main id="mg-log" aria-live="polite"></main>'+
    '<div class="mg-bar"><button type="button" class="mg-ib" id="mg-menu-b" title="'+E(L("Chọn câu hỏi","Pick a question"))+'">'+GRID+'</button>'+
    '<input id="mg-in" type="text" autocomplete="off" enterkeyhint="send" placeholder="'+E(L("Hỏi bằng giọng nói, gõ, hoặc bấm ô vuông để chọn…","Speak, type, or tap the grid to pick…"))+'">'+
    '<button type="button" class="mg-ib mg-mic" id="mg-mic" title="'+E(L("Nói","Speak"))+'">'+MIC+'</button><button type="button" class="mg-ib mg-send" id="mg-send" title="'+E(L("Gửi","Send"))+'">'+SEND+'</button></div></div>';
  fillFilters();
  $("mg-team").onchange=function(){ UI.team=this.value; fillFilters(); rerun(); };
  $("mg-pic").onchange=function(){ UI.pic=this.value; rerun(); };
  $("mg-reload").onclick=function(){ DB={}; loadAll(SCOPE, null, true).then(rerun); };
  $("mg-lang").onclick=function(){ LANG=LANG==="en"?"vi":"en"; lsS("mmh_mgr_lang", LANG); shell(); welcome(); };
  $("mg-user").onclick=function(){ var b=this; if(b.dataset.ask){ lsS("mmh_tk", null); location.reload(); return; } b.dataset.ask="1"; b.textContent=L("Bấm lần nữa để đăng xuất","Click again to sign out"); setTimeout(function(){ delete b.dataset.ask; b.textContent=me().pic; }, 4000); };
  $("mg-send").onclick=function(){ send(); };
  $("mg-in").onkeydown=function(e){ if(e.key==="Enter"){ e.preventDefault(); send(); } };
  $("mg-menu-b").onclick=function(){ var ex=document.querySelector("#mg-log .mg-mw"); if(ex){ ex.scrollIntoView({ behavior:"smooth", block:"end" }); return; } bot('<div class="mg-mw">'+menuHtml()+'</div>'); };
  $("mg-mic").onclick=mic;
  $("mg-log").onclick=function(e){ var el=e.target.closest("[data-q]"); if(el && !e.target.closest("summary")) ask(el.getAttribute("data-q")); };
}
function fillFilters(){
  var ts=$("mg-team"), ps=$("mg-pic"); if(!ts) return;
  ts.innerHTML='<option value="*">'+E(SCOPE.length>1?L("Mọi nhóm","All teams"):teamLb(SCOPE[0]))+'</option>'+(SCOPE.length>1?SCOPE.map(function(k){ return '<option value="'+k+'"'+(UI.team===k?" selected":"")+'>'+E(teamLb(k))+'</option>'; }).join(""):"");
  var pics=picsOf(UI.team==="*"?SCOPE:[UI.team], "");
  if(UI.pic!=="*" && !pics.some(function(x){ return picEq(x, UI.pic); })) UI.pic="*";
  ps.innerHTML='<option value="*">'+E(L("Mọi người","Everyone"))+'</option>'+pics.map(function(p){ return '<option value="'+E(p)+'"'+(picEq(UI.pic, p)?" selected":"")+'>'+E(p)+'</option>'; }).join("");
}
function progress(n, t){ var el=$("mg-prog"); if(!el) return; el.textContent=n<t ? L("Đang tải "+n+"/"+t+" nhóm…","Loading "+n+"/"+t+" teams…") : ""; if(n>=t) fillFilters(); }
function scrollEnd(){ var lg=$("mg-log"); if(lg) lg.scrollTop=lg.scrollHeight; }
function bot(html){ var d=document.createElement("div"); d.className="mg-msg b"; d.innerHTML=html; $("mg-log").appendChild(d); trim(); scrollEnd(); return d; }
function usr(text){ var d=document.createElement("div"); d.className="mg-msg u"; d.textContent=text; $("mg-log").appendChild(d); scrollEnd(); }
function trim(){ var lg=$("mg-log"), ms=lg.querySelectorAll(".mg-msg"); for(var i=0;i<ms.length-40;i++) lg.removeChild(ms[i]); }
function welcome(){
  var u=me();
  bot('<div class="mg-a"><p class="mg-hi">'+E(L("Chào "+u.pic+". Hỏi tôi về tình hình Sales của ","Hello "+u.pic+". Ask me about the sales work of "))+'<b>'+E(SCOPE.map(teamLb).join(", "))+'</b>'+
    E(L(" — bằng giọng nói (nút micro), gõ câu hỏi, hoặc bấm chọn bên dưới."," — speak (microphone button), type, or pick a question below."))+'</p>'+
    '<p class="mg-ex">'+E(L("Ví dụ: “Tuần này Viet đi địa bàn bao nhiêu khách?” · “Đơn hàng chờ duyệt” · “Ai chưa gửi báo cáo tuần trước?” · “Kế hoạch tuần sau nhóm Surgical”",
      "e.g. “Visits of Yong this week” · “Upcoming business trips” · “New accounts this month” · “Plan for next week”"))+'</p>'+
    '<div class="mg-mw">'+menuHtml()+'</div></div>');
}
function send(){ var i=$("mg-in"), t=i.value.trim(); if(!t) return; i.value=""; ask(t); }
function rerun(){ if(ST.last) ask(ST.last, true); }
function ask(text, silent){
  text=String(text||"").trim(); if(!text) return Promise.resolve();
  ST.last=text;
  if(!silent) usr(text);
  var q=parse(text), fn=ANS[q.topic];
  if(!fn){ bot(ansHelp(text)); return Promise.resolve(); }
  var wait=bot('<div class="mg-a mg-wait"><span class="mg-spin"></span>'+E(L("Đang tổng hợp…","Working on it…"))+'</div>');
  return loadAll(teamsOf(q), need(q)).then(function(){
    if(AUTH_BAD){ wait.innerHTML='<div class="mg-a"><p class="mg-warn">'+E(L("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.","Your session has expired. Please sign in again."))+'</p></div>'; lsS("mmh_tk", null); setTimeout(function(){ location.reload(); }, 2500); return; }
    try{ wait.innerHTML=fn(q); }catch(e){ wait.innerHTML='<div class="mg-a"><p class="mg-warn">'+E(L("Không tổng hợp được: ","Could not answer: ")+e.message)+'</p></div>'; }
    wait.scrollIntoView({ behavior:"smooth", block:"start" });
  });
}

/* ───────── GIỌNG NÓI (Web Speech API — miễn phí, chạy trong trình duyệt) ───────── */
var REC=null;
function mic(){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition, b=$("mg-mic"), inp=$("mg-in");
  if(!SR){ bot('<div class="mg-a"><p class="mg-sum">'+E(L("Trình duyệt này chưa hỗ trợ nói trực tiếp. Bấm vào ô câu hỏi rồi bấm biểu tượng micro trên bàn phím điện thoại để đọc, hoặc mở bằng Chrome.",
    "This browser cannot listen directly. Tap the question box and use the microphone key of your phone keyboard, or open the page in Chrome."))+'</p></div>'); inp.focus(); return; }
  if(REC){ try{ REC.stop(); }catch(_){} return; }
  var r=new SR(); REC=r; r.lang=LANG==="en"?"en-US":"vi-VN"; r.interimResults=true; r.continuous=false; r.maxAlternatives=1;
  var fin="";
  b.classList.add("on"); inp.placeholder=L("Đang nghe… hãy nói câu hỏi","Listening… say your question");
  r.onresult=function(e){ var s=""; for(var i=e.resultIndex;i<e.results.length;i++){ s+=e.results[i][0].transcript; if(e.results[i].isFinal) fin=s; } inp.value=s; };
  r.onerror=function(e){ if(e.error==="not-allowed"||e.error==="service-not-allowed") bot('<div class="mg-a"><p class="mg-warn">'+E(L("Chưa được phép dùng micro. Cho phép micro trong cài đặt trình duyệt rồi thử lại.","Microphone access is blocked. Allow it in the browser settings and try again."))+'</p></div>'); };
  r.onend=function(){ REC=null; b.classList.remove("on"); inp.placeholder=L("Hỏi bằng giọng nói, gõ, hoặc bấm ô vuông để chọn…","Speak, type, or tap the grid to pick…"); var t=(fin||inp.value).trim(); if(t){ inp.value=""; ask(t); } };
  try{ r.start(); }catch(_){ REC=null; b.classList.remove("on"); }
}

/* ───────── ĐĂNG NHẬP (email + mật khẩu / mã 6 số — Training Hub, như CRM) ───────── */
function hubPost(action, params){
  return fetch(HUB, { method:"POST", body:new URLSearchParams(Object.assign({ action:action }, params||{})), redirect:"follow", credentials:"omit" }).then(function(r){ return r.json(); });
}
function hubGet(action, params){ return jsonp(HUB+"?"+qs(Object.assign({ action:action }, params||{})), 30000); }
function login(){
  var st={ email:lsG("mmh_last_email")||"", step:"pw" };
  function draw(msg){
    document.body.innerHTML='<div id="mg" class="lg"><div class="mg-login"><img src="../media/app/icon-192.png" alt="" onerror="this.style.display=\'none\'"><h1>'+E(L("Trợ lý quản lý","Manager assistant"))+'</h1>'+
      '<p>'+E(L("Đăng nhập bằng tài khoản CRM (email công ty).","Sign in with your CRM account (company email)."))+'</p>'+
      '<form id="lg-f"><label>Email<input id="lg-e" type="text" inputmode="email" autocapitalize="off" spellcheck="false" autocomplete="username" value="'+E(st.email)+'"></label>'+
      (st.step==="pw"?'<label>'+E(L("Mật khẩu","Password"))+'<input id="lg-p" type="password" autocomplete="current-password"></label>'
        :'<label>'+E(L("Mã 6 số trong email","6-digit code from the email"))+'<input id="lg-c" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></label>')+
      '<button type="submit" class="mg-pri">'+E(st.step==="pw"?L("Đăng nhập","Sign in"):L("Xác nhận","Confirm"))+'</button>'+
      '<button type="button" class="mg-lnk" id="lg-alt">'+E(st.step==="pw"?L("Nhận mã qua email","Email me a code"):L("Dùng mật khẩu","Use password"))+'</button>'+
      '<p class="mg-err" id="lg-m">'+(msg||"")+'</p></form></div></div>';
    $("lg-alt").onclick=function(){ st.email=$("lg-e").value.trim().toLowerCase(); if(st.step==="pw") code(); else { st.step="pw"; draw(""); } };
    $("lg-f").onsubmit=function(e){ e.preventDefault(); st.email=$("lg-e").value.trim().toLowerCase(); if(st.email && st.email.indexOf("@")<0) st.email+="@manimedicalhanoi.com";
      lsS("mmh_last_email", st.email); var m=$("lg-m"); m.textContent=L("Đang kiểm tra…","Checking…");
      var pr=st.step==="pw" ? hubPost("rhAuthPw", { email:st.email, pw:$("lg-p").value }) : hubGet("rhAuthVerify", { email:st.email, code:$("lg-c").value.trim() });
      pr.then(function(d){ if(d && d.ok && d.token && d.user){ lsS("mmh_tk", JSON.stringify({ tk:d.token, exp:d.exp, user:d.user, at:Date.now() })); start(); return; }
        if(d && d.code==="NOPW"){ code(); return; } m.textContent=(d&&d.error)||L("Chưa đăng nhập được.","Could not sign in."); }, function(){ m.textContent=L("Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.","Cannot reach the server. Check the network and try again."); }); };
  }
  function code(){
    if(!st.email){ draw(E(L("Nhập email trước.","Enter your email first."))); return; }
    st.step="code"; draw(E(L("Đang gửi mã…","Sending the code…")));
    hubGet("rhAuthStart", { email:st.email }).then(function(d){ var m=$("lg-m"); if(m) m.textContent=d&&d.ok?L("Đã gửi mã tới "+st.email+".","A code was sent to "+st.email+"."):((d&&d.error)||L("Chưa gửi được mã.","Could not send the code.")); },
      function(){ var m=$("lg-m"); if(m) m.textContent=L("Không kết nối được máy chủ.","Cannot reach the server."); });
  }
  draw("");
}
function denied(){
  document.body.innerHTML='<div id="mg" class="lg"><div class="mg-login"><h1>'+E(L("Trợ lý quản lý","Manager assistant"))+'</h1><p>'+
    E(L("Trang này dành cho Giám đốc, Trưởng bộ phận và Trưởng nhóm Sales. Tài khoản "+me().pic+" chưa có quyền xem.","This page is for the Director, heads of department and sales team leaders. The account "+me().pic+" has no access."))+
    '</p><a class="mg-pri" href="../">'+E(L("Về CRM","Back to the CRM"))+'</a><button type="button" class="mg-lnk" id="lg-out">'+E(L("Đăng nhập tài khoản khác","Use another account"))+'</button></div></div>';
  $("lg-out").onclick=function(){ lsS("mmh_tk", null); location.reload(); };
}
function start(){
  var u=me();
  var saved=lsG("mmh_mgr_lang");
  if(!u){ LANG=saved||((navigator.language||"").slice(0,2)==="vi"?"vi":"en"); login(); return; }
  var sc=window.MGR_SCOPE ? window.MGR_SCOPE(u) : null;
  LANG=saved || (sc && sc.every(function(k){ return TEAMS[k].c==="th"; }) ? "en" : "vi");
  if(!sc || !sc.length){ denied(); return; }
  SCOPE=sc.filter(function(k){ return TEAMS[k]; });
  shell(); welcome();
  loadAll(SCOPE).then(function(){ fillFilters(); });
  if(navigator.serviceWorker && location.protocol==="https:") try{ navigator.serviceWorker.register("../sw.js", { scope:"../" }); }catch(_){}
}
window.MGR={ ask:ask, parse:parse, data:function(){ return DB; }, state:function(){ return { ui:UI, scope:SCOPE, lang:LANG, last:ST.last }; }, load:function(f){ return loadAll(SCOPE, null, f); }, ver:VER };
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
