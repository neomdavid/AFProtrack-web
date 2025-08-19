import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from '@phosphor-icons/react';

const CustomToast = ({ message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <XCircle size={20} className="text-red-600" />;
      case 'warning':
        return <XCircle size={20} className="text-yellow-600" />;
      default:
        return <CheckCircle size={20} className="text-blue-600" />;
    }
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm ${getToastStyles()}`}>
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default CustomToast;