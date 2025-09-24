"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cryptoCoins } from "@/data/crypto-prices";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface CoinConverterProps {
  className?: string;
}

// Mock current prices (in a real app, this would come from an API)
const currentPrices = {
  bitcoin: 53500,
  ethereum: 3650,
  solana: 205,
  cardano: 0.52,
  polkadot: 8.5,
  chainlink: 16.8,
  avalanche: 33.5,
  polygon: 0.62,
};

export function CoinConverter({ className }: CoinConverterProps) {
  const [fromCoin, setFromCoin] = useState("bitcoin");
  const [toCoin, setToCoin] = useState("ethereum");
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    if (fromCoin && toCoin) {
      const fromPrice = currentPrices[fromCoin as keyof typeof currentPrices];
      const toPrice = currentPrices[toCoin as keyof typeof currentPrices];

      if (fromPrice && toPrice) {
        // Calculate how many units of toCoin you can get for 1 unit of fromCoin
        const rate = fromPrice / toPrice;
        setConversionRate(rate);
      }
    }
  }, [fromCoin, toCoin]);

  const fromCoinData = cryptoCoins.find((coin) => coin.id === fromCoin);
  const toCoinData = cryptoCoins.find((coin) => coin.id === toCoin);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(price);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Coin Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Coin Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">From</label>
          <Select value={fromCoin} onValueChange={setFromCoin}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cryptoCoins.map((coin) => (
                <SelectItem key={coin.id} value={coin.id}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{coin.icon}</span>
                    <span>{coin.name}</span>
                    <span className="text-muted-foreground">
                      ({coin.symbol})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            1 {fromCoinData?.symbol} ={" "}
            {formatPrice(currentPrices[fromCoin as keyof typeof currentPrices])}
          </div>
        </div>

        {/* Conversion Arrow */}
        <div className="flex justify-center border rounded-full p-4 w-fit mx-auto">
          <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* To Coin Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <Select value={toCoin} onValueChange={setToCoin}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cryptoCoins.map((coin) => (
                <SelectItem key={coin.id} value={coin.id}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{coin.icon}</span>
                    <span>{coin.name}</span>
                    <span className="text-muted-foreground">
                      ({coin.symbol})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            1 {toCoinData?.symbol} ={" "}
            {formatPrice(currentPrices[toCoin as keyof typeof currentPrices])}
          </div>
        </div>

        {/* Conversion Result */}
        {conversionRate && (
          <div className="pt-4 border-t">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">
                1 {fromCoinData?.symbol} = {conversionRate.toFixed(6)}{" "}
                {toCoinData?.symbol}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatPrice(
                  currentPrices[fromCoin as keyof typeof currentPrices]
                )}{" "}
                ={" "}
                {formatPrice(
                  currentPrices[toCoin as keyof typeof currentPrices] *
                    conversionRate
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
