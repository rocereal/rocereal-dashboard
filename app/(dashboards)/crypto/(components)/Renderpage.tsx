"use client";

import { SampleLineChart } from "@/components/charts/SampleLineChart";
import { CoinConverter } from "@/app/(dashboards)/crypto/(components)/CoinConverter";
import { CryptoTable } from "@/app/(dashboards)/crypto/(components)/CryptoTable";
import { DashboardHeader } from "@/components/headers/dashboard-header";
import { ChartConfig } from "@/components/ui/charts";
import { DateTimeRange } from "@/components/ui/date-time-range-picker";
import { cryptoMetrics } from "@/data/crypto-metrics";
import { cryptoCoins, cryptoPriceData } from "@/data/crypto-prices";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { SectionCards } from "./SectionCards";

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

  /**
   * Render Page Component
   * This is the main rendering component for the crypto dashboard page
   * It displays the dashboard header with breadcrumbs and action buttons, followed by crypto metrics, price chart, coin converter, and crypto table
   * Provides the overall layout and navigation for the Crypto Performance dashboard
   * @returns The JSX element representing the complete crypto dashboard page layout
   */
  return (
    // Main container for the crypto dashboard layout
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
      {/* Grid container for chart and converter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Chart - Takes 2 columns */}
        {/* Price chart container */}
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
        {/* Coin converter container */}
        <div className="lg:col-span-1 h-full">
          <CoinConverter className="h-full shadow-xs" />
        </div>
      </div>
      <CryptoTable />
    </div>
  );
}
