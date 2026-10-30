/* Kiểm tra bài hướng dẫn (tour/tours.js) của MMH CRM: chạy MỌI bài với backend giả lập, báo bước nào không tìm thấy phần tử.
   Chạy: NODE_PATH=$(npm root -g) node tools/tour_check.js [--thai] [--mobile] [id …]   ·  thoát mã 1 nếu có bước hỏng.
   --thai: chạy như nhóm Thái (tiếng Anh, không ảnh, không công tác) · --thaid: nhóm Thailand Dental (Yong). Mỗi lần sửa chức năng ⇒ sửa tours.js rồi chạy lại. */
const { chromium } = require("playwright"); const path=require("path");
const ARGS=process.argv.slice(2), THD=ARGS.includes("--thaid"), THAI=THD||ARGS.includes("--thai"), ONLY=ARGS.filter(a=>!a.startsWith("--"));
const MOB=ARGS.includes("--mobile");   /* --mobile: khung điện thoại 390×844 */
(async()=>{
  const b=await chromium.launch(); const p=await (await b.newContext(MOB?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1440,height:900}})).newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(e.message));
  const pic=THD?"Yong":THAI?"Dao":"Viet";
  await p.addInitScript((pic)=>{ localStorage.setItem("mmh_tk",JSON.stringify({tk:"xxxxxxxxxxxx.sig",exp:Date.now()+864e5,user:{pic:pic,email:"x@manimedicalhanoi.com",local:"x",level:"lead",admin:true}}));
    localStorage.setItem("mmh_auth_later",new Date().toISOString().slice(0,10)); if(pic==="Dao") localStorage.setItem("mmh_team","thai"); if(pic==="Yong") localStorage.setItem("mmh_team","thaid"); }, pic);
  await p.route(/fonts|cdnjs|drive\.google|googleusercontent/,r=>r.fulfill({body:""}));
  await p.route(/script\.google\.com/, r=>{ const u=new URL(r.request().url()); const a=u.searchParams.get("action"), cb=u.searchParams.get("callback");
    let o={ok:true};
    if(a==="bundle") o={ok:true,picList:[{pic}],master:{pic:[pic],fy:["FY68"]},fyList:["FY68"],fyCurrent:"FY68"};
    if(a==="weekly") o={ok:true,keyTasks:[]};
    if(a==="tfPending") o={ok:true,director:true,items:[{row:9,pic:"Vinh",start:"2026-10-20",finish:"2026-10-21",days:2,dest:"Hue",purpose:"Thăm khách hàng",estCost:"Công tác phí: 760.000",status:"Already sent propose email"}],count:1};
    r.fulfill({contentType:cb?"application/javascript":"application/json",body:cb?cb+"("+JSON.stringify(o)+");":JSON.stringify(o)}); });
  await p.goto("file://"+path.resolve(__dirname,"../index.html")); await p.waitForTimeout(5000);
  await p.evaluate(()=>window.__tourClean&&__tourClean());
  const ids=await p.evaluate(()=>TOUR.list().filter(t=>{ try{ return !t.when||t.when(); }catch(_){ return false; } }).map(t=>t.id));
  const btn=await p.evaluate(()=>!!document.querySelector("[data-tour-btn]"));
  const team=await p.evaluate(()=>{ try{ return curTeamKey()+" · EN="+!!(window.I18N&&I18N.on); }catch(_){ return "?"; } });
  console.log("curTeam:",team);
  let bad=0; console.log("Nhóm:", THAI?"Thái (tiếng Anh)":"Dental", "· Nút Hướng dẫn:", btn?"có":"KHÔNG THẤY"); if(!btn) bad++;
  for(const id of ids){ if(ONLY.length && !ONLY.includes(id)) continue;
    const r=await p.evaluate(id=>TOUR.check(id), id);
    const steps=await p.evaluate(id=>{ const t=TOUR.list().filter(t=>t.id===id)[0]; return t.steps.filter(s=>{ try{ return !s.when||s.when(); }catch(_){ return false; } }).map(s=>typeof s.t==="string"?s.t:(s.t.vi||s.t.en)); }, id);
    if(r.miss && r.miss.length){ bad++; console.log("✗ "+id+": không thấy bước "+r.miss.map(i=>(i+1)+" ("+steps[i]+")").join(", ")); }
    else console.log("✓ "+id+" ("+r.steps+" bước)");
    await p.evaluate(()=>window.__tourClean&&__tourClean()); await p.waitForTimeout(300);
  }
  if(errs.length) console.log("Lỗi JavaScript:", errs.slice(0,5));
  console.log(bad?("Có "+bad+" bài cần sửa."):"Tất cả bài hướng dẫn đều khớp.");
  await b.close(); process.exit(bad?1:0);
})();
