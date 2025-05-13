interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  color?: string;
  className?: string;
}

const LoadingSpinner = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  color = '#1C3F32',
  className = ''
}: LoadingSpinnerProps) => {
  // Different sizes for the spinner
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };
  
  // Wrapper classes based on fullScreen prop
  const wrapperClasses = fullScreen 
    ? 'fixed inset-0 bg-black/10 z-50 flex items-center justify-center'
    : `flex items-center justify-center ${className}`;

  return (
    <div 
      className={wrapperClasses}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center">
        <div 
          className={`rounded-full border-t-transparent animate-spin ${sizeClasses[size]}`}
          style={{ borderColor: `${color} transparent transparent transparent` }}
        ></div>
        <span className="sr-only">{message}</span>
        {message && !fullScreen && (
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 