import { cn } from "@/lib/utils";

type FlowPilotLogoProps = {
  className?: string;
  alt?: string;
};

export function FlowPilotLogo({
  className,
  alt = "FlowPilot",
}: FlowPilotLogoProps) {
  return (
    <img
      src="/flowpilot-logo.svg"
      alt={alt}
      width={32}
      height={32}
      className={cn("shrink-0 rounded-lg object-contain", className)}
      decoding="async"
    />
  );
}
