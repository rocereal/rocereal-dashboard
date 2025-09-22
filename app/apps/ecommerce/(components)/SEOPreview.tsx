"use client";

interface SEOPreviewProps {
  productData: {
    metaTitle: string;
    metaDescription: string;
    urlSlug: string;
    name: string;
    description: string;
  };
}

export function SEOPreview({ productData }: SEOPreviewProps) {
  const getDisplayTitle = () => {
    return productData.metaTitle || productData.name || "Your Product Title";
  };

  const getDisplayDescription = () => {
    return (
      productData.metaDescription ||
      productData.description?.substring(0, 160) ||
      "Your product description will appear here..."
    );
  };

  const getDisplayUrl = () => {
    return productData.urlSlug || "product-name";
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h5 className="text-sm font-medium mb-3">Search Result Preview</h5>
      <div className="space-y-2">
        <div className="text-blue-600 text-lg hover:underline cursor-pointer">
          {getDisplayTitle()}
        </div>
        <div className="text-green-700 text-sm">
          yourstore.com/products/{getDisplayUrl()}
        </div>
        <div className="text-gray-600 text-sm">{getDisplayDescription()}</div>
      </div>
    </div>
  );
}
