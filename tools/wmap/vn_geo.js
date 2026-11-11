/* Dựng geo/vn-provinces.json (34 tỉnh / thành mới, GeoJSON) + geo/vn-csyt.json (danh mục cơ sở y tế công lập)
   từ Tender Map (kho ManiMedicalHanoi/Tender-Result ▸ map/vn-geo.js · map/csyt.js — nguồn @xdev-asia/vietnam-map-34-provinces (MIT),
   OpenStreetMap HOT export (ODbL) + bên mời thầu KQTT). Chạy: node tools/wmap/vn_geo.js <thư mục Tender-Result/map> */
const fs = require("fs"), path = require("path"), vm = require("vm");
const src = process.argv[2] || "../Tender-Result/map", out = path.join(__dirname, "..", "..", "geo");
function load(f){ const ctx = { window:{} }; vm.runInNewContext(fs.readFileSync(path.join(src, f), "utf8"), ctx); return ctx.window; }
const T = load("vn-geo.js").VN_TOPO, tr = T.transform;
const arcs = T.arcs.map(a => { let x = 0, y = 0; return a.map(p => { x += p[0]; y += p[1]; return [+(x * tr.scale[0] + tr.translate[0]).toFixed(3), +(y * tr.scale[1] + tr.translate[1]).toFixed(3)]; }); });
function arc(i){ return i < 0 ? arcs[~i].slice().reverse() : arcs[i]; }
function ring(ix){ let r = []; ix.forEach((i, k) => { const a = arc(i); r = r.concat(k ? a.slice(1) : a); }); return r; }
function geom(g){
  if (g.type === "Polygon") return { type:"Polygon", coordinates:g.arcs.map(ring) };
  if (g.type === "MultiPolygon") return { type:"MultiPolygon", coordinates:g.arcs.map(p => p.map(ring)) };
  return null;
}
const fc = { type:"FeatureCollection", source:"Tender Map vn-geo.js (34 tỉnh / thành từ 01/07/2025; @xdev-asia/vietnam-map-34-provinces, MIT)", features:[] };
T.objects.new.geometries.forEach(g => { const gg = geom(g); if (gg) fc.features.push({ type:"Feature", properties:{ n:g.properties.n }, geometry:gg }); });
fs.writeFileSync(path.join(out, "wm-vn-geo.js"), "/* Working Map — 34 tỉnh / thành VN (dựng bằng tools/wmap/vn_geo.js, không sửa tay) */\nwindow.WM_DATA=window.WM_DATA||{};WM_DATA.vnGeo=" + JSON.stringify(fc) + ";\n");
const th = JSON.parse(fs.readFileSync(path.join(out, "th-provinces.json"), "utf8"));
fs.writeFileSync(path.join(out, "wm-th-geo.js"), "/* Working Map — 77 tỉnh Thái Lan (bản sao geo/th-provinces.json, dựng bằng tools/wmap/vn_geo.js) */\nwindow.WM_DATA=window.WM_DATA||{};WM_DATA.thGeo=" + JSON.stringify(th) + ";\n");
const C = load("csyt.js").CSYT;
const keep = ["id","n","t","sp","lv","p","o","a","lat","lng","own"], ix = keep.map(k => C.cols.indexOf(k));
const rows = C.rows.map(r => ix.map(i => r[i] === undefined ? "" : r[i]));
fs.writeFileSync(path.join(out, "wm-vn-csyt.js"), "/* Working Map — danh mục cơ sở y tế VN (Tender Map csyt.js; OSM ODbL + KQTT). Dựng bằng tools/wmap/vn_geo.js */\nwindow.WM_DATA=window.WM_DATA||{};WM_DATA.vnCsyt=" + JSON.stringify({ v:C.v, src:C.src, cols:keep, types:C.types, spec:C.spec, rows }) + ";\n");
console.log("vn-provinces", fc.features.length, "· vn-csyt", rows.length);
