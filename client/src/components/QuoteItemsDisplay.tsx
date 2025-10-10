import React from 'react';
import { QuoteItem } from '../types';
import { Card, CardContent } from './ui/card';
import { Package } from 'lucide-react';

interface QuoteItemsDisplayProps {
  quoteItems: QuoteItem[];
  currency?: string;
  showTitle?: boolean;
}

const QuoteItemsDisplay: React.FC<QuoteItemsDisplayProps> = ({ 
  quoteItems, 
  currency = 'AED',
  showTitle = true
}) => {
  if (!quoteItems || quoteItems.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTotalPrice = () => {
    return quoteItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  return (
    <div className="space-y-3">
      {showTitle && (
        <div className="flex items-center space-x-2 mb-3">
          <Package className="w-5 h-5 text-blue-600" />
          <h5 className="font-semibold text-gray-900">Item-Level Breakdown</h5>
          <span className="text-sm text-gray-500">({quoteItems.length} items quoted)</span>
        </div>
      )}
      
      <div className="space-y-2">
        {quoteItems.map((item, index) => (
          <Card key={item.id || index} className="border border-gray-200">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h6 className="font-medium text-gray-900">{item.item_name}</h6>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">Quantity:</span>{' '}
                      <span className="font-medium">{item.quantity_quoted}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit Price:</span>{' '}
                      <span className="font-medium">{formatCurrency(item.unit_price)}</span>
                    </div>
                    {item.delivery_time && (
                      <div>
                        <span className="text-gray-500">Delivery:</span>{' '}
                        <span className="font-medium">{item.delivery_time}</span>
                      </div>
                    )}
                  </div>
                  
                  {item.notes && (
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Note:</span> {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Summary */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total for {quoteItems.length} item(s):</span>
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(getTotalPrice())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuoteItemsDisplay;

