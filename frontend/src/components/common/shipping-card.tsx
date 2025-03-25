import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import { IShippingInfoCardProps } from "@/types/shipping";

const ShippingInfoCard: React.FC<IShippingInfoCardProps> = ({ shipping }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span className="text-sm text-muted-foreground">{shipping.name}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            <span className="font-medium">Phone:</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {shipping.phone}
          </span>
        </div>

        {shipping.run && (
          <div className="flex justify-between">
            <span className="font-medium">RUN:</span>
            <span className="text-sm text-muted-foreground">
              {shipping.run}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="font-medium">Address:</span>
          <span className="text-sm text-muted-foreground text-right max-w-[60%]">
            {shipping.address}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Region:</span>
          <span className="text-sm text-muted-foreground">
            {shipping.region}
          </span>
        </div>

        {shipping.indications && (
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center mb-1">
              <span className="font-medium mr-2">Additional Indications:</span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              {shipping.indications}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingInfoCard;
