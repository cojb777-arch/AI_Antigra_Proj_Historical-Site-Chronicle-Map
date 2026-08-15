/**
 * DBpedia SPARQL API 連携モジュール
 * Wikipediaの構造化ナレッジグラフから世界史的スポット・出来事を検索
 */

export class DbpediaService {
  constructor() {
    this.endpoint = "https://dbpedia.org/sparql";
  }

  /**
   * 指定座標周辺の DBpedia 歴史アイテムを検索
   */
  async fetchEventsAround(lat, lng, radiusKm = 10) {
    // DBpedia SPARQL クエリ (指定座標の±0.05度範囲内の位置情報付きアイテム)
    const delta = (radiusKm * 0.01).toFixed(4);
    const minLat = (lat - delta).toFixed(4);
    const maxLat = (lat + delta).toFixed(4);
    const minLng = (lng - delta).toFixed(4);
    const maxLng = (lng + delta).toFixed(4);

    const query = `
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbo: <http://dbpedia.org/ontology/>

SELECT ?subject ?label ?comment ?lat ?long WHERE {
  ?subject geo:lat ?lat ;
           geo:long ?long ;
           rdfs:label ?label .
  OPTIONAL { ?subject rdfs:comment ?comment . }
  FILTER (?lat >= ${minLat} && ?lat <= ${maxLat} && ?long >= ${minLng} && ?long <= ${maxLng})
  FILTER (lang(?label) = 'ja' || lang(?label) = 'en')
  FILTER (lang(?comment) = 'ja' || lang(?comment) = 'en')
}
LIMIT 12
    `;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `${this.endpoint}?query=${encodeURIComponent(query)}&format=json`;
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`DBpedia Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.results || !data.results.bindings) return [];

      return this.parseDbpediaResults(data.results.bindings);
    } catch (error) {
      console.warn("DBpedia fetch skipped:", error);
      return [];
    }
  }

  parseDbpediaResults(bindings) {
    const map = new Map();
    for (const b of bindings) {
      const id = b.subject.value;
      if (map.has(id)) continue;

      const title = b.label ? b.label.value : "DBpedia 歴史スポット";
      const desc = b.comment ? b.comment.value : "DBpediaオープンナレッジベースに登録されている世界史・地理スポットです。";
      const lat = parseFloat(b.lat.value);
      const lng = parseFloat(b.long.value);

      if (isNaN(lat) || isNaN(lng)) continue;

      map.set(id, {
        id: "dbp-" + id.split("/").pop(),
        title: title,
        year: null,
        era: "世界史アーカイブ",
        category: "culture",
        categoryLabel: "DBpedia ナレッジ",
        locationName: title,
        coordinates: [lng, lat],
        shortDesc: desc.length > 100 ? desc.substring(0, 100) + "..." : desc,
        fullDesc: `${desc}\n\nDBpedia URI: ${id}`,
        imageUrl: null,
        wikiUrl: id,
        isExternal: true,
        periodGroup: "all",
        tags: ["DBpedia", "世界史ナレッジ"]
      });
    }

    return Array.from(map.values());
  }
}
