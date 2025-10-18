import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EmailSentModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
}

export const EmailSentModal = ({
  isOpen,
  onClose,
  email,
  onResend,
  onChangeEmail
}: EmailSentModalProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    setIsResending(true);
    await onResend();
    setIsResending(false);
    setResendCooldown(60); // Start 60s cooldown
  };

  const handleChangeEmail = () => {
    onChangeEmail();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Check your email 📩</DialogTitle>
          <DialogDescription className="text-base pt-2">
            We've sent a login link to <strong className="text-foreground">{email}</strong>. 
            Click it to enter the archive.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : resendCooldown > 0 ? (
              `Resend available in ${resendCooldown}s`
            ) : (
              '🔁 I didn\'t get the link'
            )}
          </Button>
          
          <Button onClick={handleChangeEmail} variant="outline" className="w-full">
            ✏️ Try a different email
          </Button>
          
          <Button onClick={onClose} variant="ghost" className="w-full">
            ❌ Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
