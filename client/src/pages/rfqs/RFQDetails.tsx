import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { RFQ, Quote, QuoteFormData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const RFQDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    message: '',
    price: 0,
    currency: 'AED',
    validity_period: 30,
    delivery_time: '',
    terms_conditions: '',
  });

  const { data: rfq, isLoading: rfqLoading } = useQuery(
    ['rfq', id],
    async () => {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          buyer:users!rfqs_buyer_id_fkey (
            id,
            first_name,
            last_name,
            company_name,
            rating,
            total_rfqs
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as RFQ;
    },
    { enabled: !!id }
  );

  const { data: quotes, isLoading: quotesLoading } = useQuery(
    ['quotes', id],
    async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          vendor:users!quotes_vendor_id_fkey (
            id,
            first_name,
            last_name,
            company_name,
            rating,
            total_quotes
          )
        `)
        .eq('rfq_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Quote[];
    },
    { enabled: !!id }
  );

  const submitQuoteMutation = useMutation(
    async (quoteData: QuoteFormData) => {
      if (!user || !rfq) throw new Error('User or RFQ not found');
      
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          rfq_id: rfq.id,
          vendor_id: user.id,
          price: quoteData.price,
          currency: quoteData.currency,
          validity_period: quoteData.validity_period,
          delivery_time: quoteData.delivery_time,
          message: quoteData.message,
          terms_conditions: quoteData.terms_conditions,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        toast.success('Quote submitted successfully!');
        setShowQuoteForm(false);
        setQuoteForm({
          message: '',
          price: 0,
          currency: 'AED',
          validity_period: 30,
          delivery_time: '',
          terms_conditions: '',
        });
        queryClient.invalidateQueries(['quotes', id]);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to submit quote');
      },
    }
  );

  const acceptQuoteMutation = useMutation(
    async (quoteId: string) => {
      if (!rfq) throw new Error('RFQ not found');
      
      // Update quote status to accepted
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);

      if (quoteError) throw quoteError;

      // Update RFQ status to awarded
      const { error: rfqError } = await supabase
        .from('rfqs')
        .update({ status: 'awarded' })
        .eq('id', rfq.id);

      if (rfqError) throw rfqError;
    },
    {
      onSuccess: () => {
        toast.success('Quote accepted successfully!');
        queryClient.invalidateQueries(['rfq', id]);
        queryClient.invalidateQueries(['quotes', id]);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to accept quote');
      },
    }
  );

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
      month: 'long',
      day: 'numeric',
    });
  };

  const canSubmitQuote = user?.user_type === 'vendor' && rfq?.status === 'open';
  const isBuyer = user?.user_type === 'buyer' && rfq?.buyer_id === user.id;

  if (rfqLoading) return <LoadingSpinner />;
  if (!rfq) return <div className="text-red-500">RFQ not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/rfqs" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to RFQs
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{rfq.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>By {rfq.buyer?.first_name} {rfq.buyer?.last_name}</span>
              {rfq.buyer?.company_name && (
                <span>• {rfq.buyer.company_name}</span>
              )}
              <Badge className={getUrgencyColor(rfq.urgency)}>
                {rfq.urgency}
              </Badge>
            </div>
          </div>
          {canSubmitQuote && (
            <Button onClick={() => setShowQuoteForm(true)}>
              Submit Quote
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RFQ Details */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>RFQ Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{rfq.description}</p>
              </div>

              {rfq.specifications && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{rfq.specifications}</p>
                </div>
              )}

              {rfq.images && rfq.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Attachments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rfq.images.map((attachment, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                            {attachment.includes('.pdf') ? (
                              <FileText className="w-5 h-5 text-red-500" />
                            ) : attachment.includes('.doc') ? (
                              <FileText className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Image className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.split('/').pop()}
                            </p>
                            <a
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              View/Download
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rfq.requirements && rfq.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {rfq.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{rfq.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{rfq.location}</p>
                </div>
                {rfq.budget_min && rfq.budget_max && (
                  <>
                    <div>
                      <span className="text-gray-500">Budget Range:</span>
                      <p className="font-medium">
                        {formatCurrency(rfq.budget_min)} - {formatCurrency(rfq.budget_max)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <p className="font-medium text-red-600">
                        {formatDate(rfq.deadline)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quote Form */}
          {showQuoteForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Submit Your Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitQuoteMutation.mutate(quoteForm);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (AED)
                      </label>
                      <input
                        type="number"
                        required
                        value={quoteForm.price}
                        onChange={(e) => setQuoteForm({ ...quoteForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Time
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 2-3 weeks"
                        value={quoteForm.delivery_time}
                        onChange={(e) => setQuoteForm({ ...quoteForm, delivery_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your proposal, experience, and why you're the best choice..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms & Conditions
                    </label>
                    <textarea
                      rows={3}
                      value={quoteForm.terms_conditions}
                      onChange={(e) => setQuoteForm({ ...quoteForm, terms_conditions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Payment terms, warranty, etc."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowQuoteForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitQuoteMutation.isLoading}
                    >
                      {submitQuoteMutation.isLoading ? 'Submitting...' : 'Submit Quote'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Quotes */}
          <Card>
            <CardHeader>
              <CardTitle>
                Quotes ({quotes?.length || 0})
                {isBuyer && rfq.status === 'open' && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - You can accept quotes
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <LoadingSpinner />
              ) : quotes && quotes.length > 0 ? (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className={`border rounded-lg p-4 ${
                        quote.status === 'accepted' ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {quote.vendor?.first_name} {quote.vendor?.last_name}
                          </h4>
                          {quote.vendor?.company_name && (
                            <p className="text-sm text-gray-600">{quote.vendor.company_name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(quote.price, quote.currency)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Delivery: {quote.delivery_time}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{quote.message}</p>

                      {quote.terms_conditions && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-1">Terms & Conditions:</h5>
                          <p className="text-sm text-gray-600">{quote.terms_conditions}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Valid for {quote.validity_period} days</span>
                        <span>Submitted {formatDate(quote.created_at)}</span>
                      </div>

                      {isBuyer && rfq.status === 'open' && quote.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t">
                          <Button
                            size="sm"
                            onClick={() => acceptQuoteMutation.mutate(quote.id)}
                            disabled={acceptQuoteMutation.isLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {acceptQuoteMutation.isLoading ? 'Accepting...' : 'Accept Quote'}
                          </Button>
                        </div>
                      )}

                      {quote.status === 'accepted' && (
                        <div className="mt-3 pt-3 border-t">
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Accepted
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No quotes submitted yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge className={rfq.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {rfq.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Posted:</span>
                <span>{formatDate(rfq.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="text-red-600">{formatDate(rfq.deadline)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quotes:</span>
                <span>{quotes?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          {rfq.buyer && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Buyer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {rfq.buyer.first_name} {rfq.buyer.last_name}
                  </p>
                  {rfq.buyer.company_name && (
                    <p className="text-gray-600">{rfq.buyer.company_name}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Rating:</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">
                        {rfq.buyer.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {rfq.buyer.total_rfqs} RFQs posted
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQDetails;
