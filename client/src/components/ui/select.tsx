import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, { 
              isOpen, 
              setIsOpen,
              value 
            } as any);
          }
          if (child.type === SelectContent) {
            return React.cloneElement(child, { 
              isOpen, 
              onItemClick: handleItemClick 
            } as any);
          }
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void; value?: string }> = ({ 
  children, 
  className = '', 
  placeholder,
  isOpen,
  setIsOpen,
  value
}) => {
  return (
    <button
      type="button"
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${className}`}
      onClick={() => setIsOpen?.(!isOpen)}
    >
      <span className={value ? 'text-gray-900' : 'text-gray-500'}>
        {value || placeholder}
      </span>
      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

const SelectContent: React.FC<SelectContentProps & { isOpen?: boolean; onItemClick?: (value: string) => void }> = ({ 
  children, 
  isOpen,
  onItemClick
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { 
            onItemClick 
          } as any);
        }
        return child;
      })}
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps & { onItemClick?: (value: string) => void }> = ({ 
  value, 
  children, 
  onItemClick 
}) => {
  return (
    <button
      type="button"
      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
      onClick={() => onItemClick?.(value)}
    >
      {children}
    </button>
  );
};

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
