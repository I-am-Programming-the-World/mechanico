type LoadingOverlayProps = {
  message?: string;
  className?: string;
  hidden?: boolean;
};

export default function LoadingOverlay({
  message = "در حال بارگذاری...",
  className = "",
  hidden = false,
}: LoadingOverlayProps) {
  if (hidden) return null;
  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-right">
        <div className="relative h-14 w-14" aria-hidden>
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
