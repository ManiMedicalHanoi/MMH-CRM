/* MMH CRM — service worker (v34.4, 02/11/2026; v38.4 20/11/2026: file có ?v= lấy bản đã lưu, trang mở bằng bản đã lưu khi mạng chậm quá 4 giây). Cho phép CÀI app (PWA) và mở nhanh hơn. Cùng nguyên tắc với Training Hub v6.4:
   KHÔNG BAO GIỜ giữ dữ liệu cũ.
   · Trang, *.js, *.json, *.webmanifest của app: lấy từ mạng trước; mất mạng mới dùng bản đã lưu.
   · Ảnh / biểu tượng cùng trang: trả bản đã lưu cho nhanh RỒI tải bản mới về thay.
   · Apps Script, Google Drive, font, CDN, mọi tên miền khác, file PDF / Word: không đụng tới (đi thẳng ra mạng).
   Gỡ khẩn cấp: thay toàn bộ file này bằng 1 dòng
     self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.registration.unregister()));
*/
const V = 'mmh-crm-38.4';
const SCOPE = new URL(self.registration.scope).pathname;
const SHELL = [SCOPE, SCOPE + 'manifest.webmanifest', SCOPE + 'media/app/icon-192.png', SCOPE + 'media/app/apple-touch-icon.png'];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mmh-crm-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));

const fresh = req => fetch(req).then(res => {
  if (res && res.ok && res.type === 'basic') { const c = res.clone(); caches.open(V).then(ca => ca.put(req, c)); }
  return res;
});

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(SCOPE)) return;
  if (r.headers.has('range') || /\.(pdf|docx|xlsx|mp4|webm|mov)$/i.test(u.pathname)) return;
  if (/\.(png|jpe?g|webp|gif|svg|ico|woff2?)$/i.test(u.pathname)) {
    const net = fresh(r);
    e.waitUntil(net.then(() => {}, () => {}));
    e.respondWith(caches.match(r).then(m => m || net));
    return;
  }
  /* v38.4 — file có số phiên bản trong đường dẫn (…js?v=2.4): mỗi phiên bản 1 đường dẫn riêng ⇒ không bao giờ cũ ⇒ lấy bản đã lưu ngay, không hỏi mạng */
  if (/[?&]v=[\w.-]+/.test(u.search) && r.mode !== 'navigate') {
    e.respondWith(caches.match(r).then(m => m || fresh(r)));
    return;
  }
  /* v38.4 — mở trang: mạng chậm (quá 4 giây, sóng yếu) ⇒ dùng trang đã lưu cho nhanh, bản mới tải xong lưu lại cho lần mở sau */
  if (r.mode === 'navigate') {
    const net = fresh(r);
    e.waitUntil(net.then(() => {}, () => {}));
    e.respondWith(new Promise(ok => {
      let done = false;
      const give = res => { if (!done && res) { done = true; ok(res); } };
      const fallback = () => caches.match(r, {ignoreSearch: true}).then(m => m || caches.match(SCOPE));
      const t = setTimeout(() => fallback().then(m => give(m)), 4000);
      net.then(res => { clearTimeout(t); give(res); },
        () => { clearTimeout(t); fallback().then(m => give(m || Response.error())); });
    }));
    return;
  }
  /* script + dữ liệu không có số phiên bản: mạng trước, hết mạng ⇒ bản đã lưu */
  e.respondWith(fresh(r).catch(() => caches.match(r, {ignoreSearch: r.mode === 'navigate'}).then(m => m || (r.mode === 'navigate' ? caches.match(SCOPE) : undefined)).then(m => m || Response.error())));
});
