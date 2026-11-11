#!/usr/bin/env python3
"""Dựng geo/th-csyt.json — danh mục cơ sở khám chữa bệnh Thái Lan cho Working Map của CRM (tìm nhanh để thêm vào kế hoạch).
Nguồn: OpenStreetMap — bản xuất "health facilities" của HOT (raw-data-api, ODbL), tải tự động (GitHub Actions; máy Claude bị chặn mạng):
  https://s3.dualstack.us-east-1.amazonaws.com/production-raw-data-api/ISO3/THA/health_facilities/{points,polygons}/…geojson.zip
Giữ: bệnh viện (amenity / healthcare = hospital), phòng khám nha khoa (dentist), trung tâm / trạm y tế công (healthcare=centre, รพ.สต.).
Tỉnh gán theo toạ độ bằng ranh giới geo/th-provinces.json của chính app. Không sửa tay — sửa script rồi chạy lại.
Chạy: python3 -I tools/wmap/th_csyt.py [--cache <thư mục tải>]
"""
import argparse, io, json, os, re, sys, urllib.request, zipfile, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HOT = "https://s3.dualstack.us-east-1.amazonaws.com/production-raw-data-api/ISO3/THA/health_facilities/{t}/hotosm_tha_health_facilities_{t}_geojson.zip"

def fetch(t, cache):
    fn = os.path.join(cache, t + ".zip") if cache else None
    if fn and os.path.exists(fn):
        data = open(fn, "rb").read()
    else:
        req = urllib.request.Request(HOT.format(t=t), headers={"User-Agent": "mmh-crm-wmap/1.0"})
        data = urllib.request.urlopen(req, timeout=300).read()
        if fn:
            os.makedirs(cache, exist_ok=True); open(fn, "wb").write(data)
    z = zipfile.ZipFile(io.BytesIO(data))
    name = [n for n in z.namelist() if n.endswith(".geojson")][0]
    return json.loads(z.read(name).decode("utf-8"))["features"]

def centroid(g):
    t, c = g.get("type"), g.get("coordinates")
    if t == "Point": return c[0], c[1]
    pts = []
    def walk(x):
        if isinstance(x, list) and x and isinstance(x[0], (int, float)): pts.append(x)
        elif isinstance(x, list):
            for y in x: walk(y)
    walk(c)
    if not pts: return None
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)

def inring(x, y, r):
    ins = False; j = len(r) - 1
    for i in range(len(r)):
        xi, yi = r[i][0], r[i][1]; xj, yj = r[j][0], r[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi: ins = not ins
        j = i
    return ins

def provinces():
    fc = json.load(open(os.path.join(ROOT, "geo", "th-provinces.json"), encoding="utf-8"))
    out = []
    for f in fc["features"]:
        g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        xs = [p[0] for poly in polys for p in poly[0]]; ys = [p[1] for poly in polys for p in poly[0]]
        out.append((f["properties"]["n"], polys, (min(xs), min(ys), max(xs), max(ys))))
    return out

def prov_of(x, y, P):
    for n, polys, b in P:
        if not (b[0] <= x <= b[2] and b[1] <= y <= b[3]): continue
        for poly in polys:
            if inring(x, y, poly[0]) and not any(inring(x, y, h) for h in poly[1:]): return n
    return ""

def kind(p):
    a, h = (p.get("amenity") or "").lower(), (p.get("healthcare") or "").lower()
    if a == "hospital" or h == "hospital": return "h"
    if a == "dentist" or h == "dentist": return "d"
    if h == "centre" or re.search(r"health (promoting|center|centre)|โรงพยาบาลส่งเสริมสุขภาพ|สถานีอนามัย|ศูนย์สุขภาพชุมชน", (p.get("name") or "") + " " + (p.get("name:en") or ""), re.I): return "c"
    return ""

def own(p):
    o = (p.get("operator:type") or "").lower(); n = (p.get("name") or "") + " " + (p.get("name:en") or "") + " " + (p.get("operator") or "")
    if o in ("government", "public", "community", "military"): return "cl"
    if o in ("private", "private_non_profit", "business"): return "tn"
    if re.search(r"กระทรวงสาธารณสุข|ministry of public health|provincial|community hospital|โรงพยาบาลชุมชน|โรงพยาบาลจังหวัด|โรงพยาบาลส่งเสริม|army|navy|police|university|มหาวิทยาลัย", n, re.I): return "cl"
    return ""

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--cache", default=""); a = ap.parse_args()
    P = provinces(); rows = []; seen = set()
    for t in ("points", "polygons"):
        for f in fetch(t, a.cache):
            p = f.get("properties") or {}; k = kind(p)
            if not k: continue
            nm, en = (p.get("name") or "").strip(), (p.get("name:en") or "").strip()
            if not nm and not en: continue
            c = centroid(f.get("geometry") or {})
            if not c: continue
            x, y = round(c[0], 5), round(c[1], 5)
            key = (en or nm).lower() + "|" + str(round(x, 3)) + "|" + str(round(y, 3))
            if key in seen: continue
            seen.add(key)
            pv = prov_of(x, y, P)
            if not pv: continue
            addr = " ".join(s for s in [p.get("addr:housenumber"), p.get("addr:street"), p.get("addr:subdistrict"), p.get("addr:district") or p.get("addr:city")] if s).strip()
            rows.append([str(p.get("osm_type", "n"))[:1] + str(p.get("osm_id", len(rows))), en or nm, nm if en and nm != en else "", k, own(p), pv, addr[:120], y, x])
    rows.sort(key=lambda r: (r[5], r[3], r[1]))
    out = {"v": datetime.date.today().isoformat(), "src": "OpenStreetMap (HOT export, ODbL)",
           "cols": ["id", "n", "th", "t", "own", "p", "a", "lat", "lng"],
           "types": {"h": "Hospital", "d": "Dental clinic", "c": "Health centre"}, "rows": rows}
    json.dump(out, open(os.path.join(ROOT, "geo", "th-csyt.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    cnt = {}
    for r in rows: cnt[r[3]] = cnt.get(r[3], 0) + 1
    print("th-csyt:", len(rows), cnt)

if __name__ == "__main__":
    main()
