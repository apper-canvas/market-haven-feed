import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  label,
  checked,
  ...props 
}, ref) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          className="sr-only"
          {...props}
        />
        <div className={cn(
          "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors duration-200",
          checked 
            ? "bg-primary border-primary text-white" 
            : "border-gray-300 hover:border-primary",
          className
        )}>
          {checked && <ApperIcon name="Check" size={14} />}
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-700">{label}</span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;