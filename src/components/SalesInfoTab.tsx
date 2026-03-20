"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { formatPrice } from "@/lib/currency";
import api from "@/lib/api";
import type { Currency } from "@/lib/currency";

interface SaleRecord {
  id: string;
  price: number;
  operation: "Target" | "Offer";
  date: string;
}

interface ChartPoint {
  date: string;
  avgPrice: number;
  volume: number;
}

interface SalesData {
  sales: SaleRecord[];
  chartData: ChartPoint[];
  avgPrice: number;
  totalSales: number;
}

const PERIOD_DAYS: Record<string, number> = {
  "7D": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
};

export default function SalesInfoTab({
  skinId,
  currency,
  t,
}: {
  skinId: string;
  currency: Currency;
  t: (key: string) => string;
}) {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1Y");

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const days = PERIOD_DAYS[period] || 365;
        const { data: res } = await api.get(
          `/orders/skin/${skinId}/sales?days=${days}`
        );
        setData(res);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [skinId, period]);

  const chartData = useMemo(() => {
    if (!data?.chartData?.length) return [];
    return data.chartData.map((p) => ({
      ...p,
      label: new Date(p.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("loadingSales")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sales History Chart */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("salesHistory")}
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

        {chartData.length > 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.15)"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="price"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickFormatter={(v: number) => `$${v}`}
                  domain={["auto", "auto"]}
                />
                <YAxis
                  yAxisId="volume"
                  orientation="left"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "#d1d5db" }}
                  formatter={(value: any, name: any) => {
                    if (name === "avgPrice")
                      return [formatPrice(Number(value), currency), "Price"];
                    return [value, "Volume"];
                  }}
                />
                {data?.avgPrice && (
                  <ReferenceLine
                    yAxisId="price"
                    y={data.avgPrice}
                    stroke="#9ca3af"
                    strokeDasharray="6 4"
                    label={{
                      value: `${t("avgPrice")} ${formatPrice(data.avgPrice, currency)}`,
                      position: "insideTopLeft",
                      fill: "#9ca3af",
                      fontSize: 11,
                    }}
                  />
                )}
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill="rgba(156,163,175,0.3)"
                  barSize={8}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="avgPrice"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#4ade80" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 bg-gray-50 dark:bg-gray-800/80 rounded-xl flex items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {t("noSalesHistory")}
            </p>
          </div>
        )}
      </div>

      {/* Recent Sales Table */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t("recentSales")}
        </h3>

        <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 gap-4 px-4 py-3 text-gray-500 dark:text-gray-400 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
            <span>{t("sellingPrice")}</span>
            <span>{t("operation")}</span>
            <span className="text-right">{t("dateTime")}</span>
          </div>

          {data?.sales && data.sales.length > 0 ? (
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
              {data.sales.map((sale) => (
                <div
                  key={sale.id}
                  className="grid grid-cols-3 gap-4 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-400/80"></span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(sale.price, currency)}
                    </span>
                  </div>
                  <span
                    className={
                      sale.operation === "Target"
                        ? "text-amber-500"
                        : "text-green-500"
                    }
                  >
                    {sale.operation}
                  </span>
                  <span className="text-right text-gray-500 dark:text-gray-400">
                    {new Date(sale.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {", "}
                    {new Date(sale.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>{t("noSalesHistory")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
