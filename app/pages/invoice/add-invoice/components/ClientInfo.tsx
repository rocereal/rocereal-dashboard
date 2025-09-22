import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ClientInfoProps {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  clientWebsite: string;
  onInputChange: (field: string, value: string | number) => void;
}

export function ClientInfo({
  clientName,
  clientAddress,
  clientPhone,
  clientEmail,
  clientWebsite,
  onInputChange,
}: ClientInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => onInputChange("clientName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => onInputChange("clientEmail", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientPhone">Phone</Label>
          <Input
            id="clientPhone"
            value={clientPhone}
            onChange={(e) => onInputChange("clientPhone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="clientWebsite">Website</Label>
          <Input
            id="clientWebsite"
            value={clientWebsite}
            onChange={(e) => onInputChange("clientWebsite", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="clientAddress">Address</Label>
        <Textarea
          id="clientAddress"
          value={clientAddress}
          onChange={(e) => onInputChange("clientAddress", e.target.value)}
          required
        />
      </div>
    </div>
  );
}
