/* Kiểm thử Working Map (CRM v36.4) với backend giả lập — dữ liệu GIẢ.
   Chạy: NODE_PATH=$(npm root -g) node tools/wmap/wm_test.js [--pic Viet|Nguyen Ha|Yong|Khang|Dao] [--mobile] [--shots <thư mục>] [--th]
   Trang mở bằng http (python3 -m http.server trong thư mục repo) hoặc file:// (mặc định). Thoát mã 1 nếu có lỗi JS / kiểm tra hỏng. */
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs");
const A = process.argv.slice(2), arg = (k, d) => { const i = A.indexOf(k); return i >= 0 ? A[i + 1] : d; };
const PIC = arg("--pic", "Nguyen Ha"), MOB = A.includes("--mobile"), SHOTS = arg("--shots", ""), TH = A.includes("--th");
const LEVEL = { "Nguyen Ha": "director", "Tuyen": "hod", "Viet": "lead", "Dao": "lead" }[PIC] || "pic";
const TEAM_OF = { Viet: "dental", Vinh: "dental", Phuong: "dental", Khang: "surgical", "Viet Ha": "surgical", Trang: "eyeless", Dao: "thai", Miew: "thai", Yong: "thaid", Man: "thaid", Sui: "thaid" };
function rnd(seed){ let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
const DATA = {
  dental:  { pics: ["Viet", "Vinh", "Phuong"], provs: ["Hà Nội", "Bắc Ninh", "Hải Dương", "Nghệ An", "Đà Nẵng", "Hồ Chí Minh", "Bình Dương", "Cần Thơ"], names: ["Nha khoa Kim", "Nha khoa Paris", "Nha khoa Smile", "Răng Hàm Mặt Sài Gòn", "Nha khoa Việt Đức", "Nha khoa Hoàn Mỹ", "Nha khoa An Bình", "Nha khoa Lạc Việt"] },
  surgical:{ pics: ["Viet Ha", "Khang"], provs: ["Hà Nội", "Thanh Hóa", "Nghệ An", "Hồ Chí Minh", "Cần Thơ", "Đồng Nai"], names: ["Bệnh viện Mắt Hà Nội", "Bệnh viện Mắt Nghệ An", "Bệnh viện Đa khoa tỉnh Thanh Hóa", "Bệnh viện Mắt Thành phố Hồ Chí Minh", "Bệnh viện Mắt Cần Thơ", "Bệnh viện Đa khoa Đồng Nai"] },
  eyeless: { pics: ["Trang"], provs: ["Hà Nội", "Hải Phòng"], names: ["Bệnh viện Việt Đức", "Bệnh viện Hữu nghị Việt Tiệp"] },
  thai:    { pics: ["Dao", "Miew"], provs: ["Bangkok", "Chiang Mai", "Khon Kaen"], names: ["Rajavithi Hospital", "Chiang Mai Ram Hospital", "Srinagarind Hospital"] },
  thaid:   { pics: ["Yong", "Man", "Sui"], provs: ["Bangkok", "Nonthaburi", "Chon Buri", "Phuket"], names: ["Smile Dental Clinic", "Bangkok Dental Center", "Siam Dental", "BFC Dental", "Phuket Dental Studio"] }
};
const ACT = ["Visiting", "Visiting", "Visiting", "Telephone", "Presentation", "Message"];
function team(url){ const m = { x58h: "kpi", yL5FR: "hv", x8xuG: "ic", yzmh: "dental", xxck: "surgical", xsoT: "eyeless", wglP: "thai", wEvi: "thaid" }; for (const k in m) if (url.includes(k)) return m[k]; return "dental"; }
function build(k){
  const D = DATA[k], r = rnd(k.length * 77 + 3), accs = [], rows = [];
  D.names.forEach((nm, i) => D.provs.forEach((pv, j) => { if ((i + j) % 2) return; accs.push({ code: k.slice(0, 2).toUpperCase() + (100 + accs.length), name: nm + (j ? " " + (j + 1) : ""), type: k === "thaid" || k === "dental" ? "Clinic" : "Public hospital", province: pv, area: "", pic: D.pics[accs.length % D.pics.length] }); }));
  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() - 2);
  for (let n = 0; n < accs.length * 3; n++){
    const a = accs[Math.floor(r() * accs.length)], d = new Date(base); d.setDate(d.getDate() + Math.floor(r() * 95));
    const iso = d.toISOString().slice(0, 10), past = d < new Date(), ta = ACT[Math.floor(r() * ACT.length)];
    rows.push({ _row: 10 + n, start: iso, finish: iso, pic: a.pic, account: a.name + "/" + a.type + "/" + a.province + "/", accName: a.name, accType: a.type, accProv: a.province,
      typeTask: "Sales", typeAction: ta, status: past ? "Completed" : "To do", plan: k[0] === "t" ? "Introduce new products" : "Giới thiệu sản phẩm mới", result: !past ? "" : k[0] === "t" ? "Person met: Dr. A\n1. Actions Taken: product demo\n2. Current Situation: uses another brand" : "Người gặp: BS. A\n1. Actions Taken: demo sản phẩm\n2. Current Situation: đang dùng hãng khác",
      feedback: past ? (k[0] === "t" ? "Interested" : "Quan tâm") : "", nextAction: past ? (k[0] === "t" ? "Send a quotation" : "Gửi báo giá") : "", photo: "", gps: (k === "surgical" || k === "dental") && past && r() > 0.5 ? "" : "" });
  }
  return { accs, rows };
}
const CACHE = {};
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(MOB ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: SHOTS ? 2 : 1 } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: SHOTS ? 2 : 1 });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", e => errs.push(e.message));
  const team0 = TEAM_OF[PIC] || (TH ? "thaid" : "dental");
  await p.addInitScript(([pic, lv, t]) => { localStorage.setItem("mmh_tk", JSON.stringify({ tk: "xxxxxxxxxxxx.sig", exp: Date.now() + 864e5, user: { pic, email: "x@manimedicalhanoi.com", local: "x", level: lv, admin: false } }));
    localStorage.setItem("mmh_auth_later", new Date().toISOString().slice(0, 10)); localStorage.setItem("mmh_team", t); localStorage.setItem("mmh_upd_hide_all", "1"); if (!window.__WM_TUT) localStorage.setItem("wm2_tut_" + pic, "1"); }, [PIC, LEVEL, team0]);
  await p.route(/fonts\.g|cdnjs|drive\.google|googleusercontent/, r => r.fulfill({ body: "" }));
  await p.route(/script\.google\.com/, r => { const u = new URL(r.request().url()); const a = u.searchParams.get("action"), cb = u.searchParams.get("callback"), k = team(u.pathname);
    let o = { ok: true };
    if (k === "kpi" || k === "hv" || k === "ic"){
      const now = new Date(), ym = now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0"), P = ["FY68", "Q1", "Q2", "Q3", "Q4", ym];
      if (k === "kpi") o = { ok: true, periods: P, rows: Object.keys(TEAM_OF).flatMap(pic => [["C3-0", "Sales – Customer Visits & Co-visits", "Number of Customer Visits – X", "Times", 0.4, 30], ["F1-0", "Sales – Turnover", "MMH Sales Amount to Distributors – X", "USD", 0.6, 9000]]
        .map(d => ({ member: pic, code: d[0] + "1", group: d[1], name: d[2], unit: d[3], agg: "SUM", v: P.map(() => [d[5], Math.round(d[5] * 0.7), d[4], 0.7, 0.7 * d[4]]) }))) };
      else if (u.searchParams.get("action") === "winMap") o = { ok: true, rows: [{ hospital: "Bệnh viện Mắt Hà Nội", city: "Hà Nội", approve: "2026-06-01", result: "Win", wonProduct: "MSL28", wonQty: 500, wonPrice: 60000, dur: 12 }] };
      else if (u.searchParams.get("action") === "kqttMap") o = { ok: true, cols: ["tbmt","buyer","pname","pcode","brand","mfr","qty","price","pub","dec","prov","dur"], rows: [["", "Bệnh viện Mắt Trung ương", "Dao Slit", "", "Alcon", "Alcon", 900, 70000, "2026-03-01", "2026-03-05", "Hà Nội", 12]] };
      return r.fulfill({ contentType: cb ? "application/javascript" : "application/json", body: cb ? cb + "(" + JSON.stringify(o) + ");" : JSON.stringify(o) });
    }
    const D = CACHE[k] || (CACHE[k] = build(k));
    if (a === "bundle") o = { ok: true, picList: [{ pic: PIC }], master: { pic: DATA[team0].pics, fy: ["FY68"], typeAction: ["Visiting", "Telephone", "Presentation"], province: DATA[team0].provs, accountType: ["Clinic", "Public hospital"] }, fyList: ["FY68"], fyCurrent: "FY68", cidx: [], cidxCols: [] };
    if (a === "weekly") o = { ok: true, keyTasks: [] };
    if (a === "visitFeed") o = { ok: true, rows: D.rows.filter(x => !u.searchParams.get("from") || x.start >= u.searchParams.get("from")) };
    if (a === "customerIndex") o = { ok: true, rows: D.accs };
    if (a === "tfTrips") o = { ok: true, trips: [{ pic: DATA[k].pics[0], start: new Date().toISOString().slice(0, 8) + "20", planned: new Date().toISOString().slice(0, 8) + "22", subTask: (k[0] === "t" ? "Business trip " : "Đi công tác ") + DATA[k].provs[1] + " · 3 ngày · x", approval: "Approved" }] };
    if (a === "fuList" && (k === "thaid" || k === "surgical")) o = { ok: true, cols: ["at","id","rev","pic","mail","code","hosp","prov","pkg","ptype","qty","value","stage","stageName","due","note","rid","src"], stages: ["", "Not approached", "Introduced", "Building specs", "Quotation sent", "Bidding", "", "Won", "Lost", "Paused", "Not participating", "Introduction", "Demo", "Proposal", "Purchase contract", "Using", "", "", "Unsuccessful", "Stopped"],
      rows: [["2026-11-05 10:00", "TF1", 1, D.accs[0].pic, "", D.accs[0].code, D.accs[0].name, D.accs[0].province, "Composite 2027", "JIZAI", 100, 250000, 12, "Demo", "2026-11-25", "Demo planned with Dr. A", "", ""]] };
    if (a === "oppList") o = { ok: true, rows: (D.opp = D.opp || [{ id: "OP1", rev: 1, pic: D.accs[0].pic, acc: D.accs[0].name, prov: D.accs[0].province, kind: "pri", stage: 12, lines: [{ g: k === "thaid" || k === "dental" ? "diaburs" : "knife", qty: 200, price: 3, cur: "USD" }], usd: 600, due: "2026-11-30", note: "demo" }]) };
    if (a === "oppSave"){ const rec = JSON.parse(u.searchParams.get("rec")); rec.id = rec.id || "OP" + Date.now(); rec.rev = 1; o = { ok: true, rec }; }
    if (a === "fuSave") o = { ok: true, rec: ["2026-11-11 10:00", "TF2", 1, PIC, "", "", u.searchParams.get("hosp"), "", u.searchParams.get("pkg"), "", "", "", +u.searchParams.get("stage"), "Demo", "", "", "", ""], cols: ["at","id","rev","pic","mail","code","hosp","prov","pkg","ptype","qty","value","stage","stageName","due","note","rid","src"] };
    r.fulfill({ contentType: cb ? "application/javascript" : "application/json", body: cb ? cb + "(" + JSON.stringify(o) + ");" : JSON.stringify(o) }); });
  const URL0 = process.env.WM_URL || ("file://" + path.resolve(__dirname, "../../index.html"));
  await p.goto(URL0); await p.waitForTimeout(6000);
  await p.evaluate(() => { try{ window.UPD && UPD.close && UPD.close(); }catch(_){} document.querySelectorAll("#upd,#dl,#kpn").forEach(x => x.classList.remove("show","on")); });
  let bad = 0; const ok = (c, m) => { console.log((c ? "✓ " : "✗ ") + m); if (!c) bad++; };
  ok(await p.evaluate(() => !!document.getElementById("wmBtn")), "Nút Working Map trên thanh trên cùng");
  const on = await p.evaluate(() => !!(window.WM && WM.state().open));
  ok(on, "Tự mở Working Map sau khi đăng nhập");
  if (!on) await p.evaluate(() => WM.open());
  await p.waitForTimeout(2500);
  const st = await p.evaluate(() => { const M = WM.model(); const sc = WM.scope(); return { sc, n: M ? M.list.length : -1, mon: M ? M.tot : null, cal: document.querySelectorAll(".wm-dc").length, mk: document.querySelectorAll("#wm-mk circle,#wm-mk g").length, pv: document.querySelectorAll("#wm-pv path").length, flt: document.getElementById("wm-flt").innerText }; });
  console.log("scope:", JSON.stringify(st.sc), "· accounts:", st.n, "· tot:", JSON.stringify(st.mon), "· markers:", st.mk, "· provinces:", st.pv);
  console.log("filter bar:", st.flt.replace(/\n/g, " | "));
  ok(st.pv > 30, "Vẽ ranh giới tỉnh"); ok(st.cal >= 7, "Vẽ lịch"); ok(st.n > 0, "Có khách hàng trong phạm vi");
  if (SHOTS){ fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, "wm_" + PIC.replace(/\s/g, "") + (MOB ? "_m" : "") + "_1.png") }); }
  /* chọn 1 khách */
  const k0 = await p.evaluate(() => { const M = WM.model(); const a = M.list.filter(x => x.mon.length)[0] || M.list[0]; WM.pick("acc", a.key); return a.name; });
  await p.waitForTimeout(500);
  const side = await p.evaluate(() => document.getElementById("wm-sc").innerText);
  ok(side.indexOf(k0) >= 0, "Chi tiết khách: " + k0);
  if (SHOTS) await p.screenshot({ path: path.join(SHOTS, "wm_" + PIC.replace(/\s/g, "") + (MOB ? "_m" : "") + "_2.png") });
  /* tìm kiếm danh mục */
  if (MOB) await p.evaluate(() => document.getElementById("wm-qb").click());
  await p.fill("#wm-q", TH ? "bangkok hosp" : "mat trung uong"); await p.waitForTimeout(400);
  const qr = await p.evaluate(() => document.getElementById("wm-qr").innerText);
  console.log("search:", qr.split("\n").slice(0, 6).join(" | "));
  ok(qr.length > 0, "Tìm kiếm có kết quả");
  /* thêm kế hoạch */
  const plan = await p.evaluate(() => { const b = document.querySelector('#wm-sc [data-act="plan"]'); if (b){ b.click(); return true; } return false; });
  await p.waitForTimeout(800);
  if (plan){ const f = await p.evaluate(() => ({ ov: !!document.querySelector("#ov.on"), acc: (document.getElementById("nt_accName") || {}).value || "" })); ok(f.ov && f.acc, "Thêm kế hoạch mở form CRM (account: " + f.acc + ")"); await p.evaluate(() => closeModal()); }
  /* lịch: bấm 1 ngày có việc */
  await p.evaluate(() => { const d = document.querySelector(".wm-dc.has"); if (d) d.click(); }); await p.waitForTimeout(400);
  ok(await p.evaluate(() => WM.state().sel && WM.state().sel.kind === "day"), "Bấm ngày trên lịch ⇒ danh sách việc trong ngày");
  if (SHOTS) await p.screenshot({ path: path.join(SHOTS, "wm_" + PIC.replace(/\s/g, "") + (MOB ? "_m" : "") + "_3.png") });
  /* đổi chế độ độ phủ */
  await p.evaluate(() => { const b = document.querySelector('#wm-vw [data-v="cov"]'); if (b) b.click(); }); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.querySelectorAll("#wm-pv path[class*=c]").length > 0), "Chế độ Độ phủ tô màu tỉnh");
  if (SHOTS) await p.screenshot({ path: path.join(SHOTS, "wm_" + PIC.replace(/\s/g, "") + (MOB ? "_m" : "") + "_4.png") });
  {
    await p.evaluate(() => { const a = WM.model().list.filter(x => x.inCrm)[0]; WM.pick("acc", a.key); }); await p.waitForTimeout(300);
    const has = await p.evaluate(() => { const b = document.querySelector('#wm-sc [data-act="fu2"]'); if (b){ b.click(); return true; } return false; });
    if (has){ await p.waitForTimeout(300);
      await p.evaluate(() => { const r = document.querySelector("#wmf-ls .wm-fl"); r.querySelector(".q").value = "120"; r.querySelector(".q").dispatchEvent(new Event("input")); document.getElementById("wmf-ok").click(); });
      await p.waitForTimeout(900);
      ok(await p.evaluate(() => !document.querySelector("#ov.on")), "Thêm cơ hội: lưu xong, đóng form"); }
    ok(await p.evaluate(() => document.querySelectorAll(".wm-ring").length > 0), "KPI vòng tròn có dữ liệu");
  }
  if (PIC === "Nguyen Ha"){
    await p.evaluate(() => { ["wm-q"].forEach(id => { const q = document.getElementById(id); q.value = ""; q.dispatchEvent(new Event("input")); }); document.querySelector('#wm-flt [data-c="th"]').click(); });
    await p.waitForTimeout(2500);
    ok(await p.evaluate(() => document.querySelectorAll("#wm-pv path").length === 77 && WM.state().country === "th"), "Giám đốc: chuyển sang Thái Lan (77 tỉnh)");
    if (SHOTS) await p.screenshot({ path: path.join(SHOTS, "wm_NguyenHa_th.png") });
  }
  if (await p.evaluate(() => WM.scope().teams.vn && WM.scope().teams.vn.indexOf("surgical") >= 0 && WM.state().country === "vn")){
    await p.evaluate(() => document.querySelector('#wm-vw [data-v="win"]').click()); await p.waitForTimeout(1800);
    ok(await p.evaluate(() => document.querySelectorAll("#wm-mk .wn, #wm-mk .wo, #wm-mk .wm-cl").length > 0), "Trúng thầu (Surgical VN): có chấm kết quả thầu");
    if (SHOTS) await p.screenshot({ path: path.join(SHOTS, "wm_" + PIC.replace(/\s/g, "") + (MOB ? "_m" : "") + "_win.png") });
    await p.evaluate(() => document.querySelector('#wm-vw [data-v="act"]').click());
  }
  /* quay về CRM */
  await p.click("#wm-back"); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !WM.state().open && document.getElementById("main").offsetHeight > 0), "Nút CRM quay về giao diện cũ");
  if (TH || /^(Yong|Man|Sui|Dao|Miew)$/.test(PIC)){
    await p.evaluate(() => WM.open()); await p.waitForTimeout(1200);
    const vi = await p.evaluate(() => { const out = []; const w = document.createTreeWalker(document.getElementById("wm"), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())){ const t = n.nodeValue.trim(); if (t && /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(t)) out.push(t); } return out.slice(0, 10); });
    ok(!vi.length, "Nhóm Thái: không còn chữ tiếng Việt" + (vi.length ? " — " + vi.join(" | ") : ""));
  }
  if (errs.length){ console.log("Lỗi JS:", errs.slice(0, 6)); bad++; }
  console.log(bad ? "Có " + bad + " kiểm tra hỏng." : "Working Map: mọi kiểm tra đều đạt.");
  await b.close(); process.exit(bad ? 1 : 0);
})();
