import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { ITrackingInfoProps } from "@/types/tracking";


const OrderTracking: React.FC<ITrackingInfoProps> = ({
  tracking,
  onAddTracking,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingNumberInput, setTrackingNumberInput] = useState("");
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState("");

  const handleAddTracking = () => {
    if (onAddTracking && carrierInput && trackingNumberInput) {
      onAddTracking({
        carrier: carrierInput,
        trackingNumber: parseInt(trackingNumberInput),
        estimatedDelivery: estimatedDeliveryInput
          ? new Date(estimatedDeliveryInput)
          : undefined,
      });
      setIsDialogOpen(false);
    }
  };

  if (tracking) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Tracking Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Carrier:</span>
            <span className="text-sm text-muted-foreground">
              {tracking.carrier}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tracking Number:</span>
            <span className="text-sm text-muted-foreground">
              {tracking.trackingNumber}
            </span>
          </div>
          {tracking.estimatedDelivery && (
            <div className="flex justify-between">
              <span className="font-medium">Estimated Delivery:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(tracking.estimatedDelivery).toLocaleDateString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="mr-2 h-5 w-5" />
          Tracking Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Add Tracking Information
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tracking Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carrier" className="text-right">
                  Carrier
                </Label>
                <Input
                  id="carrier"
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trackingNumber" className="text-right">
                  Tracking Number
                </Label>
                <Input
                  id="trackingNumber"
                  type="number"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedDelivery" className="text-right">
                  Estimated Delivery
                </Label>
                <Input
                  id="estimatedDelivery"
                  type="date"
                  value={estimatedDeliveryInput}
                  onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleAddTracking}
                disabled={!carrierInput || !trackingNumberInput}
              >
                Add Tracking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
