import backgroundThree from "@/app/assets/images/background_three.jpg";
import ImageComponentOptimized from "@/components/shared/ImageComponentOptimized";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, CreditCard } from "lucide-react";
import LeftContent from "./LeftContent";

export default function RenderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <LeftContent />

          {/* Right Content - Hero Image and Payment Cards */}
          <div className="relative">
            {/* Main Hero Image */}
            <div className="relative flex justify-end items-end">
              {/* Image container */}
              <div className="relative overflow-hidden h-[30vh] lg:h-screen w-3/4 flex flex-col">
                <ImageComponentOptimized
                  unoptimized={true}
                  alt={"Fisio"}
                  src={backgroundThree}
                  placeholder="blur"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Payment Transfer Card */}
              <Card className="absolute top-4 left-4 p-4 bg-white/90 backdrop-blur-sm shadow-lg max-w-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total transfer
                    </span>
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold">+$1,275.20</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">To</span>
                      <span>BCA • 2468 3545 4534</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer</span>
                      <span>$154.42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admin fee</span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        Free
                      </Badge>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total transfer</span>
                      <span>$154.42</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Invoice Card */}
              <Card className="absolute bottom-20 left-8 p-4 bg-white/90 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Invoice paid</div>
                    <div className="font-bold">$156.99</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
