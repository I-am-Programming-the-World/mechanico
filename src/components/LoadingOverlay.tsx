import { cn } from "@/lib/utils";

type LoadingOverlayProps = {
  message?: string;
  className?: string;
};

const LoadingOverlay = ({
  message = "در حال بارگذاری داده‌ها",
  className,
}: LoadingOverlayProps) => {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-muted" aria-hidden />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" aria-hidden />
        <span className="sr-only">{message}</span>
      </div>
      <p className="text-lg font-medium" aria-hidden>
        {message}
      </p>
    </div>
  );
};

export default LoadingOverlay;