import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

const PriceRange = ({ 
  min = 0, 
  max = 1000, 
  value = [0, 1000], 
  onChange,
  className 
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 1);
    const newValue = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 1);
    const newValue = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Price Range</span>
        <span>${localValue[0]} - ${localValue[1]}</span>
      </div>
      
      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        
        {/* Active range */}
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
        />
        
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <input
          type="number"
          value={localValue[0]}
          onChange={(e) => {
            const newValue = [Math.max(min, Number(e.target.value)), localValue[1]];
            setLocalValue(newValue);
            onChange?.(newValue);
          }}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          value={localValue[1]}
          onChange={(e) => {
            const newValue = [localValue[0], Math.min(max, Number(e.target.value))];
            setLocalValue(newValue);
            onChange?.(newValue);
          }}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
        />
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF6B6B;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FF6B6B;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PriceRange;