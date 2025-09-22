import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { PricingComparison } from "@/data/pricing-design2";

interface ComparisonTableProps {
  comparisons: PricingComparison[];
}

export function ComparisonTable({ comparisons }: ComparisonTableProps) {
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Compare All Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 font-semibold">Features</th>
                <th className="text-center py-4 px-6 font-semibold">Free</th>
                <th className="text-center py-4 px-6 font-semibold">
                  Professional
                </th>
                <th className="text-center py-4 px-6 font-semibold">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comparison, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-4 px-6 font-medium">
                    {comparison.feature}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderFeatureValue(comparison.free)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderFeatureValue(comparison.pro)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderFeatureValue(comparison.enterprise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
