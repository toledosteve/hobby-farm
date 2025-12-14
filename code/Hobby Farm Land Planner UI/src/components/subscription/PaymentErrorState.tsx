import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle, CreditCard, Mail } from "lucide-react";
import { useState } from "react";
import { UpdatePaymentModal } from "./UpdatePaymentModal";
import { toast } from "sonner@2.0.3";

interface PaymentErrorStateProps {
  errorMessage?: string;
  attemptDate?: string;
  nextRetryDate?: string;
}

export function PaymentErrorState({
  errorMessage = "Your payment method was declined",
  attemptDate = "December 14, 2024",
  nextRetryDate = "December 17, 2024",
}: PaymentErrorStateProps) {
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);

  const handleContactSupport = () => {
    toast.info("Opening support email...");
    // In production: window.location.href = 'mailto:support@hobbyfarmplanner.com';
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* Alert Banner */}
          <Card className="p-6 mb-6 bg-destructive/5 border-destructive/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 text-destructive">
                  Payment Failed
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  We couldn't process your payment on {attemptDate}. Please update
                  your payment method to keep your subscription active.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowUpdatePaymentModal(true)}
                    size="sm"
                    className="gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Update Payment Method
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleContactSupport}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* What Happens Next */}
          <Card className="p-6 mb-6">
            <h3 className="font-medium mb-4">What happens next?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">Update your payment method</div>
                  <p className="text-sm text-muted-foreground">
                    Add a new card or update your existing payment information.
                    We'll attempt to process payment immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">Automatic retry</div>
                  <p className="text-sm text-muted-foreground">
                    If you don't update your payment method, we'll automatically
                    retry on {nextRetryDate}.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-1">Grace period</div>
                  <p className="text-sm text-muted-foreground">
                    You'll retain access to all your farm data and features during
                    this time. We're here to help, not to interrupt your work.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Error Details */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Error Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Error Type:</span>
                <span className="font-medium">{errorMessage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attempt Date:</span>
                <span className="font-medium">{attemptDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Retry:</span>
                <span className="font-medium">{nextRetryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                  Past Due
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Need help?</strong> Common issues include expired cards,
                insufficient funds, or bank restrictions. Our support team is ready
                to assist you.
              </p>
            </div>
          </Card>
        </div>
      </div>

      <UpdatePaymentModal
        open={showUpdatePaymentModal}
        onClose={() => setShowUpdatePaymentModal(false)}
      />
    </>
  );
}
