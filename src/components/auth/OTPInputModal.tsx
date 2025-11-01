import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPInputModalProps {
  email: string;
  isOpen: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onClose: () => void;
  isVerifying: boolean;
}

export function OTPInputModal({ 
  email, 
  isOpen, 
  onVerify, 
  onResend, 
  onClose,
  isVerifying 
}: OTPInputModalProps) {
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (isOpen && resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCooldown === 0) {
      setCanResend(true);
    }
  }, [isOpen, resendCooldown]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setResendCooldown(60);
      setCanResend(false);
    }
  }, [isOpen]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    await onVerify(otp);
  };

  const handleResend = async () => {
    setIsResending(true);
    await onResend();
    setResendCooldown(60);
    setCanResend(false);
    setIsResending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only allow closing via the "Change email" button, not by clicking outside
      if (!open) return;
    }}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins text-center">
            Enter Verification Code
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            We've sent a 6-digit code to<br />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* OTP Input */}
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full h-12 bg-brand hover:bg-brand-hover text-white font-semibold text-lg rounded-xl"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>

          {/* Resend Section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Didn't receive the code?
            </p>
            {canResend ? (
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isResending}
                className="text-brand hover:text-brand-hover underline"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </Button>
            ) : (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Resend available in {resendCooldown}s
              </p>
            )}
          </div>

          {/* Change Email */}
          <button
            onClick={onClose}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
          >
            Change email address
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
