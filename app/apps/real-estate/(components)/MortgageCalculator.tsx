"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/data/real-estate";
import { Calculator, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

interface MortgageCalculatorProps {
  property: Property;
  className?: string;
}

/**
 * Mortgage Calculator Component
 * Calculates mortgage payments based on property price and user inputs
 * Allows customization of down payment, interest rate, and loan term
 * Shows monthly payment, total payment, and total interest
 * @param property - The property object containing price information
 * @param className - Optional CSS class name for additional styling
 * @returns The JSX element representing the mortgage calculator
 */
export function MortgageCalculator({
  property,
  className,
}: MortgageCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Calculate mortgage when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [downPaymentPercent, interestRate, loanTerm, property.price]);

  const calculateMortgage = () => {
    const loanAmount = property.price * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      // Handle zero interest rate
      const payment = loanAmount / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalPayment(loanAmount);
      setTotalInterest(0);
      return;
    }

    // Standard mortgage formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyPaymentCalc =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPaymentCalc = monthlyPaymentCalc * numberOfPayments;
    const totalInterestCalc = totalPaymentCalc - loanAmount;

    setMonthlyPayment(monthlyPaymentCalc);
    setTotalPayment(totalPaymentCalc);
    setTotalInterest(totalInterestCalc);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const downPaymentAmount = property.price * (downPaymentPercent / 100);
  const loanAmount = property.price - downPaymentAmount;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price Display */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Property Price</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(property.price)}
          </p>
        </div>

        {/* Calculator Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="down-payment">Down Payment (%)</Label>
              <Input
                id="down-payment"
                type="number"
                min="0"
                max="100"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loan-term">Loan Term</Label>
            <Select
              value={loanTerm.toString()}
              onValueChange={(value) => setLoanTerm(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 years</SelectItem>
                <SelectItem value="20">20 years</SelectItem>
                <SelectItem value="30">30 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loan Summary */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Down Payment:</span>
            <span className="font-medium">
              {formatCurrency(downPaymentAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Loan Amount:</span>
            <span className="font-medium">{formatCurrency(loanAmount)}</span>
          </div>
        </div>

        {/* Payment Results */}
        <div className="space-y-4">
          <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Payment</p>
              <p className="text-lg font-semibold">
                {formatCurrency(totalPayment)}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <p className="text-lg font-semibold">
                {formatCurrency(totalInterest)}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center">
          <p>
            * This is an estimate only. Actual payments may vary based on credit
            score, taxes, insurance, and other fees.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
