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
