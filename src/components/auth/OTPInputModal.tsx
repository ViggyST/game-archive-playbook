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
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [expirationTime, setExpirationTime] = useState(300); // 5 minutes in seconds

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

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (isOpen && expirationTime > 0) {
      const timer = setTimeout(() => {
        setExpirationTime(expirationTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, expirationTime]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
      setResendCooldown(60);
      setCanResend(false);
      setExpirationTime(300); // Reset to 5 minutes
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
    
    setError(""); // Clear previous errors
    
    try {
      await onVerify(otp);
      // If successful, the modal will be closed by parent component
    } catch (err: any) {
      // Display error in modal
      setError(err.message || "Invalid code. Please try again.");
      // Clear OTP input so user can try again
      setOtp("");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await onResend();
    setResendCooldown(60);
    setCanResend(false);
    setExpirationTime(300); // Reset expiration timer
    setIsResending(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <DialogDescription className="text-center pt-2 space-y-2">
            <div>
              We've sent a 6-digit code to<br />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{email}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className={expirationTime < 60 ? "text-red-500 font-semibold" : "text-zinc-500 dark:text-zinc-400"}>
                Code expires in {formatTime(expirationTime)}
              </span>
              {expirationTime === 0 && (
                <span className="text-red-500 font-semibold ml-2">⏱️ Expired</span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* OTP Input */}
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError(""); // Clear error when user starts typing
            }}
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

          {/* Error Message */}
          {error && (
            <div className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

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
