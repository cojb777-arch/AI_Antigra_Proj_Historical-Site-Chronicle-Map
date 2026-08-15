import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Overlay from "ol/Overlay";
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import { fromLonLat, toLonLat } from "ol/proj";

import { INITIAL_EVENTS } from "./eventsData.js";
import { UIController } from "./uiController.js";

// 5大データベースサービス群
import { WikidataService } from "./wikidataService.js";
import { DbpediaService } from "./dbpediaService.js";
import { OverpassService } from "./overpassService.js";
import { OhmService } from "./ohmService.js";
import { UnescoService } from "./unescoService.js";
import { JapanSearchService } from "./japanSearchService.js";

class ChronicleMapApp {
  constructor() {
    this.eventsList = [...INITIAL_EVENTS];
    this.loadUserEvents();
    
    this.wikidataService = new WikidataService();
    this.dbpediaService = new DbpediaService();
    this.overpassService = new OverpassService();
    this.ohmService = new OhmService();
    this.unescoService = new UnescoService();
    this.japanSearchService = new JapanSearchService();

    this.activePeriod = "all";
    this.activeCategory = "all";
    this.searchRadiusKm = 5;

    this.targetCoordinate = null;

    this.initMap();
    this.initVectorLayers();
    this.initOverlay();
    this.initUI();
    this.renderEventPins();

    this.placeTargetPin([139.7671, 35.6812]);
  }

  loadUserEvents() {
    try {
      const stored = localStorage.getItem("chronicle_custom_events");
      if (stored) {
        const customEvts = JSON.parse(stored);
        this.eventsList = [...this.eventsList, ...customEvts];
      }
    } catch (e) {
      console.warn("Failed to load custom events from localStorage", e);
    }
  }

  saveUserEvents(newEvent) {
    try {
      const stored = localStorage.getItem("chronicle_custom_events");
      const customEvts = stored ? JSON.parse(stored) : [];
      customEvts.push(newEvent);
      localStorage.setItem("chronicle_custom_events", JSON.stringify(customEvts));
    } catch (e) {
      console.warn("Failed to save event to localStorage", e);
    }
  }

  initMap() {
    this.layers = {
      osm: new TileLayer({
        source: new OSM(),
        visible: true
      }),
      gsi_std: new TileLayer({
        source: new XYZ({
          url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
          attributions: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>'
        }),
        visible: false
      })
    };

    this.view = new View({
      center: fromLonLat([139.7671, 35.6812]),
      zoom: 12,
      minZoom: 4,
      maxZoom: 18
    });

    this.map = new Map({
      target: "map",
      layers: [
        this.layers.osm,
        this.layers.gsi_std
      ],
      view: this.view
    });
  }

