/* ════════════════════════════════════════════════════════════════════
   MMH SelfMail v1.0 (22/11/2026) — GỬI EMAIL BẰNG GMAIL CỦA CHÍNH NGƯỜI DÙNG
   Người dùng yêu cầu: "ai tự gửi của người đó" — báo cáo không còn đi từ mmh.product (hết lỗi hạn mức email của Google).
   Cách chạy: máy chủ dựng email + PDF như cũ nhưng KHÔNG gửi (selfMail=1, trả về mails) ⇒ module này gửi bằng Gmail API
   (Google Identity Services, quyền gmail.send) của người đang đăng nhập ⇒ email nằm trong mục Đã gửi của họ.
   Dùng chung được cho mọi app MMH:
     SELFMAIL.cfg({ clientId, me:()=>({local,email}), lang:()=>"vi"|"en" })
     SELFMAIL.ready()      — đã có Client ID + người đăng nhập
     SELFMAIL.warm()       — GỌI TRONG LÚC NGƯỜI DÙNG BẤM (mở cửa sổ Google, trình duyệt chặn nếu gọi sau khi chờ mạng)
     SELFMAIL.token()      — Promise<{t,exp,email} | {err} | null>
     SELFMAIL.send(tok, mails) — Promise<số thư đã gửi>; mails = [{to,cc,bcc,replyTo,subject,htmlBody,body,att:[{name,type,b64}],inl:{cid:{type,b64}}}]
   Chỉ nhận tài khoản Google @manimedicalhanoi.com / @mani.inc trùng phần trước @ với người đăng nhập app.
   Thư gửi từ @manimedicalhanoi.com ⇒ Reply-To = <cùng tên>@mani.inc (hộp thư mọi người đang dùng).
   ════════════════════════════════════════════════════════════════════ */
