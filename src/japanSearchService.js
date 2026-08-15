/**
 * ジャパンサーチ (Japan Search) 簡易Web API 連携モジュール (毎回ランダム発見版)
 */

export class JapanSearchService {
  constructor() {
    this.endpoint = "https://jpsearch.go.jp/api/item/search/jps-cross";
  }

  /**
   * 指定の緯度 (lat)、経度 (lng)、半径 (km) で周辺のデジタルアーカイブをランダム横断検索
   */
  async fetchEventsAround(lat, lng, radiusKm = 5) {
    const latStr = parseFloat(lat).toFixed(5);
    const lngStr = parseFloat(lng).toFixed(5);
    const radiusParam = `${radiusKm}km`;

    // 毎回異なる開始位置 (from/offset) をランダム設定
    const randomFrom = Math.floor(Math.random() * 30) + 1;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // 例: https://jpsearch.go.jp/api/item/search/jps-cross?g-coordinates=35.29784,139.47745,5km&from=15&size=25
      const url = `${this.endpoint}?g-coordinates=${latStr},${lngStr},${radiusParam}&from=${randomFrom}&size=25&_r=${Date.now()}`;
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Japan Search API Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.list) return [];

      const results = this.parseJapanSearchResults(data.list, [parseFloat(lng), parseFloat(lat)]);
      return this.shuffleArray(results);
    } catch (error) {
      console.warn("Japan Search fetch error:", error);
      return [];
    }
  }

  /**
   * 地名 (q-loc) 検索
   */
  async searchByQuery(queryText) {
    if (!queryText) return [];
    const randomFrom = Math.floor(Math.random() * 20) + 1;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const url = `${this.endpoint}?q-loc=${encodeURIComponent(queryText)}&from=${randomFrom}&size=15&_r=${Date.now()}`;
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Japan Search location search error: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.list) return [];

      const results = this.parseJapanSearchResults(data.list, null);
      return this.shuffleArray(results);
    } catch (error) {
      console.warn("Japan Search q-loc error:", error);
      return [];
    }
  }

  parseJapanSearchResults(items, fallbackLonLat = null) {
    const results = items.map((item, idx) => {
      const common = item.common || {};
      
      let title = "日本の歴史・文化情報";
      if (common.title) {
        title = Array.isArray(common.title) ? common.title[0] : common.title;
      }

      let desc = "ジャパンサーチ（国立国会図書館・各都道府県文化財デジタルアーカイブ）に登録されている歴史資料です。";
      if (common.description) {
        desc = Array.isArray(common.description) ? common.description[0] : common.description;
      } else if (common.contents) {
        desc = Array.isArray(common.contents) ? common.contents[0] : common.contents;
      }

      let imageUrl = null;
      if (common.thumbnail) {
        imageUrl = Array.isArray(common.thumbnail) ? common.thumbnail[0] : common.thumbnail;
      }

      let era = "歴史・デジタルアーカイブ";
      if (common.temporal) {
        era = Array.isArray(common.temporal) ? common.temporal.join(" ") : common.temporal;
      }

      let linkUrl = item.link || (common.link ? (Array.isArray(common.link) ? common.link[0] : common.link) : `https://jpsearch.go.jp/item/${item.id}`);

      let itemCoordinates = null;
      if (common.coordinates) {
        const coordsArr = Array.isArray(common.coordinates) ? common.coordinates : [common.coordinates];
        if (coordsArr.length >= 2) {
          const v1 = parseFloat(coordsArr[0]);
          const v2 = parseFloat(coordsArr[1]);
          if (!isNaN(v1) && !isNaN(v2)) {
            if (v1 > 120 && v1 < 150) {
              itemCoordinates = [v1, v2];
            } else if (v2 > 120 && v2 < 150) {
              itemCoordinates = [v2, v1];
            }
          }
        }
      }

      if (!itemCoordinates && fallbackLonLat) {
        const jitterLng = (Math.random() - 0.5) * 0.005;
        const jitterLat = (Math.random() - 0.5) * 0.005;
        itemCoordinates = [fallbackLonLat[0] + jitterLng, fallbackLonLat[1] + jitterLat];
      }

      return {
        id: "jps-" + (item.id || idx + "-" + Date.now()),
        title: title,
        year: null,
        era: era,
        category: "culture",
        categoryLabel: "ジャパンサーチ (公式)",
        locationName: common.location ? (Array.isArray(common.location) ? common.location.join(" ") : common.location) : "周辺スポット",
        coordinates: itemCoordinates,
        shortDesc: desc.length > 100 ? desc.substring(0, 100) + "..." : desc,
        fullDesc: `${desc}\n\n提供元: ジャパンサーチ (国立国会図書館) / ${common.provider || "デジタルアーカイブ"}`,
        imageUrl: imageUrl,
        wikiUrl: linkUrl,
        isExternal: true,
        periodGroup: "all",
        tags: ["ジャパンサーチ", "デジタルアーカイブ", "国会図書館"]
      };
    }).filter(e => e.title && e.coordinates);

    return results;
  }

  shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
