// =============================================================
//  실시간 암호화폐 가격 변동 추적기
//  필수 기능
//   - Binance API에 매초 GET 요청 → USDT 항목만 목록 구성 + 실시간 갱신
//   - 심볼 검색 / LocalStorage 관심항목 / 전체·관심 탭 분리
//  추가 기능
//   - 헤더 클릭 정렬 (시가총액·거래대금 포함)
//   - 시가총액(CoinGecko) 연동, 거래대금(24h) 표시
//   - 깜빡임 없는 in-place 갱신 (+ 가격 변동 색 플래시)
//   - 마지막 갱신 시각 / 표시·관심 개수 표시
// =============================================================

// ----- 요소 선택 -----
const cryptoList = document.querySelector("#cryptoList");
const searchInput = document.querySelector("#searchInput");
const loading = document.querySelector("#loading");
const cryptoTable = document.querySelector("#cryptoTable");
const allTab = document.querySelector("#allTab");
const favoritesTab = document.querySelector("#favoritesTab");
const lastUpdate = document.querySelector("#lastUpdate");
const countInfo = document.querySelector("#countInfo");
const sortableHeaders = document.querySelectorAll("th[data-sort-key]");

// ----- 상수 -----
const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
// CoinGecko: 시가총액 큰 순으로 상위 코인을 받아온다 (per_page 250 × 2페이지 = 500위까지)
const CG_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=";

// ----- 상태 -----
let allCryptoData = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentTab = "all";
let sortKey = "marketCap"; // 기본 정렬: 시가총액 (밈코인보다 주요 코인이 위로)
let sortDir = "desc";

let marketCapMap = new Map(); // 소문자 심볼(base) -> 시가총액
const rowMap = new Map();     // symbol -> <tr>
const prevPrices = new Map(); // symbol -> 직전 가격

// ----- 큰 숫자 축약 포맷 (1.30T, 45.2B, 12.3M ...) -----
function formatCompact(n) {
    if (n === null || n === undefined || isNaN(n)) return "-";
    if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return n.toLocaleString();
}

// ----- CoinGecko에서 시가총액 가져오기 (5분 주기) -----
async function fetchMarketCaps() {
    try {
        const pages = await Promise.all(
            [1, 2].map((p) => fetch(CG_URL + p).then((r) => (r.ok ? r.json() : [])))
        );
        const coins = pages.flat();
        if (!coins.length) return;

        const map = new Map();
        for (const coin of coins) {
            const sym = (coin.symbol || "").toLowerCase();
            // 시총 큰 순이므로 심볼이 겹치면 첫 등장(=시총 큰 쪽)만 유지 → 심볼 충돌 완화
            if (sym && !map.has(sym) && coin.market_cap) {
                map.set(sym, coin.market_cap);
            }
        }
        marketCapMap = map;
        filterAndRender(); // 시총이 들어오면 다시 그려서 반영
    } catch (error) {
        console.error("CoinGecko Error:", error);
    }
}

// ----- Binance 데이터 가져오기 (매초) -----
async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("데이터를 불러오는데 실패했습니다.");
        }
        const data = await response.json();

        allCryptoData = data.filter(
            (item) => item.symbol.endsWith("USDT") && parseFloat(item.lastPrice) !== 0
        );

        filterAndRender();
        setLastUpdateTime();

        loading.classList.add("hidden");
        cryptoTable.classList.remove("hidden");
    } catch (error) {
        console.error("Error:", error);
        loading.textContent = "데이터를 불러오는 중 오류가 발생했습니다.";
    }
}

// ----- 탭 + 검색 + 정렬 적용 후 렌더 -----
function filterAndRender() {
    const searchTerm = searchInput.value.toUpperCase();
    let filtered = allCryptoData.filter((item) => item.symbol.includes(searchTerm));

    if (currentTab === "favorites") {
        filtered = filtered.filter((item) => favorites.includes(item.symbol));
    }

    const sorted = sortData(filtered);
    renderData(sorted);
    updateCountInfo(sorted.length);
}

// ----- 심볼로 시가총액 조회 (렌더/정렬 시점에 최신 맵에서 읽음) -----
function getMarketCap(item) {
    const base = item.symbol.replace(/USDT$/, "").toLowerCase();
    return marketCapMap.get(base) ?? null;
}

// ----- 정렬 (값 없는 항목은 항상 아래로) -----
function getSortValue(item) {
    if (sortKey === "symbol") return item.symbol;
    if (sortKey === "marketCap") return getMarketCap(item);
    return parseFloat(item[sortKey]); // lastPrice, priceChangePercent, quoteVolume, highPrice, lowPrice
}

function sortData(list) {
    const sorted = [...list];
    sorted.sort((a, b) => {
        if (sortKey === "symbol") {
            return sortDir === "asc"
                ? a.symbol.localeCompare(b.symbol)
                : b.symbol.localeCompare(a.symbol);
        }
        const av = getSortValue(a);
        const bv = getSortValue(b);
        const aEmpty = av === null || av === undefined || isNaN(av);
        const bEmpty = bv === null || bv === undefined || isNaN(bv);
        if (aEmpty && bEmpty) return 0;
        if (aEmpty) return 1;  // a를 아래로
        if (bEmpty) return -1; // b를 아래로
        return sortDir === "asc" ? av - bv : bv - av;
    });
    return sorted;
}

