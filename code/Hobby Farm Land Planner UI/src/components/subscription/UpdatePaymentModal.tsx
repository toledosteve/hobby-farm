import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CreditCard, Lock, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface UpdatePaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpdatePaymentModal({ open, onClose }: UpdatePaymentModalProps) {
  const handleUpdatePayment = () => {
    // In production, this would redirect to Stripe Customer Portal
    toast.success("Redirecting to secure payment update...");
    
    // Simulate redirect
    setTimeout(() => {
      toast.success("Payment method updated successfully");
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium mb-1">Secure Payment Processing</div>
                <p className="text-muted-foreground text-xs">
                  You'll be redirected to our secure payment partner, Stripe, to
                  update your payment information. Your card details are never
                  stored on our servers.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                256-bit SSL encryption
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                PCI DSS Level 1 compliant
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Your subscription will continue uninterrupted
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpdatePayment} className="flex-1 gap-2">
              <CreditCard className="w-4 h-4" />
              Continue to Stripe
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You'll return to this page after updating your payment method
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}