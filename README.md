# 史跡クロニクルマップ (Historical Site Chronicle Map)

指定した地点の周辺で「過去に何が起こったか（歴史的事件・古写真・公文書・文化財・史跡）」を吹き出しで直感的に探求・発見できるクロスプラットフォーム（PC・Android・iPhone対応）Webアプリです。

## 🌟 特徴・主要機能

- **📍 自由なピン設置 & 周辺歴史検索**
  - 地図上の好きな場所をタップ/クリックすると検索起点ピンが刺さり、半径1km〜10kmの範囲内にある過去の出来事を動的抽出します。
- **🌐 無料オープンデータのダブル連携**
  - **Wikidata SPARQL API**: 世界中・日本全国の位置情報付き歴史事件・合戦・寺社・記念碑をリアルタイム取得。
  - **ジャパンサーチ (Japan Search) 簡易Web API (`g-coordinates` & `q-loc`)**: 国立国会図書館が運営する政府公式デジタルアーカイブから、公文書・古写真・自治体文化財資料を自動プロット。
- **💬 吹き出し（Popup Overlay）& ソース別タブ分離**
  - 高速なWikidataと公式ジャパンサーチをタブ分離し、待機時間なしで爆速ストリーミング表示。
- **🎲 一期一会ランダム発見**
  - 同じ場所を何度もタップするたびに、毎回異なる新しい歴史エピソードや文化財資料がランダム抽出されます。
- **🗺️ 国土地理院 & OSM マルチレイヤー**
  - OpenStreetMap標準地図と国土地理院標準地図をスムーズ切り替え。

## 🚀 開発・ローカル起動方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## 🛠️ テクノロジー

- **Core**: OpenLayers 9, HTML5, CSS3, JavaScript (ES Modules)
- **Bundler**: Vite
- **APIs**:
  - OpenLayers (`https://openlayers.org/`)
  - Wikidata SPARQL API (`https://query.wikidata.org/sparql`)
  - ジャパンサーチ 簡易Web API (`https://jpsearch.go.jp/api/item/search/jps-cross`)
  - 国土地理院タイル
