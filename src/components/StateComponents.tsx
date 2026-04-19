import { Loader2, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * LoadingState - Displays loading skeleton/spinner
 * Used across all pages for consistent loading UX
 */
export function LoadingState({ 
  text = "Loading...",
  fullHeight = true 
}: { 
  text?: string;
  fullHeight?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullHeight ? 'min-h-screen' : 'py-12'}`}>
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );
}

/**
 * EmptyState - Displays when no data is found
 * Consistent empty state UI across all list pages
 */
export function EmptyState({ 
  icon: Icon = Package,
  title = "No items found",
  description = "There are no items to display right now.",
  action,
  fullHeight = true
}: { 
  icon?: React.ComponentType<{ className: string }>;
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  fullHeight?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${fullHeight ? 'min-h-screen' : 'py-12'}`}>
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * ErrorState - Displays when an error occurs
 * Allows user to retry or go back
 */
export function ErrorState({ 
  title = "Something went wrong",
  description = "An error occurred while loading. Please try again.",
  onRetry,
  fullHeight = true
}: { 
  title?: string;
  description?: string;
  onRetry?: () => void;
  fullHeight?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${fullHeight ? 'min-h-screen' : 'py-12'}`}>
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="w-10 h-10 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} className="gap-2">
          Try Again
        </Button>
      )}
    </div>
  );
}

/**
 * LoadingSkeleton - Grid of skeleton loaders
 * Used for product/item listings
 */
export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="w-full h-48 bg-muted rounded-lg animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
