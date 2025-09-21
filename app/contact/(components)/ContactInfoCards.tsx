import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "123 Business Street, Suite 100\nNew York, NY 10001",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@company.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    content:
      "Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed",
  },
];

export default function ContactInfoCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {contactInfo.map((info, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-4">
              <div className="flex-shrink-0">
                <div className="size-8  lg:size-12 bg-primary/25 rounded-full flex items-center justify-center">
                  <info.icon className="size-3 lg:size-6 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-muted-foreground mb-2">
                  {info.title}
                </h3>
                <p className="text-sm lg:text-sm text-gray-600 dark:text-muted-foreground whitespace-pre-line">
                  {info.content}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
