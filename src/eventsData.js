/**
 * 過去の出来事（歴史・エピソード・事件）のサンプルデータセット
 * 緯度・経度 (EPSG:4326), 年代, カテゴリ, タイトル, 詳細, 画像等
 */

export const INITIAL_EVENTS = [
  {
    id: "evt-001",
    title: "江戸城開城（無血開城）",
    year: 1868,
    era: "明治元年 (慶応4年)",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "江戸城（皇居東御苑）",
    coordinates: [139.7561, 35.6852],
    shortDesc: "勝海舟と西郷隆盛の会談により、江戸城が無血開城され、江戸の町が戦火から守られました。",
    fullDesc: "慶応4年（1868年）、幕末の動乱の中で新政府軍が江戸へと迫る中、勝海舟と西郷隆盛の歴史的な談判が行われました。結果として江戸城の無血開城が決定し、約100万人の江戸市民と街並みが全面戦争の惨禍から免れました。",
    periodGroup: "edo-meiji",
    imageUrl: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80",
    tags: ["幕末", "勝海舟", "西郷隆盛", "江戸"]
  },
  {
    id: "evt-002",
    title: "本能寺の変",
    year: 1582,
    era: "天正10年",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "本能寺跡（京都市中京区）",
    coordinates: [135.7547, 35.0069],
    shortDesc: "明智光秀が謀反を起こし、天下統一を目前にした織田信長が本能寺にて倒れました。",
    fullDesc: "天正10年6月2日（1582年6月21日未明）、織田信長が中国攻めの毛利氏を攻める羽柴秀吉の援軍へ向かう途中に滞在していた京都の本能寺を、家臣である明智光秀の軍勢が急襲しました。信長は炎の中で自害し、日本の戦国時代における最大の転換点となりました。",
    periodGroup: "sengoku",
    imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80",
    tags: ["戦国", "織田信長", "明智光秀", "京都"]
  },
  {
    id: "evt-003",
    title: "東京駅（丸の内駅舎）の開業",
    year: 1914,
    era: "大正3年",
    category: "culture",
    categoryLabel: "建築・インフラ",
    locationName: "東京駅 丸の内駅舎",
    coordinates: [139.7671, 35.6812],
    shortDesc: "建築家・辰野金吾デザインの赤レンガ造り丸の内駅舎が完成し、日本の鉄道の中心として開業しました。",
    fullDesc: "大正3年（1914年）12月20日、日本を代表する建築家・辰野金吾らが設計した3層建て壮大な赤レンガ造りの丸の内駅舎が開業しました。太平洋戦争の空襲で一部焼失したものの、2012年に創建当時の姿へと完全復原され、国の重要文化財に指定されています。",
    periodGroup: "taisho-showa",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    tags: ["大正ロマン", "辰野金吾", "建築", "鉄道"]
  },
  {
    id: "evt-004",
    title: "関ヶ原の戦い",
    year: 1600,
    era: "慶長5年",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "関ヶ原古戦場（岐阜県関ケ原町）",
    coordinates: [136.4678, 35.3644],
    shortDesc: "徳川家康率いる東軍と石田三成率いる西軍による天下分け目の大決戦が行われました。",
    fullDesc: "慶長5年9月15日（1600年10月21日）、東西合わせて15万人以上の大軍が激突した日本史上最大規模の合戦。小早川秀秋の裏切りなども重なり東軍の徳川家康が勝利を収め、後の江戸幕府創設・250年の平和な江戸時代の礎が築かれました。",
    periodGroup: "sengoku",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    tags: ["徳川家康", "石田三成", "天下分け目", "合戦"]
  },
  {
    id: "evt-005",
    title: "大阪城（大坂城）の築城開始",
    year: 1583,
    era: "天正11年",
    category: "culture",
    categoryLabel: "建築・文化",
    locationName: "大阪城天守閣",
    coordinates: [135.5262, 34.6873],
    shortDesc: "豊臣秀吉が石山本願寺の跡地に天下人が誇る巨城・大坂城の建設を開始しました。",
    fullDesc: "織田信長の跡を継ぎ天下統一を進める豊臣秀吉が、天正11年（1583年）に大坂城の造営を開始。豪華絢爛な金色に輝く天守閣と莫大な石垣を擁する難攻不落の城城として完成し、政治・経済の中心都市「大阪」の繁栄の原点となりました。",
    periodGroup: "sengoku",
    imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=600&q=80",
    tags: ["豊臣秀吉", "大坂城", "安土桃山", "大阪"]
  },
  {
    id: "evt-006",
    title: "大化の改新（乙巳の変）",
    year: 645,
    era: "皇極天皇4年",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "飛鳥板蓋宮跡（奈良県明日香村）",
    coordinates: [135.8197, 34.4746],
    shortDesc: "中大兄皇子と中臣鎌足らが蘇我入鹿を倒し、中央集権国家を目指す「大化の改新」が始まりました。",
    fullDesc: "皇極天皇4年（645年）、飛鳥板蓋宮にて中大兄皇子（後の天智天皇）と中臣鎌足（後の藤原鎌足）らが台頭する蘇我入鹿を滅ぼし、元号「大化」を制定。日本初の中央集権的な律令国家体制への大改革がスタートしました。",
    periodGroup: "ancient",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    tags: ["飛鳥時代", "中大兄皇子", "中臣鎌足", "奈良"]
  },
  {
    id: "evt-007",
    title: "東海道新幹線の開業",
    year: 1964,
    era: "昭和39年",
    category: "culture",
    categoryLabel: "科学・インフラ",
    locationName: "新幹線 東京駅19番線ホーム",
    coordinates: [139.7680, 35.6805],
    shortDesc: "東京オリンピック開通直前に世界初の超高速鉄道「夢の超特急」ひかり号が発車しました。",
    fullDesc: "昭和39年（1964年）10月1日、東京ー新大阪間を最高時速210km/hで結ぶ東海道新幹線が開業。戦後の高度経済成長期の象徴であり、日本の優れた技術力を世界に示した歴史的瞬間となりました。",
    periodGroup: "taisho-showa",
    imageUrl: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=600&q=80",
    tags: ["昭和", "新幹線", "高度経済成長", "東京オリンピック"]
  },
  {
    id: "evt-008",
    title: "黒船来航（ペリー提督来航）",
    year: 1853,
    era: "嘉永6年",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "浦賀沖（神奈川県横須賀市）",
    coordinates: [139.7153, 35.2447],
    shortDesc: "マシュー・ペリー率いるアメリカ東インド艦隊の蒸気船（黒船）4隻が浦賀沖に現れ開国を要求しました。",
    fullDesc: "嘉永6年6月3日（1853年7月8日）、巨大な漆黒の蒸気船が浦賀沖に現れ、大砲を響かせました。幕府と日本中に激震が走り、「泰平のむかしをさめる上喜撰 たった四杯で夜も眠れず」と詠まれた日本開国と幕末動乱の幕開けとなりました。",
    periodGroup: "edo-meiji",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    tags: ["幕末", "ペリー", "黒船", "横須賀", "開国"]
  },
  {
    id: "evt-009",
    title: "鎌倉幕府の成立",
    year: 1192,
    era: "建久3年",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "鶴岡八幡宮（神奈川県鎌倉市）",
    coordinates: [139.5564, 35.3260],
    shortDesc: "源頼朝が征夷大将軍に任じられ、日本初の本格的な武家政権である鎌倉幕府が開かれました。",
    fullDesc: "平氏を滅ぼした源頼朝が建久3年（1192年）に征夷大将軍となり、鎌倉の地に独自の幕府政治を打ち立てました。公家中心の古代から武士中心の「中世」への歴史的大転換を遂げた地です。",
    periodGroup: "kamakura-muromachi",
    imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80",
    tags: ["源頼朝", "鎌倉武士", "武家政権", "鎌倉"]
  },
  {
    id: "evt-010",
    title: "東京タワーの完成・開業",
    year: 1958,
    era: "昭和33年",
    category: "culture",
    categoryLabel: "建築・文化",
    locationName: "東京タワー（港区芝公園）",
    coordinates: [139.7454, 35.6586],
    shortDesc: "自立式鉄塔として当時世界一の高さ333mを誇る総合電波塔・東京タワーが完工しました。",
    fullDesc: "昭和33年（1958年）12月23日、戦後日本の復興とシンボルとして建設された東京タワーが開業。パリのエッフェル塔を超える333mの高さを誇り、現在も人々に愛される東京の象徴的ランドマークです。",
    periodGroup: "taisho-showa",
    imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=80",
    tags: ["昭和", "東京タワー", "復興", "港区"]
  },
  {
    id: "evt-011",
    title: "平城京遷都",
    year: 710,
    era: "和銅3年",
    category: "history",
    categoryLabel: "歴史的事件",
    locationName: "平城宮跡（奈良県奈良市）",
    coordinates: [135.7981, 34.6939],
    shortDesc: "元明天皇により藤原京から平城京へ都が移され、華やかな「奈良時代」が始まりました。",
    fullDesc: "和銅3年（710年）、「咲く花の匂うがごとく今盛りなり」と詠まれた唐の長安城を模した壮大な国際都城・平城京へ遷都。東大寺の大仏建立や天平文化が花開いた地です。",
    periodGroup: "ancient",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    tags: ["奈良時代", "平城京", "元明天皇", "天平文化"]
  },
  {
    id: "evt-012",
    title: "渋谷スクランブル交差点と忠犬ハチ公像",
    year: 1934,
    era: "昭和9年",
    category: "culture",
    categoryLabel: "エピソード・人物",
    locationName: "JR渋谷駅 ハチ公前広場",
    coordinates: [139.7006, 35.6591],
    shortDesc: "亡き主人を10年間待ち続けた忠犬ハチ公の銅像が、存命中に渋谷駅前に建立されました。",
    fullDesc: "東京帝国大学教授・上野英三郎博士の愛犬ハチ公は、博士が急逝した後も約10年間にわたり渋谷駅で主人の帰りを待ち続けました。その忠義が話題となり昭和9年（1934年）に銅像が除幕。ハチ公本人も式典に出席しました。",
    periodGroup: "taisho-showa",
    imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80",
    tags: ["忠犬ハチ公", "渋谷", "昭和", "物語"]
  }
];

export const PERIOD_GROUPS = [
  { id: "all", label: "すべての時代" },
  { id: "ancient", label: "古代〜平安 (~1184)" },
  { id: "kamakura-muromachi", label: "鎌倉・室町 (1185~1466)" },
  { id: "sengoku", label: "戦国・安土桃山 (1467~1602)" },
  { id: "edo-meiji", label: "江戸・明治 (1603~1911)" },
  { id: "taisho-showa", label: "大正・昭和・現代 (1912~)" }
];

export const CATEGORIES = [
  { id: "all", label: "全ジャンル", icon: "sparkles" },
  { id: "history", label: "歴史的事件・政治", icon: "swords" },
  { id: "culture", label: "建築・文化・人物", icon: "landmark" },
  { id: "disaster", label: "災害・出来事", icon: "shield-alert" }
];
