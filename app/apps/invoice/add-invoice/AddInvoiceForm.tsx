/**
 * Add Invoice Form Component
 * Comprehensive form for creating new invoices with all necessary sections
 * Includes company info, client info, project details, invoice items, and payment information
 * Handles form state management, calculations, and submission
 * Provides complete invoice creation workflow with validation and data processing
 */

"use client";

import { DashboardHeader } from "@/components/headers/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceDetail } from "@/data/invoices";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ClientInfo,
  CompanyInfo,
  InvoiceBasicInfo,
  InvoiceItemsSection,
  PaymentInfo,
  ProjectInfo,
} from "./components";

interface InvoiceItem {
  description: string;
  units: number;
  price: number;
  tax: number;
  amount: number;
}

/**
 * AddInvoiceForm component for comprehensive invoice creation
 * Manages complete invoice form state including all sections and calculations
 * Handles item management, tax calculations, and form submission
 * Provides structured workflow for creating professional invoices
 * @returns JSX element representing the complete invoice creation form
 */
export default function AddInvoiceForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Invoice basic info
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "Draft",

    // Company info
    companyName: "Acme Corporation",
    companyAddress: "123 Business St, City, State 12345",
    companyPhone: "(555) 123-4567",
    companyEmail: "billing@acme.com",
    companyWebsite: "www.acmecorp.com",
    companyABN: "12 345 678 901",

    // Client info
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
    clientWebsite: "",

    // Project info
    projectName: "",

    // Items
    items: [] as InvoiceItem[],

    // Payment info
    notes: "Thank you for your business. Payment is due within 30 days.",
    bankAccountName: "Acme Corporation",
    bankBSB: "123-456",
    bankAccountNumber: "123456789",
    paypalEmail: "billing@acmecorp.com",
    creditCardNote: "Accepted via secure payment gateway",

    // Tax rate
    taxRate: 8,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      units: 1,
      price: 0,
      tax: 0,
      amount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      // Recalculate tax and amount
      if (field === "units" || field === "price") {
        const units =
          field === "units" ? Number(value) : updatedItems[index].units;
        const price =
          field === "price" ? Number(value) : updatedItems[index].price;
        const subtotal = units * price;
        const tax = (subtotal * prev.taxRate) / 100;
        updatedItems[index].tax = tax;
        updatedItems[index].amount = subtotal + tax;
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.units * item.price,
      0
    );
    const tax = formData.items.reduce((sum, item) => sum + item.tax, 0);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate invoice ID
    const invoiceId = `INV-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 1000)
    ).padStart(3, "0")}`;

    // Create invoice detail object
    const invoiceDetail: InvoiceDetail = {
      company: {
        name: formData.companyName,
        address: formData.companyAddress,
        phone: formData.companyPhone,
        email: formData.companyEmail,
        website: formData.companyWebsite,
        abn: formData.companyABN,
        logo: "/logo.png",
      },
      client: {
        name: formData.clientName,
        address: formData.clientAddress,
        phone: formData.clientPhone,
        email: formData.clientEmail,
        website: formData.clientWebsite,
      },
      project: {
        name: formData.projectName,
      },
      invoice: {
        number: formData.invoiceNumber || invoiceId,
        date: formData.date,
        dueDate: formData.dueDate,
        status: formData.status,
      },
      items: formData.items,
      totals: calculateTotals(),
      notes: formData.notes,
      paymentMethod: {
        bankTransfer: {
          accountName: formData.bankAccountName,
          bsb: formData.bankBSB,
          accountNumber: formData.bankAccountNumber,
        },
        paypal: formData.paypalEmail,
        creditCard: formData.creditCardNote,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency: "USD",
        taxRate: formData.taxRate,
      },
    };

    // In a real app, this would be saved to a database
    console.log("Invoice created:", invoiceDetail);

    // Redirect back to invoice list
    router.push("/invoice");
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Create New Invoice"
        subtitle="Fill in all the details to create a new invoice"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Invoices", href: "/invoice" },
          { label: "Create Invoice" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceBasicInfo
              invoiceNumber={formData.invoiceNumber}
              date={formData.date}
              dueDate={formData.dueDate}
              status={formData.status}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyInfo
              companyName={formData.companyName}
              companyAddress={formData.companyAddress}
              companyPhone={formData.companyPhone}
              companyEmail={formData.companyEmail}
              companyWebsite={formData.companyWebsite}
              companyABN={formData.companyABN}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientInfo
              clientName={formData.clientName}
              clientAddress={formData.clientAddress}
              clientPhone={formData.clientPhone}
              clientEmail={formData.clientEmail}
              clientWebsite={formData.clientWebsite}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectInfo
              projectName={formData.projectName}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardContent>
            <InvoiceItemsSection
              items={formData.items}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentInfo
              notes={formData.notes}
              bankAccountName={formData.bankAccountName}
              bankBSB={formData.bankBSB}
              bankAccountNumber={formData.bankAccountNumber}
              paypalEmail={formData.paypalEmail}
              creditCardNote={formData.creditCardNote}
              taxRate={formData.taxRate}
              onInputChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
