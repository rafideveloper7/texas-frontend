export function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-xl aspect-square w-full"></div>
      <div className="h-4 bg-gray-800 rounded mt-2 w-3/4 mx-auto"></div>
    </div>
  );
}

export function DishSkeleton() {
  return (
    <div className="animate-pulse bg-gray-900 rounded-xl overflow-hidden">
      <div className="aspect-[4/3] bg-gray-800"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        <div className="h-3 bg-gray-800 rounded w-full"></div>
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-800 rounded w-1/3"></div>
          <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}