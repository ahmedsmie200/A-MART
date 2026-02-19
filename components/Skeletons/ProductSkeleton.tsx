export default function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-card shadow rounded-lg overflow-hidden">

      <div className="bg-muted w-full aspect-square"></div>


      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>


      <div className="p-4 flex gap-2">
        <div className="h-8 bg-muted rounded flex-1"></div>
        <div className="h-8 bg-muted rounded w-12"></div>
      </div>
    </div>
  );
}
