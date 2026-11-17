/* Kiểm thử Trợ lý quản lý (manager/, CRM v37.6) với backend giả lập — dữ liệu GIẢ.
   Chạy (ở thư mục repo): python3 -m http.server 8790 &  rồi  NODE_PATH=$(npm root -g) node tools/mgr/mgr_test.js [--shots <thư mục>] [--en]
   Thoát mã 1 nếu có lỗi JS / kiểm tra hỏng. */
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const A = process.argv.slice(2), arg = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const SHOTS = arg("--shots", ""), BASE = arg("--base", "http://localhost:8790/manager/");
const pad = n => String(n).padStart(2, "0"), iso = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const add = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const mon = () => { const d = new Date(), w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return iso(d); };
function rnd(seed){ let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
const DATA = {
  dental:  { pics: ["Viet", "Vinh", "Phuong"], names: ["Nha khoa An Bình", "Nha khoa Minh Tâm", "Nha khoa Sao Mai", "Nha khoa Hoa Sen", "Đại lý Vật liệu Phú An"], prov: ["Hà Nội", "Đà Nẵng", "Hồ Chí Minh"] },
  surgical:{ pics: ["Viet Ha", "Khang"], names: ["Bệnh viện Mắt Bình An", "Bệnh viện Đa khoa Hòa Bình", "Phòng khám Mắt Ánh Dương"], prov: ["Hà Nội", "Cần Thơ"] },
  eyeless: { pics: ["Trang"], names: ["Bệnh viện Phương Nam", "Bệnh viện Đông Á"], prov: ["Hà Nội"] },
  thai:    { pics: ["Dao", "Miew"], names: ["Sukhum Hospital", "Lanna Eye Center"], prov: ["Bangkok", "Chiang Mai"] },
  thaid:   { pics: ["Yong", "Man", "Sui"], names: ["Smile Dental Clinic", "Bangkok Dental Center", "Siam Dental", "Phuket Dental Studio"], prov: ["Bangkok", "Phuket"] }
};
const KEY = { yzmh: "dental", xxck: "surgical", xsoT: "eyeless", wglP: "thai", wEvi: "thaid", wsX4: "hub" };
function teamOf(url){ for (const k in KEY) if (url.includes(k)) return KEY[k]; return ""; }
const CACHE = {};
function build(k){
  const D = DATA[k], r = rnd(k.length * 97 + 7), rows = [];
  for (let n = 0; n < 70; n++){
    const off = Math.floor(r() * 60) - 40, d = add(off), past = off < 0 || (off === 0 && r() < 0.5), p = D.pics[Math.floor(r() * D.pics.length)], a = D.names[Math.floor(r() * D.names.length)];
    const ta = ["Visiting", "Visiting", "Visiting", "Telephone", "Presentation"][Math.floor(r() * 5)], st = past ? (r() < 0.85 ? "Completed" : "To do") : "To do";
    const hh = 8 + Math.floor(r() * 9), mm = Math.floor(r() * 60);
    rows.push({ _row: 10 + n, start: d, finish: d, pic: p, account: a + "/Clinic/" + D.prov[0] + "/North", accName: a, accType: "Clinic", accProv: D.prov[n % D.prov.length], typeTask: "Sales", typeAction: ta,
      status: st, plan: k[0] === "t" ? "Introduce new products" : "Giới thiệu sản phẩm mới", result: st === "Completed" ? (k[0] === "t" ? "Person met: Dr. A\n1. Actions Taken: Demo of JIZAI\n2. Current Situation: Uses another brand" : "Người gặp: BS A\n1. Actions Taken: Giới thiệu sản phẩm\n2. Current Situation: Đang dùng hãng khác") : "",
      feedback: st === "Completed" ? (k[0] === "t" ? "Interested" : "Quan tâm") : "", nextAction: st === "Completed" ? (k[0] === "t" ? "Send a quotation" : "Gửi báo giá") : "",
      photo: k[0] !== "t" && st === "Completed" ? "https://drive.google.com/file/d/x" + n + "/view" : "", upAt: d + " " + pad(hh) + ":" + pad(mm), shotAt: d + " " + pad(hh) + ":" + pad(mm), gps: "21.0" + (10 + n) + ", 105.8" + (20 + n) });
  }
  if (k === "dental"){ const d = add(-1); [["17:04", "Nha khoa An Bình"], ["17:06", "Nha khoa Minh Tâm"], ["17:09", "Nha khoa Sao Mai"]].forEach((x, i) => rows.push({ _row: 500 + i, start: d, finish: d, pic: "Viet",
    account: x[1] + "/Dealer/Hà Nội/North", accName: x[1], accType: "Dealer", accProv: "Hà Nội", typeTask: "Sales", typeAction: "Visiting", status: "Completed", result: "Người gặp: Anh B\n1. Actions Taken: Hỏi thăm", photo: "https://drive.google.com/file/d/p" + i + "/view",
    upAt: d + " " + x[0], shotAt: d + " " + x[0], gps: "21.004204, 105.840725" })); }
  return rows;
}
function reply(k, a, u){
  const D = DATA[k], rows = CACHE[k] || (CACHE[k] = build(k));
  if (a === "visitFeed"){ const f = u.searchParams.get("from"), t = u.searchParams.get("to"), p = u.searchParams.get("pic"); return { ok: true, rows: rows.filter(x => (!f || x.finish >= f) && (!t || x.start <= t) && (!p || x.pic === p)) }; }
  if (a === "tfTrips") return { ok: true, trips: [{ pic: D.pics[0], start: add(-1), planned: add(2), subTask: (k[0] === "t" ? "Business trip " : "Đi công tác ") + D.prov[D.prov.length - 1] + " · 4 ngày · Từ …", approval: "Approved", status: "In progress" },
    { pic: D.pics[D.pics.length - 1], start: add(8), planned: add(10), subTask: (k[0] === "t" ? "Business trip " : "Đi công tác ") + D.prov[0] + " · 3 ngày", approval: "Not Yet", status: "To do" }] };
  if (a === "orderPending") return { ok: true, groups: [{ pic: D.pics[0], month: add(0).slice(0, 7).replace("-", ""), orders: [
    { key: k + "1", orderNo: "601", pic: D.pics[0], day: add(-3), month: "", account: D.names[0], amount: 18500000, appr: "wait", apprNote: "Đã gửi xác nhận tới Tuyen · 15/11/2026 10:00", lines: [{}, {}] },
    { key: k + "2", orderNo: "602", pic: D.pics[D.pics.length - 1], day: add(-6), account: D.names[1], amount: 7200000, appr: "wait", apprNote: "", lines: [{}] },
    { key: k + "3", orderNo: "590", pic: D.pics[0], day: add(-10), account: D.names[2], amount: 42000000, appr: "ok", apprNote: "Đã duyệt", lines: [{}, {}, {}] }] }] };
  if (a === "ordList") return { ok: true, rows: [{ orderNo: "No.12", account: D.names[0] + "/Clinic/Bangkok/Central", pic: "Yong", day: add(-2), amount: 24000, qty: 10 }, { orderNo: "No.12", account: D.names[0] + "/Clinic/Bangkok/Central", pic: "Yong", day: add(-2), amount: 8000, qty: 4 }] };
  if (a === "naList") return { ok: true, na: true, rows: [{ id: "NA1", pic: D.pics[0], type: "new_account", account: D.names[3 % D.names.length], month: add(0).slice(0, 7).replace("-", ""), status: "Pending", created: add(-4), subAt: add(-3) },
    { id: "NA2", pic: D.pics[D.pics.length - 1], type: "new_sku", account: D.names[1], month: add(0).slice(0, 7).replace("-", ""), status: "Approved", created: add(-12), decAt: add(-2) }] };
  if (a === "rpStatus"){ const s = {}; D.pics.slice(0, -1).forEach(p => s[p] = { from: add(-7 - ((new Date().getDay() + 6) % 7)), at: add(-2) + " 18:20" }); return { ok: true, sent: s, since: "2026-10-12" }; }
  return { ok: true };
}
const results = []; let bad = 0;
function check(name, ok, extra){ results.push((ok ? "OK   " : "LỖI ") + name + (extra ? " — " + extra : "")); if (!ok) bad++; }
async function page(b, opt){
  const ctx = await b.newContext(opt.mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: SHOTS ? 2 : 1 } : { viewport: { width: 1280, height: 860 }, deviceScaleFactor: SHOTS ? 2 : 1 });
  const p = await ctx.newPage(); p._errs = []; p.on("pageerror", e => p._errs.push(e.message));
  await p.addInitScript(([u, lang, voice]) => {
    if (u) localStorage.setItem("mmh_tk", JSON.stringify({ tk: "tok.sig", exp: Date.now() + 864e5, user: u })); else localStorage.removeItem("mmh_tk");
    if (lang) localStorage.setItem("mmh_mgr_lang", lang); else localStorage.removeItem("mmh_mgr_lang");
    if (voice){ window.SpeechRecognition = window.webkitSpeechRecognition = function(){ var me = this; this.start = function(){ setTimeout(function(){ me.onresult && me.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: voice }], { isFinal: true })] }); me.onend && me.onend(); }, 300); }; this.stop = function(){}; }; }
  }, [opt.user || null, opt.lang || "", opt.voice || ""]);
  await p.route(/script\.google\.com/, r => { const u = new URL(r.request().url()), k = teamOf(u.pathname), cb = u.searchParams.get("callback");
    let a = u.searchParams.get("action"), body = null;
    if (k === "hub"){ const pd = r.request().postData() || ""; if (/rhAuthPw/.test(pd)) body = { ok: true, token: "tok2.sig", exp: Date.now() + 864e5, user: { pic: "Tuyen", level: "hod", admin: false } }; else body = { ok: true }; }
    else body = reply(k, a, u);
    r.fulfill({ status: 200, headers: { "access-control-allow-origin": "*" }, contentType: cb ? "application/javascript" : "application/json", body: cb ? cb + "(" + JSON.stringify(body) + ");" : JSON.stringify(body) }); });
  await p.goto(BASE); return p;
}
async function ask(p, q){
  const n = await p.locator(".mg-msg.b").count();
  await p.evaluate(t => MGR.ask(t), q);
  await p.waitForFunction(n => { const ms = document.querySelectorAll(".mg-msg.b"); return ms.length > n && !ms[ms.length - 1].querySelector(".mg-wait"); }, n, { timeout: 30000 });
  return p.evaluate(() => { const ms = document.querySelectorAll(".mg-msg.b"); return ms[ms.length - 1].innerText; });
}
const shotEl = async (p, f) => { if (SHOTS){ fs.mkdirSync(SHOTS, { recursive: true }); await p.locator(".mg-msg.b").last().screenshot({ path: path.join(SHOTS, f) }); } };
const shot = async (p, f) => { if (SHOTS){ fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, f) }); } };
(async () => {
  const b = await chromium.launch();
  /* 1. Giám đốc — mọi nhóm */
  let p = await page(b, { user: { pic: "Nguyen Ha", level: "director" }, lang: A.includes("--en") ? "en" : "vi" });
  await p.waitForSelector(".mg-menu");
  check("Giám đốc thấy 5 nhóm", (await p.evaluate(() => MGR.state().scope.length)) === 5);
  await p.waitForFunction(() => !document.getElementById("mg-prog").textContent, null, { timeout: 30000 });
  await shot(p, "1_welcome.png");
  const parse = await p.evaluate(() => [MGR.parse("Tuần này Viet Ha đi địa bàn bao nhiêu khách?"), MGR.parse("Đơn hàng chờ duyệt nhóm Dental"), MGR.parse("ai chưa gửi báo cáo tuần trước"), MGR.parse("kế hoạch tuần sau"), MGR.parse("công tác sắp tới"), MGR.parse("tổng hợp tình hình"), MGR.parse("visits of Yong last month")]);
  check("hiểu: người Viet Ha + đi địa bàn + tuần này", parse[0].pic === "Viet Ha" && parse[0].topic === "visit" && parse[0].per.k === "week", JSON.stringify(parse[0]).slice(0, 120));
  check("hiểu: đơn chờ duyệt Dental", parse[1].topic === "order" && parse[1].team === "dental" && parse[1].f.pending);
  check("hiểu: báo cáo tuần trước chưa gửi", parse[2].topic === "report" && parse[2].per.k === "lastweek");
  check("hiểu: kế hoạch tuần sau", parse[3].topic === "plan" && parse[3].per.k === "nextweek");
  check("hiểu: công tác sắp tới", parse[4].topic === "trip");
  check("hiểu: tổng hợp", parse[5].topic === "over");
  check("hiểu tiếng Anh: visits of Yong last month", parse[6].topic === "visit" && parse[6].pic === "Yong" && parse[6].per.k === "lastmonth");
  await p.click(".mg-chip.pri");
  await p.waitForSelector(".mg-og", { timeout: 30000 });
  check("Tổng hợp: 5 thẻ nhóm", (await p.locator(".mg-oc").count()) === 5);
  await shot(p, "2_overview.png"); await shotEl(p, "2_overview_card.png");
  let t = await ask(p, "Tuần này Viet đi địa bàn bao nhiêu khách?"); check("đi địa bàn của Viet", /Viet/.test(t) && /(lượt đi địa bàn|visits completed)/.test(t), t.slice(0, 100));
  await shot(p, "3_visits.png"); await shotEl(p, "3_visits_card.png");
  t = await ask(p, "Đơn hàng chờ duyệt"); check("đơn chờ duyệt", /(chờ duyệt|waiting)/i.test(t) && /601/.test(t), t.slice(0, 100));
  t = await ask(p, "Ai chưa gửi báo cáo tuần trước?"); check("báo cáo tuần", /(Chưa gửi|Not sent)/.test(t), t.slice(0, 120));
  t = await ask(p, "Kế hoạch tuần sau nhóm Surgical"); check("kế hoạch tuần sau Surgical", /Surgical/.test(t), t.slice(0, 100));
  t = await ask(p, "Công tác sắp tới"); check("công tác", /(chuyến công tác|business trips)/.test(t), t.slice(0, 100));
  t = await ask(p, "Mở mới tháng này"); check("mở mới", /(hồ sơ|cases)/.test(t), t.slice(0, 100));
  t = await ask(p, "Ảnh bất thường 7 ngày qua"); check("ảnh < 15 phút: chuỗi của Viet", /Viet/.test(t) && /(3 ảnh|3 photos)/.test(t), t.slice(0, 160));
  await shot(p, "4_photos.png"); await shotEl(p, "4_photos_card.png");
  t = await ask(p, "xin chào bạn khoẻ không"); check("câu lạ ⇒ gợi ý", /(Chưa hiểu|did not understand)/.test(t));
  await p.selectOption("#mg-team", "thaid"); await p.waitForTimeout(200);
  t = await ask(p, "Đơn hàng tháng này"); check("đơn Dental Thái (ordList, THB)", /฿/.test(t), t.slice(0, 120));
  check("không lỗi JS (Giám đốc)", !p._errs.length, p._errs.join(" | "));
  await p.context().close();
  /* 2. Trưởng nhóm Viet — chỉ Dental */
  p = await page(b, { user: { pic: "Viet", level: "lead" } }); await p.waitForSelector(".mg-menu");
  check("Viet chỉ thấy Dental", JSON.stringify(await p.evaluate(() => MGR.state().scope)) === '["dental"]');
  await p.context().close();
  /* 3. Owen — tiếng Anh, Dental Thái; nói bằng micro (giả lập) */
  p = await page(b, { user: { pic: "Owen", level: "lead" }, voice: "orders this month" }); await p.waitForSelector(".mg-menu");
  check("Owen: tiếng Anh", (await p.evaluate(() => MGR.state().lang)) === "en");
  await p.click("#mg-mic"); await p.waitForSelector(".mg-msg.u"); await p.waitForFunction(() => { const ms = document.querySelectorAll(".mg-msg.b"); return ms.length > 1 && !ms[ms.length - 1].querySelector(".mg-wait"); }, null, { timeout: 30000 });
  t = await p.evaluate(() => [...document.querySelectorAll(".mg-msg.b")].pop().innerText); check("hỏi bằng giọng nói ⇒ trả lời đơn hàng", /Sales orders/.test(t), t.slice(0, 100));
  const vi = await p.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), out = []; let n; while ((n = w.nextNode())) if (/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(n.textContent)) out.push(n.textContent.trim().slice(0, 40)); return out; });
  check("giao diện tiếng Anh không còn chữ Việt", !vi.length, vi.slice(0, 5).join(" | "));
  await p.context().close();
  /* 4. PIC thường — không có quyền */
  p = await page(b, { user: { pic: "Phuong", level: "pic" } }); await p.waitForSelector(".mg-login");
  check("Phuong (sales) không vào được", /(chưa có quyền|no access)/.test(await p.innerText(".mg-login")));
  await p.context().close();
  /* 5. Chưa đăng nhập ⇒ đăng nhập mật khẩu */
  p = await page(b, {}); await p.waitForSelector("#lg-f");
  await p.fill("#lg-e", "tt.tuyen"); await p.fill("#lg-p", "12345678"); await p.click("#lg-f button[type=submit]");
  await p.waitForSelector(".mg-menu", { timeout: 15000 });
  check("đăng nhập mật khẩu ⇒ Tuyen thấy 3 nhóm VN", (await p.evaluate(() => MGR.state().scope.length)) === 3);
  await p.context().close();
  /* 6. Điện thoại */
  p = await page(b, { user: { pic: "Nguyen Ha", level: "director" }, mobile: true, lang: A.includes("--en") ? "en" : "vi" }); await p.waitForSelector(".mg-menu");
  await p.waitForFunction(() => !document.getElementById("mg-prog").textContent, null, { timeout: 30000 });
  await shot(p, "5_mobile_welcome.png");
  await p.click(".mg-chip.pri"); await p.waitForSelector(".mg-og", { timeout: 30000 });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1); check("điện thoại không tràn ngang", !ov);
  await shot(p, "6_mobile_overview.png"); await shotEl(p, "6_mobile_overview_card.png");
  await ask(p, "Đi địa bàn tuần này"); await shot(p, "7_mobile_visits.png");
  check("không lỗi JS (điện thoại)", !p._errs.length, p._errs.join(" | "));
  await b.close();
  console.log(results.join("\n")); console.log(bad ? "\n" + bad + " kiểm tra hỏng" : "\nTất cả kiểm tra đều đạt"); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
