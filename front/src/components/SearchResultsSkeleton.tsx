export default function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-700 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
      </div>

      {/* Results Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            {/* Poster Skeleton */}
            <div className="aspect-[2/3] bg-gray-700"></div>
            
            {/* Info Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-700 rounded w-full"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-700 rounded w-12"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button Skeleton */}
      <div className="text-center pt-8">
        <div className="h-12 bg-gray-700 rounded-lg w-32 mx-auto animate-pulse"></div>
      </div>
    </div>
  );
}

