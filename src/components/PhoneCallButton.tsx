import { useState } from "react";
import { Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

interface PhoneCallButtonProps {
  phone: string;
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  /** Render as a plain text link instead of a button */
  asLink?: boolean;
  onClick?: () => void;
}

/**
 * Phone CTA: on mobile triggers tel:, on desktop shows a dialog with the
 * number (since tel: links don't work in most desktop browsers).
 */
export const PhoneCallButton = ({
  phone,
  children,
  className,
  variant,
  size,
  asLink = false,
  onClick,
}: PhoneCallButtonProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();
    if (isMobile) {
      window.location.href = `tel:${phone}`;
      return;
    }
    e.preventDefault();
    setOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      toast({ title: "Phone number copied" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };

  const trigger = asLink ? (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className={
        className ?? "text-sm text-primary hover:text-primary-hover"
      }
    >
      {children ?? phone}
    </a>
  ) : (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={handleClick}
    >
      {children ?? (
        <>
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </>
      )}
    </Button>
  );

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Call this number</DialogTitle>
            <DialogDescription>
              Phone calls can't be placed directly from a desktop browser.
              Please dial this number from your phone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold tracking-wide">
                {phone}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};