import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { AlertCircle, Calendar, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBilling } from '@/contexts';

interface CancelSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CancelSubscriptionModal({ open, onClose }: CancelSubscriptionModalProps) {
  const { cancelSubscription, summary, formatDate } = useBilling();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const nextBillingDate = summary?.subscription?.currentPeriodEnd
    ? formatDate(summary.subscription.currentPeriodEnd)
    : 'end of billing period';

  const handleContinueToCancel = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    try {
      await cancelSubscription();
      toast.success(`Subscription canceled. You'll have access until ${nextBillingDate}`);
      onClose();
      setShowConfirmation(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (showConfirmation) {
    return (
      <Dialog open={open} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-4 bg-destructive/5 border-destructive/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium mb-1 text-destructive">
                    This action cannot be undone
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Your subscription will be canceled at the end of your current
                    billing period. You will not be charged again.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Your farm data will remain accessible until{' '}
                <span className="font-medium text-foreground">
                  {nextBillingDate}
                </span>
                .
              </p>
              <p className="text-muted-foreground">
                After that date, your account will be downgraded to the free
                Starter plan with limited features.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancel}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Cancel Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We're sorry to see you go. Before you cancel, here's what will happen:
          </p>

          <Card className="p-4 bg-muted/50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium mb-1">Access Until</div>
                <p className="text-muted-foreground">
                  {nextBillingDate}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You'll continue to have full access to your farm data and all
              features until this date.
            </p>
          </Card>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                You won't be charged again after your current billing period ends
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Your farm data will be preserved and you can reactivate anytime
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                After cancellation, your account will revert to the free Starter plan
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground mb-4 text-center">
              Is there something we could do better? We'd love to hear your feedback.
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Keep Subscription
              </Button>
              <Button
                variant="outline"
                onClick={handleContinueToCancel}
                className="flex-1 text-muted-foreground"
              >
                Continue to Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
