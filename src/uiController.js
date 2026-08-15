import { PERIOD_GROUPS, CATEGORIES } from "./eventsData.js";

/**
 * UIコントロールとインターフェース管理クラス (修復＆安定化版)
 */
export class UIController {
  constructor(options = {}) {
    this.onPeriodChange = options.onPeriodChange || (() => {});
    this.onCategoryChange = options.onCategoryChange || (() => {});
    this.onSearch = options.onSearch || (() => {});
    this.onAddNewEvent = options.onAddNewEvent || (() => {});
    this.onLayerChange = options.onLayerChange || (() => {});
    this.onLocateMe = options.onLocateMe || (() => {});
    this.onRadiusChange = options.onRadiusChange || (() => {});

    this.eventsDataStore = {
      wiki: [],
      osm: [],
      unesco: [],
      jps: []
    };
    this.currentSource = "wiki";
    this.currentIndex = 0;

    this.initDOMElements();
    this.bindEvents();
    this.renderFilters();
  }

  initDOMElements() {
    this.periodFilterContainer = document.getElementById("period-filter-container");
    this.categoryFilterContainer = document.getElementById("category-filter-container");
    this.searchInput = document.getElementById("search-input");
    this.searchResultsContainer = document.getElementById("search-results");
    this.basemapSelect = document.getElementById("basemap-select");
    this.radiusSelect = document.getElementById("radius-select");
    this.btnLocate = document.getElementById("btn-locate");
    this.btnAddEvent = document.getElementById("btn-add-event");

    // モーダル関連
    this.detailModal = document.getElementById("detail-modal");
    this.modalTitle = document.getElementById("modal-title");
    this.modalEra = document.getElementById("modal-era");
    this.modalCategory = document.getElementById("modal-category");
    this.modalLocation = document.getElementById("modal-location");
    this.modalDesc = document.getElementById("modal-desc");
    this.modalImage = document.getElementById("modal-image");
    this.modalTags = document.getElementById("modal-tags");
    this.modalWikiLink = document.getElementById("modal-wiki-link");
    this.btnCloseModal = document.getElementById("btn-close-modal");

    // 追加モーダル
    this.addModal = document.getElementById("add-modal");
    this.addForm = document.getElementById("add-event-form");
    this.btnCloseAddModal = document.getElementById("btn-close-add-modal");
    this.inputCoordLat = document.getElementById("add-lat");
    this.inputCoordLng = document.getElementById("add-lng");

    // 吹き出し（Popup Overlay）
    this.popupContainer = document.getElementById("popup-overlay");
    this.popupTitle = document.getElementById("popup-title");
    this.popupEra = document.getElementById("popup-era");
    this.popupShortDesc = document.getElementById("popup-short-desc");
    this.popupCategory = document.getElementById("popup-category");
    this.popupCounter = document.getElementById("popup-counter");
    this.btnPopupPrev = document.getElementById("btn-popup-prev");
    this.btnPopupNext = document.getElementById("btn-popup-next");
    this.btnPopupDetail = document.getElementById("btn-popup-detail");
    this.btnPopupClose = document.getElementById("btn-popup-close");

    // タブ
    this.tabWikiBtn = document.getElementById("tab-wiki-btn");
    this.tabOsmBtn = document.getElementById("tab-osm-btn");
    this.tabUnescoBtn = document.getElementById("tab-unesco-btn");
    this.tabJpsBtn = document.getElementById("tab-jps-btn");

    this.tabWikiBadge = document.getElementById("tab-wiki-badge");
    this.tabOsmBadge = document.getElementById("tab-osm-badge");
    this.tabUnescoBadge = document.getElementById("tab-unesco-badge");
    this.tabJpsBadge = document.getElementById("tab-jps-badge");

    this.currentSelectedEvent = null;
  }

  renderFilters() {
    if (this.periodFilterContainer) {
      this.periodFilterContainer.innerHTML = PERIOD_GROUPS.map((p, idx) => `
        <button class="filter-pill ${idx === 0 ? 'active' : ''}" data-period="${p.id}">
          ${p.label}
        </button>
      `).join("");
    }

    if (this.categoryFilterContainer) {
      this.categoryFilterContainer.innerHTML = CATEGORIES.map((c, idx) => `
        <button class="filter-pill category-pill ${idx === 0 ? 'active' : ''}" data-category="${c.id}">
          ${c.label}
        </button>
      `).join("");
    }
  }

