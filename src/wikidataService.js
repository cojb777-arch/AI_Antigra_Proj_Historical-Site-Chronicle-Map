/**
 * Wikidata SPARQL API 連携モジュール (毎回ランダム発見版)
 */

export class WikidataService {
  constructor() {
    this.endpoint = "https://query.wikidata.org/sparql";
  }

  /**
   * 指定座標 (lat, lng) と半径 (km) 周辺の歴史的スポットをランダム抽出
   */
  async fetchEventsAround(lat, lng, radiusKm = 5) {
    // 毎回異なるオフセットでランダムに多様な歴史データを取得
    const randomOffset = Math.floor(Math.random() * 25);

    const sparqlQuery = `
SELECT ?item ?itemLabel ?itemDescription ?coord ?image ?article ?date WHERE {
  SERVICE wikibase:around {
    ?item wdt:P625 ?coord .
    bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral .
    bd:serviceParam wikibase:radius "${radiusKm}" .
  }
  OPTIONAL { ?item wdt:P18 ?image . }
  OPTIONAL { ?item wdt:P585 ?date . }
  OPTIONAL {
    ?article schema:about ?item ;
             schema:inLanguage "ja" ;
             schema:isPartOf <https://ja.wikipedia.org/> .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ja,en" . }
}
OFFSET ${randomOffset}
LIMIT 30
    `;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `${this.endpoint}?query=${encodeURIComponent(sparqlQuery)}&format=json&_r=${Date.now()}`;
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Accept": "application/sparql-results+json",
          "User-Agent": "ChronicleMapApp/1.0 (https://openlayers.org)"
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Wikidata HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const results = this.parseSparqlResults(data.results.bindings);
      return this.shuffleArray(results);
    } catch (error) {
      console.warn("Wikidata fetch skipped:", error);
      return [];
    }
  }

  parseSparqlResults(bindings) {
    const eventsMap = new Map();

    for (const b of bindings) {
      const id = b.item.value;
      if (eventsMap.has(id)) continue;

      const title = b.itemLabel ? b.itemLabel.value : "不明な歴史スポット";
      if (!title || title.startsWith("Q") && !isNaN(title.substring(1))) {
        continue; 
      }

      const desc = b.itemDescription ? b.itemDescription.value : "Wikidata登録スポット";
      
      let coordinates = null;
      if (b.coord && b.coord.value) {
        const match = b.coord.value.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
        if (match) {
          coordinates = [parseFloat(match[1]), parseFloat(match[2])];
        }
      }

      if (!coordinates) continue;

      let year = null;
      let era = "歴史";
      if (b.date && b.date.value) {
        const d = new Date(b.date.value);
        if (!isNaN(d.getFullYear())) {
          year = d.getFullYear();
          era = `${year}年`;
        }
      }

      let imageUrl = b.image ? b.image.value : null;
      if (imageUrl && imageUrl.startsWith("http:")) {
        imageUrl = imageUrl.replace("http:", "https:");
      }

      eventsMap.set(id, {
        id: "wiki-" + id.split("/").pop(),
        title: title,
        year: year || "年代不詳",
        era: era,
        category: "culture",
        categoryLabel: "Wikidata 史跡・出来事",
        locationName: title,
        coordinates: coordinates,
        shortDesc: desc,
        fullDesc: `${desc}\n\nWikipedia記事: ${b.article ? b.article.value : "なし"}`,
        imageUrl: imageUrl,
        wikiUrl: b.article ? b.article.value : null,
        isExternal: true,
        periodGroup: "all",
        tags: ["Wikidata", "オープンデータ"]
      });
    }

    return Array.from(eventsMap.values());
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
