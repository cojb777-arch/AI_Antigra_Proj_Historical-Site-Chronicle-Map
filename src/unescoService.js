/**
 * ユネスコ世界遺産 (UNESCO World Heritage) 検索連携モジュール
 */

export class UnescoService {
  constructor() {
    // 世界遺産の主要なスポットデータセット (日本および世界の代表的世界文化遺産)
    this.unescoSites = [
      { id: "unesco-1", title: "法隆寺地域の仏教建造物", coordinates: [135.7356, 34.6142], year: 1993, era: "飛鳥時代 (607年創建)", locationName: "奈良県斑鳩町", shortDesc: "世界最古の木造建築群であり、日本で初めて登録されたユネスコ世界文化遺産です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-2", title: "姫路城 (白鷺城)", coordinates: [134.6939, 34.8394], year: 1993, era: "慶長14年 (1609年完成)", locationName: "兵庫県姫路市", shortDesc: "白漆喰総塗籠造の大天守と渡櫓が美しい、日本を代表する木造城郭建築の最高峰です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-3", title: "古都京都の文化財 (清水寺・金閣寺・二条城等)", coordinates: [135.7850, 34.9949], year: 1994, era: "平安時代〜江戸時代", locationName: "京都府京都市", shortDesc: "千年の都・京都に点在する17箇所の歴史的寺院・神社・城郭群です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-4", title: "白川郷・五箇山の合掌造り集落", coordinates: [136.9064, 36.2563], year: 1995, era: "江戸時代中期〜", locationName: "岐阜県白川村", shortDesc: "急勾配のカヤバキ屋根をもつ合掌造りの家屋が群生する豪雪地帯の伝統的集落です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-5", title: "原爆ドーム (広島平和記念碑)", coordinates: [132.4536, 34.3955], year: 1996, era: "大正4年 (1915年建設)", locationName: "広島県広島市", shortDesc: "核兵器の惨禍と恒久平和を世界に訴え続ける負の遺産・シンボルです。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-6", title: "厳島神社 (宮島)", coordinates: [132.3197, 34.2959], year: 1996, era: "仁安3年 (1168年社殿造営)", locationName: "広島県廿日市市", shortDesc: "海上に浮かぶ美しい朱塗りの大鳥居と寝殿造りの社殿構造をもつ奇跡の神社です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-7", title: "古都奈良の文化財 (東大寺・春日大社等)", coordinates: [135.8398, 34.6889], year: 1998, era: "奈良時代 (8世紀)", locationName: "奈良県奈良市", shortDesc: "大仏殿を擁する東大寺など、平城京の栄華を伝える8つの資産からなる世界遺産です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-8", title: "日光の社寺 (東照宮・輪王寺・二荒山神社)", coordinates: [139.5989, 36.7581], year: 1999, era: "元和3年 (1617年創建)", locationName: "栃木県日光市", shortDesc: "徳川家康を祀る豪華絢爛な日光東照宮をはじめとする信仰と自然が融合した史跡群です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-9", title: "琉球王国のグスク及び関連遺産群 (首里城跡等)", coordinates: [127.7194, 26.2170], year: 2000, era: "14世紀〜15世紀", locationName: "沖縄県那覇市", shortDesc: "独自の文化と交易を誇った琉球王国の城郭(グスク)遺跡と聖地の文化的景観です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-10", title: "紀伊山地の霊場と参詣道 (熊野古道・高野山)", coordinates: [135.7820, 34.2128], year: 2004, era: "平安時代〜", locationName: "和歌山県・奈良県・三重県", shortDesc: "吉野・大峰、熊野三山、高野山の3つの霊場とそれらを結ぶ古い巡礼道です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-11", title: "石見銀山遺跡とその文化的景観", coordinates: [132.4389, 35.1053], year: 2007, era: "16世紀〜17世紀", locationName: "島根県大田市", shortDesc: "16世紀〜17世紀に世界の銀の約3分の1を産出したと高評価される鉱山遺跡です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-12", title: "富士山―信仰の対象と芸術の源泉", coordinates: [138.7274, 35.3606], year: 2013, era: "古代〜現代", locationName: "静岡県・山梨県", shortDesc: "日本の神聖な美の象徴として世界芸術に大きな影響を与えた名峰と浅間神社群です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-13", title: "明治日本の産業革命遺産 (軍艦島・韮山反射炉等)", coordinates: [129.7385, 32.6277], year: 2015, era: "幕末〜明治期", locationName: "長崎県・福岡県等8県", shortDesc: "非西洋地域で初めて飛躍的な重工業化を達成した製鉄・製鋼、造船、石炭産業の遺産群です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-14", title: "百舌鳥・古市古墳群 (仁徳天皇陵古墳)", coordinates: [135.4878, 34.5647], year: 2019, era: "5世紀前半", locationName: "大阪府堺市", shortDesc: "古代日本の王の墓であり、巨大な前方後円墳が集積する世界的墳墓群です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-15", title: "ローマのコロッセオ (コロッセウム)", coordinates: [12.4922, 41.8902], year: 1980, era: "西暦80年完成", locationName: "イタリア・ローマ", shortDesc: "古代ローマ帝国が誇る5万人収容の大円形闘技場跡です。", categoryLabel: "ユネスコ世界遺産" },
      { id: "unesco-16", title: "アテネのパルテノン神殿 (アクロポリス)", coordinates: [23.7267, 37.9715], year: 1987, era: "紀元前438年完成", locationName: "ギリシャ・アテネ", shortDesc: "古代ギリシャ文明の頂点を示すドーリア式建造物の最高傑作です。", categoryLabel: "ユネスコ世界遺産" }
    ];
  }

  /**
   * 指定座標周辺にあるユネスコ世界遺産を検索
   */
  async fetchEventsAround(lat, lng, radiusKm = 50) {
    return this.unescoSites.filter(site => {
      const dist = this.getHaversineDistance(lat, lng, site.coordinates[1], site.coordinates[0]);
      return dist <= radiusKm * 3; // ユネスコ遺産は少し広めの範囲で検出
    }).map(site => ({
      ...site,
      fullDesc: `${site.shortDesc}\n\n【登録区分】ユネスコ世界文化遺産\n【登録年】${site.year}年`,
      imageUrl: null,
      wikiUrl: `https://ja.wikipedia.org/wiki/${encodeURIComponent(site.title)}`,
      isExternal: true,
      periodGroup: "all",
      tags: ["ユネスコ", "世界遺産", "UNESCO"]
    }));
  }

  getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }
}