  bindEvents() {
    this.periodFilterContainer?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-period]");
      if (!btn) return;
      this.periodFilterContainer.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.onPeriodChange(btn.dataset.period);
    });

    this.categoryFilterContainer?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;
      this.categoryFilterContainer.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.onCategoryChange(btn.dataset.category);
    });

    this.searchInput?.addEventListener("input", (e) => {
      this.onSearch(e.target.value.trim());
    });

    this.basemapSelect?.addEventListener("change", (e) => {
      this.onLayerChange(e.target.value);
    });

    this.radiusSelect?.addEventListener("change", (e) => {
      this.onRadiusChange(parseFloat(e.target.value));
    });

    this.btnLocate?.addEventListener("click", () => {
      this.onLocateMe();
    });

    this.btnAddEvent?.addEventListener("click", () => {
      this.openAddModal();
    });

    this.btnCloseModal?.addEventListener("click", () => {
      this.closeDetailModal();
    });

    this.btnCloseAddModal?.addEventListener("click", () => {
      this.closeAddModal();
    });

    this.tabWikiBtn?.addEventListener("click", () => this.switchTab("wiki"));
    this.tabOsmBtn?.addEventListener("click", () => this.switchTab("osm"));
    this.tabUnescoBtn?.addEventListener("click", () => this.switchTab("unesco"));
    this.tabJpsBtn?.addEventListener("click", () => this.switchTab("jps"));

    this.addForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.addForm);
      const newEvt = {
        id: "evt-" + Date.now(),
        title: formData.get("title"),
        year: parseInt(formData.get("year")) || 2000,
        era: formData.get("era") || "現代",
        category: formData.get("category") || "history",
        categoryLabel: "ユーザー追加",
        locationName: formData.get("locationName") || "指定地点",
        coordinates: [
          parseFloat(formData.get("lng")),
          parseFloat(formData.get("lat"))
        ],
        shortDesc: formData.get("shortDesc"),
        fullDesc: formData.get("fullDesc") || formData.get("shortDesc"),
        periodGroup: "taisho-showa",
        tags: ["投稿"]
      };

      this.onAddNewEvent(newEvt);
      this.addForm.reset();
      this.closeAddModal();
    });

    this.btnPopupPrev?.addEventListener("click", () => {
      const activeList = this.eventsDataStore[this.currentSource] || [];
      if (activeList.length > 0) {
        this.currentIndex = (this.currentIndex - 1 + activeList.length) % activeList.length;
        this.updatePopupContent();
      }
    });

    this.btnPopupNext?.addEventListener("click", () => {
      const activeList = this.eventsDataStore[this.currentSource] || [];
      if (activeList.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % activeList.length;
        this.updatePopupContent();
      }
    });

    this.btnPopupDetail?.addEventListener("click", () => {
      if (this.currentSelectedEvent) {
        this.openDetailModal(this.currentSelectedEvent);
      }
    });

    this.btnPopupClose?.addEventListener("click", () => {
      this.hidePopup();
    });
  }

  switchTab(sourceType) {
    this.currentSource = sourceType;
    this.currentIndex = 0;

    [this.tabWikiBtn, this.tabOsmBtn, this.tabUnescoBtn, this.tabJpsBtn].forEach(btn => btn?.classList.remove("active"));

    if (sourceType === "wiki") this.tabWikiBtn?.classList.add("active");
    if (sourceType === "osm") this.tabOsmBtn?.classList.add("active");
    if (sourceType === "unesco") this.tabUnescoBtn?.classList.add("active");
    if (sourceType === "jps") this.tabJpsBtn?.classList.add("active");

    this.updatePopupContent();
  }

  resetPopupData() {
    this.eventsDataStore = { wiki: [], osm: [], unesco: [], jps: [] };
    this.currentIndex = 0;
    this.currentSource = "wiki";

    if (this.tabWikiBadge) this.tabWikiBadge.textContent = "検索中…";
    if (this.tabOsmBadge) this.tabOsmBadge.textContent = "検索中…";
    if (this.tabUnescoBadge) this.tabUnescoBadge.textContent = "検索中…";
    if (this.tabJpsBadge) this.tabJpsBadge.textContent = "検索中…";

    this.switchTab("wiki");
    if (this.popupContainer) this.popupContainer.style.display = "block";
  }

  setSourceEvents(sourceType, events) {
    this.eventsDataStore[sourceType] = events || [];

    const badgeMap = {
      wiki: this.tabWikiBadge,
      osm: this.tabOsmBadge,
      unesco: this.tabUnescoBadge,
      jps: this.tabJpsBadge
    };

    if (badgeMap[sourceType]) {
      badgeMap[sourceType].textContent = `${(events || []).length}件`;
    }

    if (this.currentSource === sourceType) {
      this.updatePopupContent();
    }
  }

  updatePopupContent() {
    const list = this.eventsDataStore[this.currentSource] || [];
    if (!list || list.length === 0) {
      const names = {
        wiki: "Wikidata & DBpedia 世界ナレッジ",
        osm: "OpenStreetMap & OHM 史跡・遺構",
        unesco: "UNESCO ユネスコ世界遺産",
        jps: "ジャパンサーチ (国立国会図書館)"
      };

      if (this.popupTitle) this.popupTitle.textContent = names[this.currentSource] || "歴史スポット";
      if (this.popupEra) this.popupEra.textContent = "検索半径内にデータが見つかりませんでした";
      if (this.popupCategory) this.popupCategory.textContent = "周辺情報";
      if (this.popupShortDesc) this.popupShortDesc.textContent = "指定された半径内にこのデータベースの史跡はまだ登録されていません。上の他のタブ（Wiki/史跡/ユネスコ/国会図）に切り替えるか、半径を変更してみてください。";
      if (this.popupCounter) this.popupCounter.textContent = "0件";
      if (this.btnPopupDetail) this.btnPopupDetail.style.display = "none";
      this.currentSelectedEvent = null;
      return;
    }

    const eventData = list[this.currentIndex];
    this.currentSelectedEvent = eventData;
    if (this.popupTitle) this.popupTitle.textContent = eventData.title;
    if (this.popupEra) this.popupEra.textContent = `${eventData.year ? eventData.year + '年' : ''} ${eventData.era ? ' / ' + eventData.era : ''}`;
    if (this.popupCategory) this.popupCategory.textContent = eventData.categoryLabel || "歴史的出来事";
    if (this.popupShortDesc) this.popupShortDesc.textContent = eventData.shortDesc;
    if (this.popupCounter) this.popupCounter.textContent = `${this.currentIndex + 1} / ${list.length}件`;
    if (this.btnPopupDetail) this.btnPopupDetail.style.display = "block";
  }

  hidePopup() {
    if (this.popupContainer) this.popupContainer.style.display = "none";
    this.currentSelectedEvent = null;
  }

  openDetailModal(eventData) {
    if (!eventData) return;
    this.modalTitle.textContent = eventData.title;
    this.modalEra.textContent = `${eventData.year ? eventData.year + '年' : ''} (${eventData.era || ''})`;
    this.modalCategory.textContent = eventData.categoryLabel;
    this.modalLocation.textContent = eventData.locationName;
    this.modalDesc.textContent = eventData.fullDesc;

    if (eventData.imageUrl) {
      this.modalImage.src = eventData.imageUrl;
      this.modalImage.style.display = "block";
    } else {
      this.modalImage.style.display = "none";
    }

    if (eventData.wikiUrl) {
      this.modalWikiLink.href = eventData.wikiUrl;
      this.modalWikiLink.style.display = "inline-flex";
    } else {
      this.modalWikiLink.style.display = "none";
    }

    if (eventData.tags && eventData.tags.length > 0) {
      this.modalTags.innerHTML = eventData.tags.map(t => `<span class="tag">#${t}</span>`).join("");
    } else {
      this.modalTags.innerHTML = "";
    }

    this.detailModal.classList.add("active");
  }

  closeDetailModal() {
    this.detailModal.classList.remove("active");
  }

  openAddModal(lat = 35.6812, lng = 139.7671) {
    if (this.inputCoordLat) this.inputCoordLat.value = lat.toFixed(5);
    if (this.inputCoordLng) this.inputCoordLng.value = lng.toFixed(5);
    this.addModal.classList.add("active");
  }

  closeAddModal() {
    this.addModal.classList.remove("active");
  }

  renderSearchResults(results, onSelect) {
    if (!this.searchResultsContainer) return;
    if (!results || results.length === 0) {
      this.searchResultsContainer.style.display = "none";
      return;
    }

    this.searchResultsContainer.style.display = "block";
    this.searchResultsContainer.innerHTML = results.map(item => `
      <div class="search-result-item" data-id="${item.id}">
        <div class="result-title">${item.title}</div>
        <div class="result-sub">${item.year ? item.year + '年 ・ ' : ''}${item.locationName}</div>
      </div>
    `).join("");

    this.searchResultsContainer.querySelectorAll(".search-result-item").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        const target = results.find(r => r.id === id);
        if (target) {
          onSelect(target);
          this.searchResultsContainer.style.display = "none";
        }
      });
    });
  }
}
