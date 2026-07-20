// 內建常見食物熱量表 —— 離線即時查詢。kcal 為「一份典型份量」的估計值。
// 這是本機估算，數字為概略參考，實際依店家/份量會有差異。

export interface FoodItem {
  name: string;
  kcal: number; // 一份典型份量
  portion: string; // 份量描述
  aliases?: string[];
}

export const FOODS: FoodItem[] = [
  // 主食／飯類
  { name: "白飯", kcal: 280, portion: "一碗", aliases: ["飯", "米飯"] },
  { name: "糙米飯", kcal: 260, portion: "一碗" },
  { name: "滷肉飯", kcal: 420, portion: "一碗", aliases: ["肉燥飯"] },
  { name: "雞肉飯", kcal: 400, portion: "一碗", aliases: ["火雞肉飯"] },
  { name: "牛肉燴飯", kcal: 650, portion: "一份" },
  { name: "咖哩飯", kcal: 640, portion: "一份" },
  { name: "炒飯", kcal: 620, portion: "一盤", aliases: ["蛋炒飯"] },
  { name: "油飯", kcal: 480, portion: "一碗" },
  { name: "壽司", kcal: 350, portion: "一盒(6-8貫)" },
  { name: "飯糰", kcal: 400, portion: "一個", aliases: ["御飯糰"] },
  // 便當
  { name: "雞腿便當", kcal: 800, portion: "一個" },
  { name: "雞排便當", kcal: 850, portion: "一個" },
  { name: "排骨便當", kcal: 830, portion: "一個" },
  { name: "雞胸便當", kcal: 600, portion: "一個", aliases: ["雞胸肉便當"] },
  { name: "焢肉便當", kcal: 900, portion: "一個", aliases: ["爌肉便當"] },
  // 麵類
  { name: "牛肉麵", kcal: 550, portion: "一碗" },
  { name: "陽春麵", kcal: 350, portion: "一碗" },
  { name: "乾麵", kcal: 450, portion: "一碗", aliases: ["麻醬麵"] },
  { name: "義大利麵", kcal: 600, portion: "一份", aliases: ["義大利麵條", "pasta"] },
  { name: "炒麵", kcal: 500, portion: "一盤" },
  { name: "泡麵", kcal: 470, portion: "一包", aliases: ["科學麵", "王子麵"] },
  { name: "米粉湯", kcal: 300, portion: "一碗" },
  { name: "餛飩麵", kcal: 420, portion: "一碗" },
  { name: "拉麵", kcal: 550, portion: "一碗", aliases: ["日式拉麵"] },
  { name: "涼麵", kcal: 480, portion: "一份" },
  // 早餐
  { name: "蛋餅", kcal: 250, portion: "一份" },
  { name: "鮪魚蛋餅", kcal: 320, portion: "一份" },
  { name: "起司蛋餅", kcal: 320, portion: "一份" },
  { name: "漢堡", kcal: 450, portion: "一個", aliases: ["豬肉漢堡", "雞腿堡"] },
  { name: "吐司", kcal: 150, portion: "一片" },
  { name: "火腿蛋吐司", kcal: 320, portion: "一份" },
  { name: "肉鬆吐司", kcal: 300, portion: "一份" },
  { name: "蘿蔔糕", kcal: 300, portion: "一份" },
  { name: "飯糰(飯團)", kcal: 400, portion: "一個" },
  { name: "三明治", kcal: 350, portion: "一份", aliases: ["火腿三明治"] },
  { name: "水煎包", kcal: 220, portion: "一個" },
  { name: "小籠包", kcal: 300, portion: "一籠(5顆)" },
  { name: "饅頭", kcal: 280, portion: "一個" },
  { name: "包子", kcal: 250, portion: "一個", aliases: ["肉包", "菜包"] },
  { name: "燒餅油條", kcal: 450, portion: "一份" },
  // 蛋白質
  { name: "水煮蛋", kcal: 75, portion: "一顆", aliases: ["雞蛋", "白煮蛋"] },
  { name: "荷包蛋", kcal: 110, portion: "一顆", aliases: ["煎蛋"] },
  { name: "雞胸肉", kcal: 165, portion: "100g", aliases: ["雞胸"] },
  { name: "雞腿", kcal: 210, portion: "一支(去骨100g)" },
  { name: "豆漿", kcal: 130, portion: "一杯(400ml)", aliases: ["無糖豆漿"] },
  { name: "無糖豆漿", kcal: 70, portion: "一杯(400ml)" },
  { name: "豆腐", kcal: 120, portion: "一盒" },
  { name: "鮭魚", kcal: 210, portion: "100g" },
  { name: "牛排", kcal: 400, portion: "一份(150g)" },
  { name: "鹹酥雞", kcal: 500, portion: "一份", aliases: ["鹽酥雞"] },
  { name: "雞排", kcal: 450, portion: "一片" },
  { name: "滷蛋", kcal: 90, portion: "一顆" },
  { name: "茶葉蛋", kcal: 75, portion: "一顆" },
  // 湯／配菜
  { name: "燙青菜", kcal: 60, portion: "一份" },
  { name: "生菜沙拉", kcal: 120, portion: "一份(含醬)" },
  { name: "味噌湯", kcal: 60, portion: "一碗" },
  { name: "玉米濃湯", kcal: 180, portion: "一碗" },
  { name: "關東煮", kcal: 250, portion: "一份(綜合)" },
  // 水果
  { name: "香蕉", kcal: 90, portion: "一根" },
  { name: "蘋果", kcal: 95, portion: "一顆" },
  { name: "芭樂", kcal: 70, portion: "一顆" },
  { name: "橘子", kcal: 60, portion: "一顆" },
  { name: "西瓜", kcal: 90, portion: "一片" },
  { name: "葡萄", kcal: 85, portion: "一份(15顆)" },
  { name: "芒果", kcal: 100, portion: "一份" },
  // 飲料
  { name: "珍珠奶茶", kcal: 550, portion: "一杯(700ml)", aliases: ["珍奶", "波霸奶茶"] },
  { name: "奶茶", kcal: 350, portion: "一杯(700ml)" },
  { name: "紅茶", kcal: 150, portion: "一杯(含糖)" },
  { name: "無糖綠茶", kcal: 0, portion: "一杯", aliases: ["無糖茶"] },
  { name: "美式咖啡", kcal: 10, portion: "一杯", aliases: ["黑咖啡"] },
  { name: "拿鐵", kcal: 180, portion: "一杯(中)", aliases: ["latte"] },
  { name: "可樂", kcal: 210, portion: "一罐(600ml)", aliases: ["汽水"] },
  { name: "運動飲料", kcal: 150, portion: "一瓶(600ml)", aliases: ["寶礦力", "舒跑"] },
  { name: "柳橙汁", kcal: 220, portion: "一杯" },
  { name: "牛奶", kcal: 130, portion: "一杯(240ml)", aliases: ["鮮奶"] },
  { name: "高蛋白", kcal: 120, portion: "一份(一匙)", aliases: ["乳清", "蛋白粉", "高蛋白飲"] },
  // 點心／零食
  { name: "蛋糕", kcal: 350, portion: "一塊" },
  { name: "餅乾", kcal: 150, portion: "一份(5片)" },
  { name: "洋芋片", kcal: 300, portion: "一包(小)" },
  { name: "巧克力", kcal: 250, portion: "一片(50g)" },
  { name: "冰淇淋", kcal: 200, portion: "一球" },
  { name: "麵包", kcal: 280, portion: "一個(甜)" },
  { name: "紅豆餅", kcal: 180, portion: "一個", aliases: ["車輪餅"] },
  { name: "雞蛋糕", kcal: 250, portion: "一份" },
  { name: "地瓜", kcal: 130, portion: "一條(中)", aliases: ["烤地瓜"] },
];

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export interface FoodMatch {
  name: string;
  kcal: number;
  portion: string;
  source: "local";
}

// 內建表模糊搜尋：名稱或別名包含關鍵字即命中，完全相符排前面。
export function searchLocalFoods(query: string, limit = 6): FoodMatch[] {
  const q = normalize(query);
  if (!q) return [];
  const scored: { item: FoodItem; score: number }[] = [];
  for (const item of FOODS) {
    const hay = [item.name, ...(item.aliases ?? [])].map(normalize);
    let score = -1;
    for (const h of hay) {
      if (h === q) { score = Math.max(score, 3); }
      else if (h.startsWith(q)) { score = Math.max(score, 2); }
      else if (h.includes(q) || q.includes(h)) { score = Math.max(score, 1); }
    }
    if (score >= 0) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ item }) => ({
    name: item.name,
    kcal: item.kcal,
    portion: item.portion,
    source: "local" as const,
  }));
}
