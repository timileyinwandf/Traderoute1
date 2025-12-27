import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  type: "top-banner" | "in-content" | "sidebar" | "bottom-banner";
  className?: string;
}

const AdPlaceholder = ({ type, className }: AdPlaceholderProps) => {
  const heights = {
    "top-banner": "h-24",
    "in-content": "h-64",
    "sidebar": "h-96",
    "bottom-banner": "h-24",
  };

  return (
    <>
      {/* AdSense: {type} */}
      <div
        className={cn(
          "ad-placeholder",
          `ad-${type}`,
          heights[type],
          "bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center my-4",
          className
        )}
      >
        <span className="text-muted-foreground text-sm font-medium">
          [AdSense {type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}]
        </span>
      </div>
    </>
  );
};

export default AdPlaceholder;
