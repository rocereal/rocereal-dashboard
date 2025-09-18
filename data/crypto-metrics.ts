import { DollarSign, TrendingUp, TrendingDown, Zap } from "lucide-react";

export interface CryptoMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  description?: string;
}

export const cryptoMetrics: CryptoMetric[] = [
  {
    id: "portfolio-value",
    title: "Portfolio Value",
    value: "$52,430",
    change: "+8% today",
    changeType: "positive",
    icon: DollarSign,
    description: "Total portfolio value across all assets",
  },
  {
    id: "daily-pnl",
    title: "Daily P&L",
    value: "+$4,120",
    change: "Best gain in 7 days",
    changeType: "positive",
    icon: TrendingUp,
    description: "Profit and loss for the current day",
  },
  {
    id: "top-gainer",
    title: "Top Gainer",
    value: "SOL +14%",
    change: "24h change",
    changeType: "positive",
    icon: Zap,
    description: "Best performing asset in portfolio",
  },
  {
    id: "top-loser",
    title: "Top Loser",
    value: "DOGE -6%",
    change: "24h change",
    changeType: "negative",
    icon: TrendingDown,
    description: "Worst performing asset in portfolio",
  },
];
