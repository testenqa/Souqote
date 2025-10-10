import React, { useState, useEffect } from 'react';
import { RFQItem, QuoteItemFormData } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Check, X, Calculator } from 'lucide-react';

interface ItemLevelQuoteFormProps {
  rfqItems: RFQItem[];
  onQuoteItemsChange: (quoteItems: QuoteItemFormData[], totalPrice: number) => void;
  currency?: string;
}

const ItemLevelQuoteForm: React.FC<ItemLevelQuoteFormProps> = ({ 
  rfqItems, 
  onQuoteItemsChange,
  currency = 'AED'
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [quoteItems, setQuoteItems] = useState<Map<number, QuoteItemFormData>>(new Map());

  useEffect(() => {
    // Calculate total and notify parent
    const itemsArray = Array.from(quoteItems.values());
    const total = itemsArray.reduce((sum, item) => sum + item.total_price, 0);
    onQuoteItemsChange(itemsArray, total);
  }, [quoteItems, onQuoteItemsChange]);

  const toggleItemSelection = (index: number, item: RFQItem) => {
    const newSelected = new Set(selectedItems);
    const newQuoteItems = new Map(quoteItems);

    if (selectedItems.has(index)) {
      // Deselect item
      newSelected.delete(index);
      newQuoteItems.delete(index);
    } else {
      // Select item and initialize with default values
      newSelected.add(index);
      newQuoteItems.set(index, {
        rfq_item_index: index,
        item_name: item.name,
        quantity_quoted: item.quantity,
        unit_price: 0,
        total_price: 0,
        delivery_time: '',
        notes: '',
      });
    }

    setSelectedItems(newSelected);
    setQuoteItems(newQuoteItems);
  };

  const updateQuoteItem = (index: number, field: keyof QuoteItemFormData, value: any) => {
    const newQuoteItems = new Map(quoteItems);
    const item = newQuoteItems.get(index);
    
    if (!item) return;

    const updatedItem = { ...item, [field]: value };

    // Auto-calculate total_price when quantity or unit_price changes
    if (field === 'quantity_quoted' || field === 'unit_price') {
      updatedItem.total_price = updatedItem.quantity_quoted * updatedItem.unit_price;
    }

    newQuoteItems.set(index, updatedItem);
    setQuoteItems(newQuoteItems);
  };

  const selectAllItems = () => {
    const newSelected = new Set<number>();
    const newQuoteItems = new Map<number, QuoteItemFormData>();

    rfqItems.forEach((item, index) => {
      newSelected.add(index);
      newQuoteItems.set(index, {
        rfq_item_index: index,
        item_name: item.name,
        quantity_quoted: item.quantity,
        unit_price: 0,
        total_price: 0,
        delivery_time: '',
        notes: '',
      });
    });

    setSelectedItems(newSelected);
    setQuoteItems(newQuoteItems);
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
    setQuoteItems(new Map());
  };

  const getTotalPrice = () => {
    return Array.from(quoteItems.values()).reduce((sum, item) => sum + item.total_price, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!rfqItems || rfqItems.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        This RFQ doesn't have itemized requirements. Please provide a total quote above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">Select Items to Quote</h4>
          <p className="text-sm text-gray-600">
            Choose which items you want to provide quotes for ({selectedItems.size} of {rfqItems.length} selected)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllItems}
            className="text-xs"
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={deselectAllItems}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {rfqItems.map((item, index) => {
          const isSelected = selectedItems.has(index);
          const quoteItem = quoteItems.get(index);

          return (
            <Card key={index} className={`${isSelected ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                {/* Item Header with Checkbox */}
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id={`item-${index}`}
                      checked={isSelected}
                      onChange={() => toggleItemSelection(index, item)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <label htmlFor={`item-${index}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <div className="text-sm text-gray-600 ml-4">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    {item.specifications && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Specs:</span> {item.specifications}
                      </p>
                    )}
                    {item.preferred_brand && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Preferred Brand:</span> {item.preferred_brand}
                        {item.acceptable_alternatives && (
                          <span className="text-green-600 ml-1">(Alternatives OK)</span>
                        )}
                      </p>
                    )}
                  </label>
                </div>

                {/* Quote Input Fields (shown when selected) */}
                {isSelected && quoteItem && (
                  <div className="ml-8 mt-4 pt-4 border-t space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          required
                          value={quoteItem.quantity_quoted}
                          onChange={(e) => updateQuoteItem(index, 'quantity_quoted', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={item.quantity.toString()}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit Price ({currency}) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          required
                          value={quoteItem.unit_price || ''}
                          onChange={(e) => updateQuoteItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Total Price ({currency})
                        </label>
                        <div className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 font-medium text-blue-600">
                          {formatCurrency(quoteItem.total_price)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Delivery Time
                        </label>
                        <input
                          type="text"
                          value={quoteItem.delivery_time || ''}
                          onChange={(e) => updateQuoteItem(index, 'delivery_time', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 5-7 days"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        rows={2}
                        value={quoteItem.notes || ''}
                        onChange={(e) => updateQuoteItem(index, 'notes', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brand you're offering, warranty, special terms, etc."
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Summary */}
      {selectedItems.size > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Quote Summary</p>
                  <p className="text-sm text-gray-600">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Quote Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(getTotalPrice())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedItems.size === 0 && (
        <div className="text-center py-6 text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
          <p className="font-medium">⚠️ Please select at least one item to quote</p>
        </div>
      )}
    </div>
  );
};

export default ItemLevelQuoteForm;

