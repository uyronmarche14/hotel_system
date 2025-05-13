import { FaCheckCircle } from 'react-icons/fa';
import { useEffect } from 'react';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const SuccessToast = ({ 
  message, 
  isVisible, 
  onClose, 
  autoHideDuration = 3000 
}: SuccessToastProps) => {
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
    <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center max-w-md animate-fade-in">
      <FaCheckCircle className="mr-2 flex-shrink-0" />
      <div className="flex-grow mr-2">
        <p className="font-bold">Success</p>
        <p className="text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto text-green-700 hover:text-green-900 flex-shrink-0"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default SuccessToast; 