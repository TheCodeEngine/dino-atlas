export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-surface-container-high rounded-lg ${className}`}
      {...props}
    />
  );
}
