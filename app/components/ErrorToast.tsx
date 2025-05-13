import { FaExclamationTriangle } from 'react-icons/fa';
import { useEffect } from 'react';

interface ErrorToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const ErrorToast = ({ 
  message, 
  isVisible, 
  onClose, 
  autoHideDuration = 5000 
}: ErrorToastProps) => {
  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoHideDuration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center max-w-md animate-fade-in">
      <FaExclamationTriangle className="mr-2 flex-shrink-0" />
      <div className="flex-grow mr-2">
        <p className="font-bold">Error</p>
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto text-red-700 hover:text-red-900 flex-shrink-0"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorToast; 