// ----- 렌더링 (행 재사용 in-place → 깜빡임 없음) -----
function renderData(data) {
    const visibleSymbols = new Set(data.map((item) => item.symbol));

    for (const [symbol, row] of rowMap) {
        if (!visibleSymbols.has(symbol)) {
            row.remove();
            rowMap.delete(symbol);
            prevPrices.delete(symbol);
        }
    }

    data.forEach((item) => {
        let row = rowMap.get(item.symbol);
        if (!row) {
            row = createRow(item);
            rowMap.set(item.symbol, row);
        } else {
            updateRow(row, item);
        }
        cryptoList.appendChild(row); // 정렬 순서대로 재배치 (기존 노드는 이동)
    });
}

// ----- 행 생성 -----
function createRow(item) {
    const row = document.createElement("tr");
    row.dataset.symbol = item.symbol;
    row.innerHTML = `
        <td>
            <button class="fav-btn" data-symbol="${item.symbol}" aria-label="관심 토글">☆</button>
        </td>
        <td class="symbol">${item.symbol}</td>
        <td class="price"></td>
        <td class="change"></td>
        <td class="mcap"></td>
        <td class="qvol"></td>
        <td class="high"></td>
        <td class="low"></td>
    `;
    updateRow(row, item, true);
    return row;
}

// ----- 행 갱신 -----
function updateRow(row, item, isNew = false) {
    const price = parseFloat(item.lastPrice);
    const change = parseFloat(item.priceChangePercent);
    const high = parseFloat(item.highPrice);
    const low = parseFloat(item.lowPrice);
    const quoteVolume = parseFloat(item.quoteVolume);

    const priceCell = row.querySelector(".price");
    const changeCell = row.querySelector(".change");
    const mcapCell = row.querySelector(".mcap");
    const qvolCell = row.querySelector(".qvol");
    const highCell = row.querySelector(".high");
    const lowCell = row.querySelector(".low");
    const favBtn = row.querySelector(".fav-btn");

    if (!isNew) {
        const prev = prevPrices.get(item.symbol);
        if (prev !== undefined && price !== prev) {
            flashCell(priceCell, price > prev);
        }
    }
    prevPrices.set(item.symbol, price);

    priceCell.textContent = price.toLocaleString();
    changeCell.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    changeCell.className = `change ${change >= 0 ? "up" : "down"}`;
    mcapCell.textContent = formatCompact(getMarketCap(item));
    qvolCell.textContent = formatCompact(quoteVolume);
    highCell.textContent = high.toLocaleString();
    lowCell.textContent = low.toLocaleString();

    const isFavorite = favorites.includes(item.symbol);
    favBtn.textContent = isFavorite ? "★" : "☆";
    favBtn.classList.toggle("active", isFavorite);
}

// ----- 색 플래시 -----
function flashCell(cell, isUp) {
    if (typeof cell.animate !== "function") return;
    const color = isUp ? "rgba(46, 204, 113, 0.5)" : "rgba(231, 76, 60, 0.5)";
    cell.animate(
        [{ backgroundColor: color }, { backgroundColor: "transparent" }],
        { duration: 600, easing: "ease-out" }
    );
}

// ----- 관심항목 토글 -----
function toggleFavorite(symbol) {
    const index = favorites.indexOf(symbol);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(symbol);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    filterAndRender();
}

// ----- 상태바 -----
function setLastUpdateTime() {
    lastUpdate.textContent = `마지막 업데이트: ${new Date().toLocaleTimeString("ko-KR")}`;
}

function updateCountInfo(count) {
    countInfo.textContent = `표시 ${count}개 · 관심 ${favorites.length}개`;
}

// ----- 정렬 방향 화살표 -----
function updateSortIndicators() {
    sortableHeaders.forEach((th) => {
        const arrow = th.querySelector(".sort-arrow");
        if (th.dataset.sortKey === sortKey) {
            arrow.textContent = sortDir === "asc" ? " ▲" : " ▼";
        } else {
            arrow.textContent = "";
        }
    });
}

// =============================================================
//  이벤트 등록 (addEventListener) ── 인라인 onclick 미사용
// =============================================================

// 관심 버튼: 이벤트 위임
cryptoList.addEventListener("click", (event) => {
    const button = event.target.closest(".fav-btn");
    if (!button) return;
    toggleFavorite(button.dataset.symbol);
});

// 검색
searchInput.addEventListener("input", filterAndRender);

// 탭 전환
allTab.addEventListener("click", () => switchTab("all"));
favoritesTab.addEventListener("click", () => switchTab("favorites"));

function switchTab(tab) {
    currentTab = tab;
    allTab.classList.toggle("active", tab === "all");
    favoritesTab.classList.toggle("active", tab === "favorites");
    filterAndRender();
}

// 헤더 클릭 정렬
sortableHeaders.forEach((th) => {
    th.addEventListener("click", () => {
        const key = th.dataset.sortKey;
        if (sortKey === key) {
            sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            sortKey = key;
            // 심볼은 오름차순, 숫자(가격·시총·거래대금 등)는 내림차순이 기본
            sortDir = key === "symbol" ? "asc" : "desc";
        }
        updateSortIndicators();
        filterAndRender();
    });
});

// ----- 초기 실행 -----
updateSortIndicators();
fetchMarketCaps();                          // 시가총액 먼저 요청
fetchCryptoData();                          // Binance 시세
setInterval(fetchCryptoData, 1000);         // 요구사항: 매초 갱신
setInterval(fetchMarketCaps, 5 * 60 * 1000); // 시총은 5분마다 갱신 (요청 제한 고려)
