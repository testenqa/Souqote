import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Quote } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyQuotes: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: quotes, isLoading, error } = useQuery(
    ['my-quotes', user?.id, statusFilter],
    async () => {
      if (!user) return [];
      
      let query = supabase
        .from('quotes')
        .select(`
          *,
          rfq:rfqs (
            id,
            title,
            description,
            category,
            location,
            budget_min,
            budget_max,
            deadline,
            urgency,
            status,
            buyer:users!rfqs_buyer_id_fkey (
              id,
              first_name,
              last_name,
              company_name,
              rating
            )
          )
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Quote[];
    },
    { enabled: !!user }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isQuoteExpired = (quote: Quote) => {
    const quoteDate = new Date(quote.created_at);
    const expiryDate = new Date(quoteDate.getTime() + (quote.validity_period * 24 * 60 * 60 * 1000));
    return new Date() > expiryDate && quote.status === 'pending';
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading your quotes</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quotes</h1>
            <p className="text-gray-600">Track and manage your submitted quotes</p>
          </div>
          <Link to="/rfqs">
            <Button>Browse RFQs</Button>
          </Link>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({quotes?.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({quotes?.filter(quote => quote.status === 'pending').length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('accepted')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'accepted'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Accepted ({quotes?.filter(quote => quote.status === 'accepted').length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejected ({quotes?.filter(quote => quote.status === 'rejected').length || 0})
          </button>
        </div>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {quotes?.map((quote) => (
          <Card key={quote.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {quote.rfq?.title}
                    </h3>
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status}
                    </Badge>
                    {quote.rfq?.urgency && (
                      <Badge className={getUrgencyColor(quote.rfq.urgency)}>
                        {quote.rfq.urgency}
                      </Badge>
                    )}
                    {isQuoteExpired(quote) && (
                      <Badge className="bg-gray-100 text-gray-800">
                        Expired
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {quote.rfq?.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>Buyer: {quote.rfq?.buyer?.first_name} {quote.rfq?.buyer?.last_name}</span>
                    {quote.rfq?.buyer?.company_name && (
                      <span className="ml-2">• {quote.rfq.buyer.company_name}</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatCurrency(quote.price, quote.currency)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Delivery: {quote.delivery_time}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{quote.rfq?.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{quote.rfq?.location}</p>
                </div>
                {quote.rfq?.budget_min && quote.rfq?.budget_max && (
                  <div>
                    <span className="text-gray-500">Budget Range:</span>
                    <p className="font-medium">
                      {formatCurrency(quote.rfq.budget_min)} - {formatCurrency(quote.rfq.budget_max)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">RFQ Deadline:</span>
                  <p className="font-medium text-red-600">
                    {quote.rfq?.deadline ? formatDate(quote.rfq.deadline) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Your Quote Message:</h4>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">
                  {quote.message}
                </p>
              </div>

              {quote.terms_conditions && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions:</h4>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">
                    {quote.terms_conditions}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>Submitted {formatDate(quote.created_at)}</span>
                  <span>Valid for {quote.validity_period} days</span>
                  {isQuoteExpired(quote) && (
                    <span className="text-red-600 font-medium">Expired</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link to={`/rfqs/${quote.rfq?.id}`}>
                    <Button variant="outline" size="sm">
                      View RFQ
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    Messages
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No quotes found</div>
          <p className="text-gray-500 mb-4">
            {statusFilter === 'all'
              ? "You haven't submitted any quotes yet"
              : `No quotes with status "${statusFilter}"`}
          </p>
          <Link to="/rfqs">
            <Button>Browse Available RFQs</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyQuotes;
