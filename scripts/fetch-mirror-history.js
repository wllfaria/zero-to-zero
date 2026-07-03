import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

/**
 * @typedef {Object} NinjaItem
 * @property {string} id
 * @property {string} name
 * @property {string} image
 * @property {string} category
 * @property {string} detailsId
 */

/**
 * @typedef {Object} NinjaPricePoint
 * @property {string} timestamp
 * @property {number} rate
 * @property {number} volumePrimaryValue
 */

/**
 * @typedef {Object} NinjaPair
 * @property {string} id
 * @property {number} rate
 * @property {number} volumePrimaryValue
 * @property {NinjaPricePoint[]} history
 */

/**
 * @typedef {Object} NinjaMirrorHistoryResponse
 * @property {NinjaItem} item
 * @property {NinjaPair[]} pairs
 */

/**
 * @typedef {Object} DailyRate
 * @property {string} date
 * @property {number} rate
 */

const NINJA_MIRROR_HISTORY_API =
  "https://poe.ninja/poe2/api/economy/exchange/current/details?league=Runes+of+Aldur&type=Currency&id=mirror-of-kalandra";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../data/mirror-history.json");
const OVERLAY_DATA_PATH = join(__dirname, "../data/overlay-data.json");
const FARMER_PROGRESS_PATH = join(__dirname, "../data/farmer-progress.json");
const FARMER_STREAM_DATA_PATH = join(
  __dirname,
  "../data/farmer-stream-data.json",
);

/** @param {DailyRate[]} mirrorHistory */
function updateOverlayData(mirrorHistory) {
  const farmerProgress = JSON.parse(
    readFileSync(FARMER_PROGRESS_PATH, "utf-8"),
  );
  const streamData = JSON.parse(readFileSync(FARMER_STREAM_DATA_PATH, "utf-8"));

  const netWorth = farmerProgress[farmerProgress.length - 1].rate;

  const totalHours = streamData.reduce((sum, d) => sum + d.hoursStreamed, 0);
  const avgHoursPerDay = totalHours / streamData.length;
  const divPerHour = netWorth / totalHours;

  const firstMirrorPrice = mirrorHistory[0].rate;
  const lastMirrorPrice = mirrorHistory[mirrorHistory.length - 1].rate;
  const mirrorDailyInflation =
    (lastMirrorPrice - firstMirrorPrice) / (mirrorHistory.length - 1);
  const mirrorPriceDelta =
    mirrorHistory.length > 1
      ? lastMirrorPrice - mirrorHistory[mirrorHistory.length - 2].rate
      : 0;

  const farmerDailyEarnings = divPerHour * avgHoursPerDay;
  const netDailyProgress = farmerDailyEarnings - mirrorDailyInflation;
  const currentGap = lastMirrorPrice - netWorth;
  const daysToMirror =
    currentGap <= 0
      ? 0
      : netDailyProgress > 0
        ? Math.ceil(currentGap / netDailyProgress)
        : null;

  const overlayData = {
    updatedAt: new Date().toISOString(),
    netWorth,
    mirrorPrice: lastMirrorPrice,
    mirrorPriceDelta,
    mirrorDailyInflation: Math.round(mirrorDailyInflation),
    daysToMirror,
  };

  writeFileSync(OVERLAY_DATA_PATH, JSON.stringify(overlayData, null, 2));
  console.log(
    `overlay data updated: net worth ${netWorth}d, mirror ${lastMirrorPrice}d, ETA ${daysToMirror === 0 ? "WE GOT IT" : (daysToMirror ?? "cooked")}`,
  );
}

/** @param {NinjaPricePoint[]} history
 * @returns {DailyRate[]} */
function lastByDay(history) {
  /** @type {Map<string, NinjaPricePoint>} */
  const byDay = new Map();

  for (const point of history) {
    const date = point.timestamp.slice(0, 10);
    const existing = byDay.get(date);
    if (!existing || point.timestamp > existing.timestamp) {
      byDay.set(date, point);
    }
  }

  return Array.from(byDay.entries())
    .map(([date, point]) => ({
      date,
      rate: Math.round(point.rate),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchNinjaHistory() {
  try {
    const response = await fetch(NINJA_MIRROR_HISTORY_API);
    /** @type {NinjaMirrorHistoryResponse} */
    const data = await response.json();
    const divinePriceHistory = data.pairs[0].history;

    const daily = lastByDay(divinePriceHistory).filter(
      (d) => d.date >= "2026-06-08",
    );
    writeFileSync(OUTPUT_PATH, JSON.stringify(daily, null, 2));
    console.log(`${daily.length} days of mirror history saved`);

    updateOverlayData(daily);
  } catch (err) {
    console.error("failed to fetch ninja mirror price history", err);
    process.abort();
  }
}

fetchNinjaHistory();
