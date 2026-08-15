/**
 * OpenHistoricalMap (OHM) 連携モジュール
 * 歴史地図・過去の遺構・古建築のジオデータ検索
 */

export class OhmService {
  constructor() {
    this.endpoint = "https://overpass-api.de/api/interpreter";
  }

  /**
   * 指定座標周辺の歴史的建造物・記念碑・遺跡を検索
   */
  async fetchEventsAround(lat, lng, radiusKm = 5) {
    const radiusMeters = radiusKm * 1000;
    
    // OHM / 歴史建造物 クエリ
    const query = `
[out:json][timeout:5];
(
  node["historic"](around:${radiusMeters},${lat},${lng});
);
out body 10;
    `;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(this.endpoint, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) return [];

      const data = await response.json();
      if (!data || !data.elements) return [];

      return data.elements.map((elem, idx) => {
        const tags = elem.tags || {};
        const name = tags.name || tags["name:ja"] || tags["name:en"] || `歴史遺構 (${tags.historic || "遺跡"})`;
        const startDate = tags.start_date || tags["start_date:edtf"] || "歴史年代";

        return {
          id: "ohm-" + (elem.id || idx),
          title: name,
          year: parseInt(startDate) || null,
          era: `${startDate}`,
          category: "culture",
          categoryLabel: "OpenHistoricalMap 遺構",
          locationName: name,
          coordinates: [elem.lon, elem.lat],
          shortDesc: `OpenHistoricalMapに記録されている${startDate}時代の歴史遺構 (${tags.historic || "史跡"}) です。`,
          fullDesc: `歴史遺構名称: ${name}\n推定時代: ${startDate}\nデータソース: OpenHistoricalMap`,
          imageUrl: null,
          wikiUrl: null,
          isExternal: true,
          periodGroup: "all",
          tags: ["OpenHistoricalMap", "OHM", "歴史遺構"]
        };
      }).filter(e => e.title && e.coordinates);
    } catch (error) {
      console.warn("OHM fetch skipped:", error);
      return [];
    }
  }
}
