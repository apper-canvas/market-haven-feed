const Loading = ({ className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Grid of skeleton cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-surface rounded-xl border border-gray-100 overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200 shimmer" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Brand skeleton */}
              <div className="h-3 bg-gray-200 rounded w-1/3 shimmer" />
              
              {/* Title skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full shimmer" />
                <div className="h-4 bg-gray-200 rounded w-2/3 shimmer" />
              </div>
              
              {/* Rating skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-3 bg-gray-200 rounded w-20 shimmer" />
                <div className="h-3 bg-gray-200 rounded w-12 shimmer" />
              </div>
              
              {/* Price skeleton */}
              <div className="h-5 bg-gray-200 rounded w-1/2 shimmer" />
              
              {/* Button skeleton */}
              <div className="h-10 bg-gray-200 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;