import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const StarRating = ({ 
  rating, 
  maxRating = 5, 
  size = 16, 
  showCount = false, 
  reviewCount = 0,
  interactive = false,
  onChange
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
    const isFilled = starValue <= displayRating;
    const isHalfFilled = starValue - 0.5 <= displayRating && starValue > displayRating;

    return (
      <button
        key={index}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(starValue)}
        onMouseEnter={() => interactive && setHoverRating(starValue)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        className={`transition-colors duration-150 ${
          interactive ? "hover:text-accent cursor-pointer" : "cursor-default"
        }`}
      >
        <ApperIcon
          name="Star"
          size={size}
          className={`${
            isFilled || isHalfFilled 
              ? "text-accent fill-accent" 
              : "text-gray-300"
          }`}
        />
      </button>
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showCount && reviewCount > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;