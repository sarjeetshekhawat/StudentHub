interface AdBannerProps {
  position?: "top" | "bottom" | "inline";
  className?: string;
}

/**
 * AdBanner – Placeholder for Google AdSense integration.
 * Replace the inner content with your AdSense <ins> tag when ready.
 * Publisher ID and slot IDs should be stored in environment variables.
 *
 * Example AdSense snippet (do not activate without approval):
 * <ins
 *   className="adsbygoogle"
 *   style={{ display: "block" }}
 *   data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
 *   data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT}
 *   data-ad-format="auto"
 *   data-full-width-responsive="true"
 * />
 */
export function AdBanner({ position = "inline", className = "" }: AdBannerProps) {
  // Set to true once AdSense is approved and configured
  const ADSENSE_ACTIVE = false;

  if (ADSENSE_ACTIVE) {
    return null; // Replace with real AdSense component
  }

  return (
    <div
      className={`flex items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/50 text-[var(--color-muted-foreground)] text-xs font-medium ${
        position === "top" || position === "bottom"
          ? "h-24 w-full"
          : "h-20 w-full"
      } ${className}`}
      aria-label="Advertisement placeholder"
      role="complementary"
    >
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-widest mb-0.5 opacity-60">Advertisement</div>
        <div className="text-[11px] opacity-40">Ad placeholder – {position}</div>
      </div>
    </div>
  );
}
