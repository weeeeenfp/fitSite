// 線上熱量查詢 —— Open Food Facts 開放資料庫（免費、免金鑰、支援 CORS）。
// 純前端直接查詢；查不到或離線時回傳空陣列，由呼叫端退回內建資料庫。

export interface OnlineFoodMatch {
  name: string;
  kcal: number; // 每 100g 的熱量
  portion: string; // 固定為「每100g」
  source: "online";
}

interface OffProduct {
  product_name?: string;
  product_name_zh?: string;
  brands?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    energy_100g?: number;
    "energy-kj_100g"?: number;
  };
}

function kcalOf(n: OffProduct["nutriments"]): number | null {
  if (!n) return null;
  if (typeof n["energy-kcal_100g"] === "number") return Math.round(n["energy-kcal_100g"]);
  const kj = n["energy-kj_100g"] ?? n.energy_100g;
  if (typeof kj === "number" && kj > 0) return Math.round(kj / 4.184);
  return null;
}

export async function searchOnlineFoods(query: string, limit = 5): Promise<OnlineFoodMatch[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url =
    "https://world.openfoodfacts.org/cgi/search.pl?" +
    new URLSearchParams({
      search_terms: q,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: String(limit * 2),
      fields: "product_name,product_name_zh,brands,nutriments",
    }).toString();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: OffProduct[] };
    const out: OnlineFoodMatch[] = [];
    for (const p of data.products ?? []) {
      const kcal = kcalOf(p.nutriments);
      const name = (p.product_name_zh || p.product_name || "").trim();
      if (!kcal || !name) continue;
      const label = p.brands ? `${name}（${p.brands.split(",")[0].trim()}）` : name;
      out.push({ name: label, kcal, portion: "每100g", source: "online" });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