  initVectorLayers() {
    this.eventsVectorSource = new VectorSource();
    this.eventsVectorLayer = new VectorLayer({
      source: this.eventsVectorSource,
      style: (feature) => this.getEventFeatureStyle(feature)
    });

    this.targetVectorSource = new VectorSource();
    this.targetVectorLayer = new VectorLayer({
      source: this.targetVectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({ color: "#7c3aed" }),
          stroke: new Stroke({ color: "#ffffff", width: 3.5 })
        }),
        text: new Text({
          text: "📍 検索起点",
          font: "bold 13px 'Inter', sans-serif",
          offsetY: -20,
          fill: new Fill({ color: "#6d28d9" }),
          stroke: new Stroke({ color: "#ffffff", width: 3.5 })
        })
      })
    });

    this.map.addLayer(this.eventsVectorLayer);
    this.map.addLayer(this.targetVectorLayer);
  }

  getEventFeatureStyle(feature) {
    const isWiki = feature.get("isExternal");
    const category = feature.get("category");
    const id = feature.get("id") || "";

    let color = "#e63946";
    if (category === "culture") color = "#457b9d";
    if (category === "disaster") color = "#d97706";
    if (isWiki) color = "#2563eb";
    if (id.startsWith("osm-") || id.startsWith("ohm-")) color = "#8b5cf6";
    if (id.startsWith("unesco-")) color = "#f59e0b";
    if (id.startsWith("jps-")) color = "#10b981";

    return new Style({
      image: new CircleStyle({
        radius: isWiki ? 7 : 9,
        fill: new Fill({ color: color }),
        stroke: new Stroke({ color: "#ffffff", width: 2 })
      }),
      text: new Text({
        text: feature.get("title"),
        font: "500 11px 'Inter', sans-serif",
        offsetY: -14,
        fill: new Fill({ color: "#1e293b" }),
        stroke: new Stroke({ color: "#ffffff", width: 3 })
      })
    });
  }

  initOverlay() {
    const popupEl = document.getElementById("popup-overlay");
    this.overlay = new Overlay({
      element: popupEl,
      autoPan: { animation: { duration: 250 } },
      positioning: "bottom-center",
      offset: [0, -16]
    });

    this.map.addOverlay(this.overlay);

    this.map.on("click", (evt) => {
      let clickedFeature = null;
      this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (feature !== this.targetFeature) {
          clickedFeature = feature;
          return true;
        }
      });

      if (clickedFeature) {
        const eventData = clickedFeature.getProperties();
        const coord = clickedFeature.getGeometry().getCoordinates();
        this.overlay.setPosition(coord);
        this.ui.resetPopupData();
        this.ui.setSourceEvents("wikidata", [eventData]);
      } else {
        const lonLat = toLonLat(evt.coordinate);
        this.placeTargetPin(lonLat);
      }
    });

    this.map.on("pointermove", (e) => {
      const pixel = this.map.getEventPixel(e.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
  }

  initUI() {
    this.ui = new UIController({
      onPeriodChange: (periodId) => {
        this.activePeriod = periodId;
        this.renderEventPins();
        if (this.targetCoordinate) this.searchAroundTarget();
      },
      onCategoryChange: (catId) => {
        this.activeCategory = catId;
        this.renderEventPins();
        if (this.targetCoordinate) this.searchAroundTarget();
      },
      onRadiusChange: (radiusKm) => {
        this.searchRadiusKm = radiusKm;
        if (this.targetCoordinate) this.searchAroundTarget();
      },
      onSearch: (query) => {
        this.handleSearch(query);
      },
      onLayerChange: (layerKey) => {
        this.changeBasemap(layerKey);
      },
      onLocateMe: () => {
        this.locateUser();
      },
      onAddNewEvent: (newEvent) => {
        this.eventsList.push(newEvent);
        this.saveUserEvents(newEvent);
        this.renderEventPins();
        this.placeTargetPin(newEvent.coordinates);
      }
    });
  }

  placeTargetPin(lonLat) {
    this.targetCoordinate = lonLat;
    const olCoord = fromLonLat(lonLat);

    this.targetVectorSource.clear();
    this.targetFeature = new Feature({
      geometry: new Point(olCoord),
      name: "TargetPin"
    });
    this.targetVectorSource.addFeature(this.targetFeature);

    this.overlay.setPosition(olCoord);
    this.searchAroundTarget();
  }

  /**
   * ターゲットピン周辺の歴史検索 (完全に相互独立した非同期ストリーミングフェッチ)
   */
  async searchAroundTarget() {
    if (!this.targetCoordinate) return;

    const [targetLng, targetLat] = this.targetCoordinate;
    this.ui.resetPopupData();

    // ローカルサンプルデータ
    const localMatches = this.eventsList.filter(evt => {
      if (!evt.coordinates) return false;
      const distKm = this.getHaversineDistance(targetLat, targetLng, evt.coordinates[1], evt.coordinates[0]);
      return distKm <= this.searchRadiusKm;
    }).map(evt => ({
      ...evt,
      distKm: this.getHaversineDistance(targetLat, targetLng, evt.coordinates[1], evt.coordinates[0])
    }));

    // 1. 【Wikidata 独立フェッチ】 (絶対に他APIの影響を受けずに爆速単独表示！)
    this.wikidataService.fetchEventsAround(targetLat, targetLng, this.searchRadiusKm).then(wikiMatches => {
      const wikiFormatted = wikiMatches.map(evt => ({
        ...evt,
        distKm: this.getHaversineDistance(targetLat, targetLng, evt.coordinates[1], evt.coordinates[0])
      }));
      const wikiCombined = [...localMatches, ...wikiFormatted];
      wikiCombined.sort((a, b) => a.distKm - b.distKm);

      this.mergeExternalEventsToMap(wikiMatches);
      this.ui.setSourceEvents("wikidata", wikiCombined.slice(0, 15));
    }).catch(err => {
      console.warn("Wikidata fetch error:", err);
      this.ui.setSourceEvents("wikidata", localMatches);
    });

    // 2. 【DBpedia 独立フェッチ】
    this.dbpediaService.fetchEventsAround(targetLat, targetLng, this.searchRadiusKm).then(dbpList => {
      const dbpFormatted = dbpList.map(evt => ({
        ...evt,
        distKm: this.getHaversineDistance(targetLat, targetLng, evt.coordinates[1], evt.coordinates[0])
      }));
      dbpFormatted.sort((a, b) => a.distKm - b.distKm);

      this.mergeExternalEventsToMap(dbpList);
      this.ui.setSourceEvents("dbpedia", dbpFormatted);
    }).catch(err => {
      console.warn("DBpedia fetch error:", err);
      this.ui.setSourceEvents("dbpedia", []);
    });

    // 3. 【OSM & OHM 史跡 独立フェッチ】
    Promise.all([
      this.overpassService.fetchEventsAround(targetLat, targetLng, this.searchRadiusKm),
      this.ohmService.fetchEventsAround(targetLat, targetLng, this.searchRadiusKm)
    ]).then(([osmList, ohmList]) => {
      const combined = [...osmList, ...ohmList].map(e => ({
        ...e,
        distKm: this.getHaversineDistance(targetLat, targetLng, e.coordinates[1], e.coordinates[0])
      }));
      combined.sort((a, b) => a.distKm - b.distKm);

      this.mergeExternalEventsToMap(combined);
      this.ui.setSourceEvents("osm", combined.slice(0, 15));
    }).catch(err => {
      console.warn("OSM fetch error:", err);
      this.ui.setSourceEvents("osm", []);
    });

    // 4. 【ユネスコ世界遺産 独立判定】
    this.unescoService.fetchEventsAround(targetLat, targetLng, this.searchRadiusKm).then(unescoList => {
      this.mergeExternalEventsToMap(unescoList);
      this.ui.setSourceEvents("unesco", unescoList);
    }).catch(err => {
      this.ui.setSourceEvents("unesco", []);
    });

    // 5. 【ジャパンサーチ 独立フェッチ】
    this.japanSearchService.fetchEventsAround(targetLat, targetLng, this.searchRadiusKm).then(jpsList => {
      const jpsFormatted = jpsList.map(e => ({
        ...e,
        distKm: this.getHaversineDistance(targetLat, targetLng, e.coordinates[1], e.coordinates[0])
      }));
      jpsFormatted.sort((a, b) => a.distKm - b.distKm);

      this.mergeExternalEventsToMap(jpsList);
      this.ui.setSourceEvents("jps", jpsFormatted.slice(0, 15));
    }).catch(err => {
      console.warn("Japan Search fetch error:", err);
      this.ui.setSourceEvents("jps", []);
    });
  }

  mergeExternalEventsToMap(externalEvents) {
    externalEvents.forEach(evt => {
      if (evt.coordinates && !this.eventsList.some(e => e.id === evt.id)) {
        this.eventsList.push(evt);
      }
    });
    this.renderEventPins();
  }

  renderEventPins() {
    this.eventsVectorSource.clear();

    const filtered = this.eventsList.filter(evt => {
      if (!evt.coordinates) return false;
      const matchPeriod = (this.activePeriod === "all" || evt.periodGroup === this.activePeriod);
      const matchCategory = (this.activeCategory === "all" || evt.category === this.activeCategory);
      return matchPeriod && matchCategory;
    });

    filtered.forEach(evt => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(evt.coordinates)),
        ...evt
      });
      this.eventsVectorSource.addFeature(feature);
    });
  }

  changeBasemap(key) {
    Object.keys(this.layers).forEach(k => {
      this.layers[k].setVisible(k === key);
    });
  }

  async handleSearch(query) {
    if (!query) {
      this.ui.renderSearchResults([], () => {});
      return;
    }
    const q = query.toLowerCase();

    const localMatches = this.eventsList.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.locationName.toLowerCase().includes(q) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    );

    const jpsResults = await this.japanSearchService.searchByQuery(query);

    const combined = [...localMatches];
    jpsResults.forEach(j => {
      if (!combined.some(c => c.id === j.id)) {
        combined.push(j);
      }
    });

    this.ui.renderSearchResults(combined.slice(0, 15), (selectedEvt) => {
      if (selectedEvt.coordinates) {
        const coord = fromLonLat(selectedEvt.coordinates);
        this.view.animate({ center: coord, zoom: 14, duration: 800 });
        this.placeTargetPin(selectedEvt.coordinates);
      } else {
        alert(`「${selectedEvt.title}」の具体的な位置座標がデータに含まれていないため、地図上にジャンプできませんでした。`);
      }
    });
  }

  locateUser() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.longitude, pos.coords.latitude];
          const olCoords = fromLonLat(coords);
          this.view.animate({ center: olCoords, zoom: 14, duration: 1000 });
          this.placeTargetPin(coords);
        },
        () => {
          alert("現在地の取得に失敗しました。位置情報の利用を許可してください。");
        }
      );
    } else {
      alert("お使いの端末は位置情報取得に対応していません。");
    }
  }

  getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ChronicleMapApp();
});
