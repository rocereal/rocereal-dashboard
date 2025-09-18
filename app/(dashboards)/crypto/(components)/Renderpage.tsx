"use client";

import { DashboardHeader } from "@/components/custom/headers/dashboard-header";
import { SectionCards } from "./SectionCards";
import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { CoinConverter } from "@/components/crypto/coin-converter";
import { CryptoTable } from "@/components/crypto/crypto-table";
import { cryptoMetrics } from "@/data/crypto-metrics";
import { cryptoPriceData, cryptoCoins } from "@/data/crypto-prices";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { ChartConfig } from "@/components/ui/charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bitcoinConfig: ChartConfig = {
  bitcoin: {
    label: "Bitcoin",
    color: "var(--chart-1)",
  },
};

export default function RenderPage() {
  const [dateRange, setDateRange] = useState<DateTimeRange | undefined>();
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  const selectedCoinData = cryptoCoins.find((coin) => coin.id === selectedCoin);
  const coinConfig: ChartConfig = {
    [selectedCoin]: {
      label: selectedCoinData?.name || "Coin",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Crypto Performance Dashboard"
        subtitle="Track your crypto portfolio performance and market insights in real time."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Crypto Performance Dashboard" },
        ]}
        primaryAction={{
          label: "Add Asset",
          icon: <TrendingUp className="h-4 w-4" />,
        }}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <SectionCards metrics={cryptoMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Chart - Takes 2 columns */}
        <div className="lg:col-span-2 h-full">
          <SampleLineChart
            data={cryptoPriceData}
            title={`${selectedCoinData?.name || "Bitcoin"} Price Chart`}
            description={`Track ${
              selectedCoinData?.name || "Bitcoin"
            } price movements over time`}
            config={coinConfig}
            dataKeys={[selectedCoin]}
            dateKey="date"
            showTimeRange={true}
            showCoinSelector={true}
            selectedCoin={selectedCoin}
            onCoinChange={setSelectedCoin}
            cryptoCoins={cryptoCoins}
            className="h-full"
          />
        </div>

        {/* Coin Converter - Takes 1 column */}
        <div className="lg:col-span-1 h-full">
          <CoinConverter className="h-full shadow-xs" />
        </div>
      </div>

      <CryptoTable />
    </div>
  );
}
