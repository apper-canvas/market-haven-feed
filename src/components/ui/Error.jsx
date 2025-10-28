import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="bg-error/10 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" size={48} className="text-error" />
      </div>
      
      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2 text-center">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          icon="RefreshCw"
          className="bg-primary hover:bg-primary/90"
        >
          Try Again
        </Button>
      )}
      
      <Button
        variant="ghost"
        onClick={() => window.location.href = "/"}
        className="mt-4"
      >
        Go Back Home
      </Button>
    </div>
  );
};

export default Error;