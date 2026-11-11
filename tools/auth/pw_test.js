/* Kiểm tra đăng nhập email + mật khẩu (v36.5) với backend giả lập.
   Chạy: NODE_PATH=$(npm root -g) node tools/auth/pw_test.js [--en] [--mobile] [--shots <thư mục>] */
const { chromium } = require("playwright"); const path=require("path"); const fs=require("fs");
const A=process.argv.slice(2), EN=A.includes("--en"), MOB=A.includes("--mobile"), SHOTS=(A[A.indexOf("--shots")+1]&&A.includes("--shots"))?A[A.indexOf("--shots")+1]:"";
const PIC=EN?"Dao":"Viet", EMAIL=EN?"dao.test@manimedicalhanoi.com":"viet.test@manimedicalhanoi.com";
const DB={ pw:null, pwInUrl:0, calls:[] };
let ok=0, bad=0; const chk=(c,m)=>{ if(c){ ok++; console.log("✓ "+m); } else { bad++; console.log("✗ "+m); } };
(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext(Object.assign(MOB?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1280,height:820},deviceScaleFactor:2},{locale:EN?"en-US":"vi-VN"}));
  const p=await ctx.newPage(); const errs=[]; p.on("pageerror",e=>errs.push(e.message));
  const tok=()=>"eyJlIjoieCJ9.sig"+Date.now();
  const user={pic:PIC,email:EMAIL,local:EMAIL.split("@")[0],level:"staff"};
  await p.route(/fonts|cdnjs|drive\.google|googleusercontent/,r=>r.fulfill({body:""}));
  await p.route(/script\.google\.com/, async r=>{
    const rq=r.request(), u=new URL(rq.url()); let q=Object.fromEntries(u.searchParams);
    if(rq.method()==="POST"){ q=Object.assign(q, Object.fromEntries(new URLSearchParams(rq.postData()||""))); }
    if(u.searchParams.get("pw")) DB.pwInUrl++;
    const a=q.action, cb=u.searchParams.get("callback"); DB.calls.push(a+(rq.method()==="POST"?"(POST)":""));
    let o={ok:true};
    if(a==="bundle") o={ok:true,picList:[{pic:PIC}],master:{pic:[PIC],fy:["FY68"]},fyList:["FY68"],fyCurrent:"FY68"};
    if(a==="weekly") o={ok:true,keyTasks:[]};
    if(a==="rhAuthStart") o={ok:true,gap:45};
    if(a==="rhAuthVerify") o=q.code==="123456"?{ok:true,token:tok(),exp:Date.now()+30*864e5,user,hasPw:!!DB.pw}:{ok:false,code:"CODE",error:"Mã chưa đúng."};
    if(a==="rhAuthPw") o=!DB.pw?{ok:false,code:"NOPW",error:"Tài khoản chưa đặt mật khẩu — đăng nhập bằng mã email."}:q.pw===DB.pw&&q.email===EMAIL?{ok:true,token:tok(),exp:Date.now()+30*864e5,user,hasPw:true}:{ok:false,code:"PW",error:"Email hoặc mật khẩu chưa đúng."};
    if(a==="rhAuthPwSet"){ if(String(q.pw).length<8) o={ok:false,code:"WEAK",error:"Mật khẩu cần ít nhất 8 ký tự."}; else { DB.pw=q.pw; o={ok:true,hasPw:true,message:"Đã lưu mật khẩu — lần sau đăng nhập bằng email + mật khẩu."}; } }
    if(a==="rhAuthMe") o={ok:true,user,hasPw:!!DB.pw,exp:Date.now()+30*864e5};
    if(a==="rhAuthRenew") o={ok:true,token:tok(),exp:Date.now()+30*864e5,user,hasPw:!!DB.pw};
    r.fulfill({status:200,headers:{"access-control-allow-origin":"*"},contentType:cb?"application/javascript":"application/json",body:cb?cb+"("+JSON.stringify(o)+");":JSON.stringify(o)});
  });
  const URLX="file://"+path.resolve(__dirname,"../../index.html");
  const shot=async n=>{ if(SHOTS){ fs.mkdirSync(SHOTS,{recursive:true}); await p.screenshot({path:path.join(SHOTS,"pw_"+(EN?"en_":"")+(MOB?"m_":"")+n+".png")}); } };
  await p.addInitScript(()=>{ try{ sessionStorage.setItem("mmh_wm_seen","1"); }catch(_){} });
  await p.goto(URLX); await p.waitForTimeout(2500);
  chk(await p.isVisible("#au-email") && await p.isVisible("#au-pw"), "Màn đầu: ô email + mật khẩu");
  chk(await p.$eval("#au-pw",e=>e.autocomplete)==="current-password" && await p.$eval("#au-email",e=>e.autocomplete)==="username", "autocomplete username / current-password (trình duyệt nhớ mật khẩu)");
  chk(!(await p.$(".au-legacy")), "Không còn link 'Dùng mật khẩu như trước'");
  await p.fill("#au-email", EMAIL); await shot("1_gate");
  /* chưa có mật khẩu: nhập mật khẩu bất kỳ ⇒ NOPW ⇒ tự gửi mã */
  await p.fill("#au-pw","abc12345"); await p.click(".au-btn"); await p.waitForTimeout(800);
  chk(await p.isVisible("#au-code"), "Chưa có mật khẩu ⇒ tự chuyển sang nhập mã email");
  await p.fill("#au-code","123456"); await p.waitForTimeout(800);
  chk(await p.isVisible("#au-n1") && await p.isVisible("#au-n2"), "Nhập mã xong ⇒ bước Tạo mật khẩu");
  chk(await p.$eval("#au-n1",e=>e.autocomplete)==="new-password", "Ô mật khẩu mới autocomplete=new-password");
  await shot("2_create");
  await p.fill("#au-n1","short"); await p.fill("#au-n2","short"); await p.click(".au-btn"); await p.waitForTimeout(200);
  chk(/8/.test(await p.textContent(".au-err")), "Mật khẩu ngắn ⇒ báo lỗi");
  await p.fill("#au-n1","Matkhau@2026"); await p.fill("#au-n2","Matkhau@2026"); await p.click(".au-btn");
  await p.waitForTimeout(3500);
  chk(DB.pw==="Matkhau@2026", "Mật khẩu gửi lên máy chủ (rhAuthPwSet)");
  chk(await p.evaluate(()=>!!(window.S&&S.user&&S.user.pic)), "Vào CRM sau khi tạo mật khẩu");
  /* đăng xuất qua menu tên (bấm 2 lần) */
  await p.evaluate(()=>{ document.querySelectorAll("#upd,#dl,#kpn").forEach(e=>e.classList.remove("show")); window.__tourClean&&__tourClean(); const w=document.getElementById("wm"); if(w) w.remove(); });
  await p.click("#btnUser"); await p.waitForTimeout(300);
  chk(await p.isVisible("#au-um"), "Bấm tên ⇒ menu tài khoản");
  chk(/(Đổi mật khẩu|Change password)/.test(await p.textContent("#au-um")), "Menu có Đổi mật khẩu (đã có mật khẩu)");
  await shot("3_menu");
  await p.click('#au-um [data-um="pw"]'); await p.waitForTimeout(300);
  chk(await p.isVisible("#au-ov.show #au-n1"), "Hộp Đổi mật khẩu mở");
  await shot("4_change");
  await p.click("#au-ov .au-x");
  await p.click("#btnUser"); await p.click('#au-um [data-um="out"]'); await p.click('#au-um [data-um="out2"]');
  await p.waitForTimeout(2500);
  chk(await p.isVisible("#au-pw"), "Đăng xuất ⇒ về màn đăng nhập");
  /* trình duyệt mới: email + mật khẩu */
  await p.fill("#au-email", EMAIL); await p.fill("#au-pw","sai-mat-khau"); await p.click(".au-btn"); await p.waitForTimeout(700);
  chk(/(chưa đúng|incorrect|not correct)/i.test(await p.textContent(".au-err")), "Sai mật khẩu ⇒ báo lỗi");
  await p.fill("#au-pw","Matkhau@2026"); await p.click(".au-btn"); await p.waitForTimeout(3500);
  chk(await p.evaluate(()=>!!(window.S&&S.user&&S.user.pic)), "Đăng nhập bằng email + mật khẩu ⇒ vào CRM");
  chk(DB.pwInUrl===0, "Mật khẩu KHÔNG nằm trên URL (chỉ gửi POST)");
  if(EN){
    await p.evaluate(()=>{ localStorage.removeItem("mmh_tk"); localStorage.removeItem("mmh_pic"); }); await p.reload(); await p.waitForTimeout(2500);
    const vi=await p.evaluate(()=>{ const out=[]; const w=document.createTreeWalker(document.getElementById("login")||document.body,NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ const t=n.nodeValue.trim(); if(t && /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(t) && n.parentElement.offsetParent) out.push(t); } return out; });
    chk(!vi.length, "Màn đăng nhập tiếng Anh: không còn chữ Việt "+(vi.length?JSON.stringify(vi.slice(0,6)):""));
    await shot("5_gate_en");
  }
  console.log("Lệnh:", DB.calls.filter(c=>/rhAuth/.test(c)).join(", "));
  if(errs.length) console.log("Lỗi JS:", errs.slice(0,5));
  console.log(bad?("Có "+bad+" mục lỗi."):"Đăng nhập mật khẩu: mọi kiểm tra đều đạt.");
  await b.close(); process.exit(bad?1:0);
})();
