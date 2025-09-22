"use client";

interface PricingPreviewProps {
  productData: {
    price: string;
    comparePrice: string;
    costPrice: string;
  };
}

export function PricingPreview({ productData }: PricingPreviewProps) {
  const calculateMargin = () => {
    const price = parseFloat(productData.price);
    const cost = parseFloat(productData.costPrice);

    if (price && cost && price > cost) {
      return (((price - cost) / price) * 100).toFixed(1);
    }
    return "0.0";
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h5 className="text-sm font-medium mb-2">Pricing Preview</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Selling Price:</span>
          <div className="font-medium">${productData.price || "0.00"}</div>
        </div>
        {productData.comparePrice && (
          <div>
            <span className="text-muted-foreground">Compare Price:</span>
            <div className="font-medium line-through text-muted-foreground">
              ${productData.comparePrice}
            </div>
          </div>
        )}
        {productData.costPrice && (
          <div>
            <span className="text-muted-foreground">Cost:</span>
            <div className="font-medium">${productData.costPrice}</div>
          </div>
        )}
        {productData.price && productData.costPrice && (
          <div>
            <span className="text-muted-foreground">Margin:</span>
            <div className="font-medium">{calculateMargin()}%</div>
          </div>
        )}
      </div>
    </div>
  );
}
