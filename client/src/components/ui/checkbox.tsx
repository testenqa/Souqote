import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  id, 
  checked, 
  onCheckedChange, 
  className = '' 
}) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        id={id}
        className={`w-4 h-4 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          checked 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
        onClick={() => onCheckedChange(!checked)}
      >
        {checked && <Check className="w-3 h-3" />}
      </button>
    </div>
  );
};

export { Checkbox };
