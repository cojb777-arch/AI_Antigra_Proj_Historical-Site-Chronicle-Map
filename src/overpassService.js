/**
 * Overpass API (OpenStreetMap 歴史タグ `historic=*` 検索) 連携モジュール
 * 世界中の城、遺跡、古戦場、記念碑、遺構をリアルタイム取得
 */

export class OverpassService {
  constructor() {
    this.endpoint = "https://overpass-api.de/api/interpreter";
  }

  /**
   * 指定座標 (lat, lng) 周辺の OSM 歴史スポット (`historic=*`) を検索
   * @param {number} lat - 緯度
   * @param {number} lng - 経度
   * @param {number} radiusKm - 半径 (km)
   */
  async fetchEventsAround(lat, lng, radiusKm = 5) {
    const radiusMeters = radiusKm * 1000;
    
    // Overpass QL クエリ: 指定中心点周りの historic=* タグ付きノード
    const query = `
[out:json][timeout:5];
(
  node["historic"](around:${radiusMeters},${lat},${lng});
);
out body 15;
    `;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(this.endpoint, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Overpass API Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.elements) return [];

      return this.parseOverpassResults(data.elements);
    } catch (error) {
      console.warn("Overpass API fetch skipped:", error);
      return [];
    }
  }

  parseOverpassResults(elements) {
    return elements.map((elem, idx) => {
      const tags = elem.tags || {};
      const name = tags.name || tags["name:ja"] || tags["name:en"] || `歴史的スポット (${tags.historic || "史跡"})`;
      const historicType = tags.historic || "史跡";
      const desc = tags.description || tags.note || `OpenStreetMapに登録されている歴史遺構・史跡 (${historicType}) です。`;

      return {
        id: "osm-" + (elem.id || idx),
        title: name,
        year: tags.start_date || null,
        era: tags.start_date ? `${tags.start_date}年頃` : "歴史遺構",
        category: "culture",
        categoryLabel: `OSM 史跡 (${historicType})`,
        locationName: name,
        coordinates: [elem.lon, elem.lat], // [lng, lat]
        shortDesc: desc.length > 100 ? desc.substring(0, 100) + "..." : desc,
        fullDesc: `${desc}\n\nタイプ: ${historicType}\nWikipedia: ${tags.wikipedia ? 'https://wikipedia.org/wiki/' + tags.wikipedia : 'なし'}`,
        imageUrl: null,
        wikiUrl: tags.wikipedia ? `https://wikipedia.org/wiki/${tags.wikipedia}` : null,
        isExternal: true,
        periodGroup: "all",
        tags: ["OpenStreetMap", "史跡", historicType]
      };
    }).filter(e => e.title && e.coordinates);
  }
}
