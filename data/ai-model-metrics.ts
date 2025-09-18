import { Target, CheckCircle, Clock, Zap } from "lucide-react";

export interface ModelMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description: string;
  icon: any;
}

export const modelMetricsData: ModelMetric[] = [
  {
    id: "response-accuracy",
    title: "Response Accuracy",
    value: "87.3%",
    change: "-2.1% from last month",
    changeType: "negative",
    description: "Human-rated or benchmarked response quality",
    icon: Target,
  },
  {
    id: "completion-success-rate",
    title: "Completion Success Rate",
    value: "92.8%",
    change: "+1.5% from last week",
    changeType: "positive",
    description: "Requests successfully answered",
    icon: CheckCircle,
  },
  {
    id: "latency",
    title: "Average Latency",
    value: "1.2s",
    change: "+8.7% from last month",
    changeType: "negative",
    description: "Average response time per request",
    icon: Clock,
  },
  {
    id: "token-usage",
    title: "Token Usage Ratio",
    value: "2.1:1",
    change: "-3.2% efficiency",
    changeType: "negative",
    description: "Input vs output tokens ratio",
    icon: Zap,
  },
];
