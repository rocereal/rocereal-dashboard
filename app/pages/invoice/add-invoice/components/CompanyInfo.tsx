/**
 * Company Info Component
 * Form section for collecting company information in invoice creation
 * Provides input fields for company name, address, phone, email, website, and ABN
 * Used in invoice creation workflow for company details entry
 * @param companyName - Company's full name
 * @param companyAddress - Company's complete address
 * @param companyPhone - Company's phone number
 * @param companyEmail - Company's email address
 * @param companyWebsite - Company's website URL
 * @param companyABN - Company's Australian Business Number
 * @param onInputChange - Callback function called when form fields change
 * @returns JSX element representing the company information form section
 */

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CompanyInfoProps {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyABN: string;
  onInputChange: (field: string, value: string | number) => void;
}

/**
 * CompanyInfo component for collecting company details in invoice creation
 * Renders form fields for company information including contact and business details
 * Manages form state through parent component callbacks
 * @param companyName - Current company name value
 * @param companyAddress - Current company address value
 * @param companyPhone - Current company phone value
 * @param companyEmail - Current company email value
 * @param companyWebsite - Current company website value
 * @param companyABN - Current company ABN value
 * @param onInputChange - Function called when any field value changes
 * @returns JSX element representing the company information form
 */
export function CompanyInfo({
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyWebsite,
  companyABN,
  onInputChange,
}: CompanyInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => onInputChange("companyName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="companyEmail">Email</Label>
          <Input
            id="companyEmail"
            type="email"
            value={companyEmail}
            onChange={(e) => onInputChange("companyEmail", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="companyPhone">Phone</Label>
          <Input
            id="companyPhone"
            value={companyPhone}
            onChange={(e) => onInputChange("companyPhone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="companyWebsite">Website</Label>
          <Input
            id="companyWebsite"
            value={companyWebsite}
            onChange={(e) => onInputChange("companyWebsite", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="companyAddress">Address</Label>
        <Textarea
          id="companyAddress"
          value={companyAddress}
          onChange={(e) => onInputChange("companyAddress", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="companyABN">ABN</Label>
        <Input
          id="companyABN"
          value={companyABN}
          onChange={(e) => onInputChange("companyABN", e.target.value)}
        />
      </div>
    </div>
  );
}
