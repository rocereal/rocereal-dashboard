import { FormField } from "./FormSection";

export const basicInfoFields: FormField[] = [
  {
    id: "name",
    label: "Product Name",
    type: "text",
    placeholder: "Enter product name",
    required: true,
  },
  {
    id: "sku",
    label: "SKU",
    type: "text",
    placeholder: "Enter SKU",
    required: true,
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    placeholder: "Select category",
    required: true,
    options: [
      { value: "Electronics", label: "Electronics" },
      { value: "Clothing", label: "Clothing" },
      { value: "Home & Kitchen", label: "Home & Kitchen" },
      { value: "Sports & Fitness", label: "Sports & Fitness" },
      { value: "Accessories", label: "Accessories" },
      { value: "Home & Office", label: "Home & Office" },
      { value: "Sports & Outdoors", label: "Sports & Outdoors" },
      { value: "Books", label: "Books" },
      { value: "Beauty & Personal Care", label: "Beauty & Personal Care" },
      { value: "Toys & Games", label: "Toys & Games" },
    ],
  },
];

export const descriptionFields: FormField[] = [
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter product description",
  },
];

export const pricingFields: FormField[] = [
  {
    id: "price",
    label: "Selling Price",
    type: "number",
    placeholder: "0.00",
    step: "0.01",
    required: true,
    icon: "dollar",
  },
  {
    id: "comparePrice",
    label: "Compare at Price",
    type: "number",
    placeholder: "0.00",
    step: "0.01",
    icon: "dollar",
    description: "Original price to show as a comparison (for sales/discounts)",
  },
];

export const costTaxFields: FormField[] = [
  {
    id: "costPrice",
    label: "Cost Price",
    type: "number",
    placeholder: "0.00",
    step: "0.01",
    icon: "dollar",
    description: "Your cost for this product (for profit calculations)",
  },
  {
    id: "taxRate",
    label: "Tax Rate (%)",
    type: "number",
    placeholder: "0.00",
    step: "0.01",
    description: "Tax rate as a percentage (e.g., 8.25 for 8.25%)",
  },
];

export const stockManagementFields: FormField[] = [
  {
    id: "stock",
    label: "Current Stock",
    type: "number",
    placeholder: "0",
    required: true,
    description: "Number of units currently available",
  },
  {
    id: "lowStockThreshold",
    label: "Low Stock Threshold",
    type: "number",
    placeholder: "10",
    description: "Alert when stock falls below this number",
  },
];

export const seoFields: FormField[] = [
  {
    id: "metaTitle",
    label: "Meta Title",
    type: "text",
    placeholder: "Enter meta title",
    maxLength: 60,
    showCharCount: true,
    description:
      "Appears in browser tabs, search results, and social media links. Keep it under 60 characters for best results.",
  },
  {
    id: "metaDescription",
    label: "Meta Description",
    type: "textarea",
    placeholder: "Enter meta description",
    maxLength: 160,
    showCharCount: true,
    description:
      "Appears under the title in search results. Write a compelling summary that encourages clicks. Keep it under 160 characters.",
  },
  {
    id: "urlSlug",
    label: "URL Slug",
    type: "text",
    placeholder: "product-name",
    prefix: "/products/",
    description:
      "The URL-friendly version of your product name. Leave blank to auto-generate from the product name.",
  },
];
