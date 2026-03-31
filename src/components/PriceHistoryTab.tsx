"use client";

import { useState, useEffect, useMemo } from "react";
import { formatPrice } from "@/lib/currency";
import api from "@/lib/api";
import type { Currency } from "@/lib/currency";

interface PricePoint {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  count: number;
}

const PERIOD_DAYS: Record<string, number> = {
  "7D": 7,
  "30D": 30,
  "90D": 90,
};

export default function PriceHistoryTab({
  skinId,
  currency,
  t,
}: {
  skinId: string;
  currency: Currency;
  t: (key: string) => string;
}) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30D");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const days = PERIOD_DAYS[period] || 30;
        const { data: res } = await api.get(
          `/skins/${skinId}/price-history?days=${days}`
        );
        setData(Array.isArray(res) ? res : []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [skinId, period]);

  // Filter to only days with actual transactions for stats
  const activeDays = useMemo(
    () => data.filter((d) => d.count > 0),
    [data]
  );

  const stats = useMemo(() => {
    if (!activeDays.length) return null;
    const allAvg =
      activeDays.reduce((s, d) => s + d.avgPrice, 0) / activeDays.length;
    const allMin = Math.min(...activeDays.map((d) => d.minPrice));
    const allMax = Math.max(...activeDays.map((d) => d.maxPrice));
    const totalCount = activeDays.reduce((s, d) => s + d.count, 0);
    return { avg: allAvg, min: allMin, max: allMax, totalCount };
  }, [activeDays]);

  // Chart values: use avgPrice for the line, but show 0 for days without trades
  const chartValues = useMemo(() => data.map((d) => d.avgPrice), [data]);

  const maxVal = useMemo(
    () => Math.max(...chartValues.filter((v) => v > 0), 0.01),
    [chartValues]
  );
  const minVal = useMemo(() => {
    const positives = chartValues.filter((v) => v > 0);
    return positives.length ? Math.min(...positives) : 0;
  }, [chartValues]);

  // Padding for the chart range
  const range = maxVal - minVal || maxVal * 0.1 || 1;
  const chartMin = Math.max(minVal - range * 0.1, 0);
  const chartMax = maxVal + range * 0.1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("loadingPriceHistory")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("priceHistory")}
        </h3>
        <div className="flex space-x-1">
          {Object.keys(PERIOD_DAYS).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                period === p
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {activeDays.length > 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-4">
          {/* SVG Line Chart */}
          <div className="relative" style={{ height: 200 }}>
            <svg
              viewBox={`0 0 ${data.length * 20} 200`}
              preserveAspectRatio="none"
              className="w-full h-full"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = 190 - frac * 180;
                return (
                  <line
                    key={frac}
                    x1={0}
                    y1={y}
                    x2={data.length * 20}
                    y2={y}
                    stroke="rgba(128,128,128,0.15)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area fill under the line */}
              <path
                d={(() => {
                  const points: string[] = [];
                  let lastY: number | null = null;

                  data.forEach((d, i) => {
                    const x = i * 20 + 10;
                    if (d.count > 0) {
                      const y =
                        190 -
                        ((d.avgPrice - chartMin) / (chartMax - chartMin)) * 180;
                      points.push(`${points.length === 0 ? "M" : "L"}${x},${y}`);
                      lastY = y;
                    } else if (lastY !== null) {
                      // Carry forward last value for visual continuity
                      points.push(`L${x},${lastY}`);
                    }
                  });

                  if (!points.length) return "";

                  // Close the area path
                  const lastX = (data.length - 1) * 20 + 10;
                  const firstActiveIdx = data.findIndex((d) => d.count > 0);
                  const firstX = firstActiveIdx * 20 + 10;

                  return (
                    points.join(" ") +
                    ` L${lastX},190 L${firstX},190 Z`
                  );
                })()}
                fill="rgba(74,222,128,0.1)"
              />

              {/* Line */}
              <path
                d={(() => {
                  const points: string[] = [];
                  let lastY: number | null = null;

                  data.forEach((d, i) => {
                    const x = i * 20 + 10;
                    if (d.count > 0) {
                      const y =
                        190 -
                        ((d.avgPrice - chartMin) / (chartMax - chartMin)) * 180;
                      points.push(`${points.length === 0 ? "M" : "L"}${x},${y}`);
                      lastY = y;
                    } else if (lastY !== null) {
                      points.push(`L${x},${lastY}`);
                    }
                  });

                  return points.join(" ");
                })()}
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Dots for active days */}
              {data.map((d, i) => {
                if (d.count === 0) return null;
                const x = i * 20 + 10;
                const y =
                  190 -
                  ((d.avgPrice - chartMin) / (chartMax - chartMin)) * 180;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={hoveredIndex === i ? 5 : 3}
                    fill={hoveredIndex === i ? "#fff" : "#4ade80"}
                    stroke="#4ade80"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer transition-all"
                  />
                );
              })}

              {/* Invisible hit areas for hover */}
              {data.map((d, i) => {
                const x = i * 20;
                return (
                  <rect
                    key={`hit-${i}`}
                    x={x}
                    y={0}
                    width={20}
                    height={200}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIndex(i)}
                  />
                );
              })}
            </svg>

            {/* Hover tooltip */}
            {hoveredIndex !== null && data[hoveredIndex] && (
              <div
                className="absolute z-10 pointer-events-none"
                style={{
                  left: `${((hoveredIndex * 20 + 10) / (data.length * 20)) * 100}%`,
                  top: 0,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
                  <div className="text-gray-400 mb-1">
                    {new Date(data[hoveredIndex].date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </div>
                  {data[hoveredIndex].count > 0 ? (
                    <>
                      <div className="text-green-400 font-bold">
                        {t("avg")}: {formatPrice(data[hoveredIndex].avgPrice, currency)}
                      </div>
                      <div className="text-blue-400">
                        {t("min")}: {formatPrice(data[hoveredIndex].minPrice, currency)}
                      </div>
                      <div className="text-red-400">
                        {t("max")}: {formatPrice(data[hoveredIndex].maxPrice, currency)}
                      </div>
                      <div className="text-gray-400">
                        {t("trades")}: {data[hoveredIndex].count}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">{t("noTrades")}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Date labels */}
          <div className="flex mt-2">
            {data.map((d, i) => (
              <div
                key={d.date}
                className="flex-1 text-center"
                style={{ minWidth: 0 }}
              >
                {(i === 0 ||
                  i === data.length - 1 ||
                  i % Math.max(Math.floor(data.length / 6), 1) === 0) && (
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">
                    {new Date(d.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gray-50 dark:bg-gray-800/80 rounded-xl flex items-center justify-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {t("noPriceHistory")}
          </p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-3 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              {t("avgPriceLabel")}
            </span>
            <span className="text-lg font-bold text-green-500">
              {formatPrice(stats.avg, currency)}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-3 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              {t("minPriceLabel")}
            </span>
            <span className="text-lg font-bold text-blue-500">
              {formatPrice(stats.min, currency)}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-3 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              {t("maxPriceLabel")}
            </span>
            <span className="text-lg font-bold text-red-500">
              {formatPrice(stats.max, currency)}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-3 text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
              {t("totalTrades")}
            </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.totalCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