(function(){
  if(window.SELFMAIL) return;
  var C={ clientId:"", me:null, lang:null,
          scope:"https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
          domains:/@(manimedicalhanoi\.com|mani\.inc)$/i, replyDomain:"mani.inc" };
  var KEY="mmh_gm_tok", gsiP=null, client=null, clientHint="", pend=null, WARM=null, TOK=null, bad=false;

  function meId(){ var u=null; try{ u=C.me&&C.me(); }catch(e){} return String((u&&(u.local||u.email))||"").trim().toLowerCase(); }
  function local(e){ return String(e||"").toLowerCase().split("@")[0]; }
  function hint(){ var e=meId(); return !e?"":(e.indexOf("@")>0?e:e+"@manimedicalhanoi.com"); }
  function same(email){ var a=local(meId()); return !!a && a===local(email); }
  function gsiOk(){ return !!(window.google&&google.accounts&&google.accounts.oauth2); }
  function loadGsi(){
    if(gsiOk()) return Promise.resolve();
    if(gsiP) return gsiP;
    gsiP=new Promise(function(res,rej){
      var s=document.createElement("script"); s.src="https://accounts.google.com/gsi/client"; s.async=true;
      s.onload=function(){ res(); }; s.onerror=function(){ gsiP=null; rej(new Error("gsi")); };
      document.head.appendChild(s);
    });
    return gsiP;
  }
  function load(){
    if(TOK && TOK.exp>Date.now()+60000 && same(TOK.email)) return TOK;
    try{ var o=JSON.parse(sessionStorage.getItem(KEY)||"null"); if(o && o.exp>Date.now()+60000 && same(o.email)) return (TOK=o); }catch(e){}
    return null;
  }
  function save(o){ TOK=o; try{ sessionStorage.setItem(KEY,JSON.stringify(o)); }catch(e){} }
  function clear(){ TOK=null; try{ sessionStorage.removeItem(KEY); }catch(e){} }
  function ready(){ return !!C.clientId && !!meId(); }
  function mkClient(){
    var h=hint();
    if(client && clientHint===h) return client;
    clientHint=h;
    client=google.accounts.oauth2.initTokenClient({
      client_id:C.clientId, scope:C.scope, login_hint:h,
      callback:function(r){ var p=pend; pend=null; if(!p) return;
        if(!r || r.error || !r.access_token) return p.res({ err:(r&&r.error)||"denied" });
        p.res({ t:r.access_token, exp:Date.now()+((+r.expires_in||3599)*1000) }); },
      error_callback:function(e){ var p=pend; pend=null; if(p) p.res({ err:(e&&e.type)||"popup" }); }
    });
    return client;
  }
  /* gọi ĐỒNG BỘ trong sự kiện bấm của người dùng */
  function warm(){
    if(!ready() || load() || pend) return;
    if(!gsiOk()){ loadGsi().catch(function(){}); return; }
    var p={}; p.pr=new Promise(function(res){ p.res=res; });
    pend=p; WARM=p.pr;
    try{ mkClient().requestAccessToken({ prompt: bad ? "select_account" : "" }); }
    catch(e){ pend=null; p.res({ err:"init" }); }
    setTimeout(function(){ if(pend===p){ pend=null; p.res({ err:"timeout" }); } }, 180000);
  }
  function token(){
    if(!ready()) return Promise.resolve(null);
    var c=load(); if(c) return Promise.resolve(c);
    if(!WARM) warm();
    if(!WARM) return Promise.resolve({ err:"gsi" });
    var w=WARM;
    return w.then(function(r){
      if(WARM===w) WARM=null;
      if(!r || r.err) return { err:(r&&r.err)||"denied" };
      return fetch("https://www.googleapis.com/oauth2/v3/userinfo",{ headers:{ Authorization:"Bearer "+r.t } })
        .then(function(x){ return x.json(); })
        .then(function(u){
          var em=String((u&&u.email)||"").toLowerCase();
          if(!C.domains.test(em) || !same(em)){ bad=true; return { err:"account", email:em, want:hint() }; }
          bad=false; var o={ t:r.t, exp:r.exp, email:em }; save(o); return o;
        })
        .catch(function(){ return { err:"userinfo" }; });
    });
  }

  /* ── MIME ── */
  var NL="\r\n";
  function b64Str(str){ var b=new TextEncoder().encode(String(str==null?"":str)), s=""; for(var i=0;i<b.length;i+=0x8000) s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000)); return btoa(s); }
  function wrap(b){ return String(b||"").replace(/\s+/g,"").replace(/(.{76})/g,"$1"+NL); }
  function hdr(s){
    s=String(s==null?"":s).replace(/[\r\n]+/g," ");
    if(/^[\x20-\x7E]*$/.test(s)) return s;
    var out=[], chunk="";
    Array.from(s).forEach(function(ch){ if(new TextEncoder().encode(chunk+ch).length>42){ out.push(chunk); chunk=""; } chunk+=ch; });
    if(chunk) out.push(chunk);
    return out.map(function(c){ return "=?UTF-8?B?"+b64Str(c)+"?="; }).join(NL+" ");
  }
  function addr(s){ return String(s||"").split(/[,;]/).map(function(x){ return x.trim(); }).filter(Boolean).join(", "); }
  function fname(n){ return hdr(String(n||"file").replace(/"/g,"'")); }
  function mime(m, tok){
    var id=Math.random().toString(36).slice(2)+Date.now().toString(36);
    var H=["MIME-Version: 1.0"];
    if(addr(m.to)) H.push("To: "+addr(m.to));
    if(addr(m.cc)) H.push("Cc: "+addr(m.cc));
    if(addr(m.bcc)) H.push("Bcc: "+addr(m.bcc));
    var rt=addr(m.replyTo);
    if(!rt && /@manimedicalhanoi\.com$/i.test(tok.email)) rt=local(tok.email)+"@"+C.replyDomain;
    if(rt && rt.toLowerCase()!==tok.email) H.push("Reply-To: "+rt);
    H.push("Subject: "+hdr(m.subject||""));
    var alt="alt"+id, rel="rel"+id, mix="mix"+id;
    var text=m.body||String(m.htmlBody||"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<br\s*\/?>/gi,"\n").replace(/<\/(p|div|tr|li|h\d)>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\n{3,}/g,"\n\n").trim();
    var altPart="Content-Type: multipart/alternative; boundary=\""+alt+"\""+NL+NL+
      "--"+alt+NL+"Content-Type: text/plain; charset=UTF-8"+NL+"Content-Transfer-Encoding: base64"+NL+NL+wrap(b64Str(text||" "))+NL+
      (m.htmlBody ? "--"+alt+NL+"Content-Type: text/html; charset=UTF-8"+NL+"Content-Transfer-Encoding: base64"+NL+NL+wrap(b64Str(m.htmlBody))+NL : "")+
      "--"+alt+"--"+NL;
    var body=altPart, inl=m.inl||{}, cids=Object.keys(inl);
    if(cids.length){
      body="Content-Type: multipart/related; boundary=\""+rel+"\""+NL+NL+"--"+rel+NL+altPart;
      cids.forEach(function(cid){ var x=inl[cid]; if(!x||!x.b64) return;
        body+="--"+rel+NL+"Content-Type: "+(x.type||"image/png")+NL+"Content-Transfer-Encoding: base64"+NL+
          "Content-ID: <"+cid+">"+NL+"Content-Disposition: inline; filename=\""+fname(cid)+"\""+NL+NL+wrap(x.b64)+NL; });
      body+="--"+rel+"--"+NL;
    }
    var att=(m.att||[]).filter(function(a){ return a&&a.b64; });
    if(att.length){
      var b2="Content-Type: multipart/mixed; boundary=\""+mix+"\""+NL+NL+"--"+mix+NL+body;
      att.forEach(function(a){
        b2+="--"+mix+NL+"Content-Type: "+(a.type||"application/octet-stream")+"; name=\""+fname(a.name)+"\""+NL+
          "Content-Transfer-Encoding: base64"+NL+"Content-Disposition: attachment; filename=\""+fname(a.name)+"\""+NL+NL+wrap(a.b64)+NL; });
      body=b2+"--"+mix+"--"+NL;
    }
    return H.join(NL)+NL+body;
  }
  function sendOne(tok, m){
    return fetch("https://gmail.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media",{
      method:"POST", headers:{ Authorization:"Bearer "+tok.t, "Content-Type":"message/rfc822" }, body:mime(m,tok)
    }).then(function(r){
      if(r.ok) return r.json();
      if(r.status===401) clear();
      return r.text().then(function(t){ var e=new Error("Gmail "+r.status+": "+String(t||"").replace(/\s+/g," ").slice(0,200)); e.status=r.status; throw e; });
    });
  }
  function send(tok, mails){
    var list=(mails||[]).slice(), n=0;
    function next(){
      if(!list.length) return Promise.resolve(n);
      return sendOne(tok, list.shift()).then(function(){ n++; return next(); }, function(e){ e.sent=n; throw e; });
    }
    return next();
  }

  window.SELFMAIL={
    v:"1.0",
    cfg:function(o){ for(var k in (o||{})) C[k]=o[k]; if(C.clientId) setTimeout(function(){ loadGsi().catch(function(){}); },2500); return C; },
    ready:ready, warm:warm, token:token, send:send, clear:clear, mime:mime, hint:hint,
    cached:function(){ return load(); }
  };
})();
