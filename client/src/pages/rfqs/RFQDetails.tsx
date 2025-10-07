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
import FileUpload from '../../components/ui/file-upload';
import { FileText, Image, MessageCircle } from 'lucide-react';
import ConversationThread from '../../components/messages/ConversationThread';
import toast from 'react-hot-toast';

const RFQDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showMessageThread, setShowMessageThread] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    message: '',
    price: 0,
    currency: 'AED',
    validity_period: 30,
    delivery_time: '',
    terms_conditions: '',
    attachments: [],
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
      
      // Upload attachments if any
      let attachmentUrls: string[] = [];
      if (quoteData.attachments && quoteData.attachments.length > 0) {
        const uploadPromises = quoteData.attachments.map(async (file) => {
          const fileName = `${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('rfq-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('rfq-attachments')
            .getPublicUrl(fileName);

          return publicUrl;
        });

        attachmentUrls = await Promise.all(uploadPromises);
      }

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
          attachments: attachmentUrls.length > 0 ? attachmentUrls : null,
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
          attachments: [],
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

  const withdrawQuoteMutation = useMutation(
    async (quoteId: string) => {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status: 'withdrawn' })
        .eq('id', quoteId)
        .select()
        .single();

      if (error) {
        console.error('Withdraw quote error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Failed to withdraw quote - no data returned');
      }

      return data;
    },
    {
      onSuccess: () => {
        toast.success('Quote withdrawn successfully!');
        queryClient.invalidateQueries(['quotes', id]);
      },
      onError: (error: any) => {
        console.error('Withdraw quote mutation error:', error);
        if (error.message?.includes('new row violates check constraint')) {
          toast.error('Database error: "withdrawn" status not available. Please run the SQL migration first.');
        } else if (error.message?.includes('row-level security')) {
          toast.error('Permission denied: You may not have permission to withdraw this quote.');
        } else {
          toast.error(error.message || 'Failed to withdraw quote');
        }
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

  // Check if vendor has already submitted a quote (excluding withdrawn quotes)
  const vendorQuote = quotes?.find(q => q.vendor_id === user?.id && q.status !== 'withdrawn');
  const canSubmitQuote = user?.user_type === 'vendor' && rfq?.status === 'open' && !vendorQuote;
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
          <div className="flex space-x-2">
            {canSubmitQuote && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowMessageThread(true)}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Buyer</span>
                </Button>
                <Button onClick={() => setShowQuoteForm(true)}>
                  Submit Quote
                </Button>
              </>
            )}
          </div>
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

              {/* Enhanced RFQ Information */}
              {(rfq.rfq_reference || rfq.project_reference || rfq.service_type || rfq.currency) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">RFQ Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rfq.rfq_reference && (
                      <div>
                        <span className="text-gray-500">RFQ Reference:</span>
                        <p className="font-medium">{rfq.rfq_reference}</p>
                      </div>
                    )}
                    {rfq.project_reference && (
                      <div>
                        <span className="text-gray-500">Project Reference:</span>
                        <p className="font-medium">{rfq.project_reference}</p>
                      </div>
                    )}
                    {rfq.service_type && (
                      <div>
                        <span className="text-gray-500">Service Type:</span>
                        <p className="font-medium">{rfq.service_type}</p>
                      </div>
                    )}
                    {rfq.currency && (
                      <div>
                        <span className="text-gray-500">Currency:</span>
                        <p className="font-medium">{rfq.currency}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Person Information */}
              {(rfq.contact_person_name || rfq.contact_person_role || rfq.contact_person_phone) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rfq.contact_person_name && (
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{rfq.contact_person_name}</p>
                      </div>
                    )}
                    {rfq.contact_person_role && (
                      <div>
                        <span className="text-gray-500">Role:</span>
                        <p className="font-medium">{rfq.contact_person_role}</p>
                      </div>
                    )}
                    {rfq.contact_person_phone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{rfq.contact_person_phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items/Services */}
              {rfq.items && rfq.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Items/Services Required</h3>
                  <div className="space-y-4">
                    {rfq.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <div className="text-sm text-gray-600">
                            {item.quantity} {item.unit}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{item.description}</p>
                        {item.specifications && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Specifications:</span> {item.specifications}
                          </p>
                        )}
                        {item.preferred_brand && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Preferred Brand:</span> {item.preferred_brand}
                            {item.acceptable_alternatives && (
                              <span className="text-green-600 ml-2">(Alternatives acceptable)</span>
                            )}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment & Delivery Information */}
              {(rfq.payment_terms || rfq.delivery_terms || rfq.delivery_date || rfq.delivery_location || rfq.quotation_validity_days) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment & Delivery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rfq.payment_terms && (
                      <div>
                        <span className="text-gray-500">Payment Terms:</span>
                        <p className="font-medium">{rfq.payment_terms}</p>
                      </div>
                    )}
                    {rfq.quotation_validity_days && (
                      <div>
                        <span className="text-gray-500">Quote Validity:</span>
                        <p className="font-medium">{rfq.quotation_validity_days} days</p>
                      </div>
                    )}
                    {rfq.delivery_terms && (
                      <div>
                        <span className="text-gray-500">Delivery Terms:</span>
                        <p className="font-medium">{rfq.delivery_terms}</p>
                      </div>
                    )}
                    {rfq.delivery_date && (
                      <div>
                        <span className="text-gray-500">Expected Delivery:</span>
                        <p className="font-medium text-blue-600">{formatDate(rfq.delivery_date)}</p>
                      </div>
                    )}
                  </div>
                  {rfq.delivery_location && (
                    <div className="mt-4">
                      <span className="text-gray-500">Delivery Location:</span>
                      <p className="font-medium">{rfq.delivery_location}</p>
                    </div>
                  )}
                </div>
              )}

              {/* VAT Information */}
              {rfq.vat_applicable && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tax Information</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">VAT Applicable:</span>
                    <span className="font-medium text-green-600">Yes</span>
                    {rfq.vat_rate && (
                      <>
                        <span className="text-gray-500">VAT Rate:</span>
                        <span className="font-medium">{rfq.vat_rate}%</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Installation Requirements */}
              {rfq.installation_required && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Installation Required</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600 font-medium">✓ Installation Required</span>
                  </div>
                  {rfq.installation_specifications && (
                    <p className="text-gray-700">{rfq.installation_specifications}</p>
                  )}
                </div>
              )}

              {/* Warranty Requirements */}
              {rfq.warranty_requirements && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Warranty Requirements</h3>
                  <p className="text-gray-700">{rfq.warranty_requirements}</p>
                </div>
              )}

              {/* Terms & Conditions */}
              {rfq.terms_conditions && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{rfq.terms_conditions}</p>
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

          {/* Vendor's Submitted Quote */}
          {vendorQuote && user?.user_type === 'vendor' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Submitted Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg p-4 ${
                  vendorQuote.status === 'accepted' ? 'border-green-200 bg-green-50' : 
                  vendorQuote.status === 'rejected' ? 'border-red-200 bg-red-50' : 
                  'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Quote Details</h4>
                      <Badge className={
                        vendorQuote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        vendorQuote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        vendorQuote.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                        vendorQuote.status === 'withdrawn' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {vendorQuote.status.charAt(0).toUpperCase() + vendorQuote.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(vendorQuote.price, vendorQuote.currency)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Delivery: {vendorQuote.delivery_time}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="font-medium text-gray-900 mb-1">Your Message:</h5>
                    <p className="text-gray-700">{vendorQuote.message}</p>
                  </div>

                  {vendorQuote.terms_conditions && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-900 mb-1">Terms & Conditions:</h5>
                      <p className="text-sm text-gray-600">{vendorQuote.terms_conditions}</p>
                    </div>
                  )}

                  {vendorQuote.attachments && vendorQuote.attachments.length > 0 && (
                    <div className="mb-3 pb-3 border-b">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h5>
                      <div className="space-y-2">
                        {vendorQuote.attachments.map((attachment, index) => {
                          const fileName = attachment.split('/').pop() || 'file';
                          const isPdf = attachment.toLowerCase().endsWith('.pdf');
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
                          
                          return (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              {isPdf ? (
                                <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                              ) : isImage ? (
                                <Image className="w-4 h-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              )}
                              <span className="text-sm text-blue-600 hover:underline truncate">
                                {decodeURIComponent(fileName)}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Valid for {vendorQuote.validity_period} days</span>
                    <span>Submitted {formatDate(vendorQuote.created_at)}</span>
                  </div>

                  {vendorQuote.status === 'accepted' && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-green-600 font-medium">✓ Your quote has been accepted!</p>
                    </div>
                  )}

                  {vendorQuote.status === 'rejected' && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-red-600 font-medium">✗ Your quote was not accepted</p>
                    </div>
                  )}

                  {vendorQuote.status === 'withdrawn' && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-orange-600 font-medium">⊘ Quote Withdrawn</p>
                      <p className="text-sm text-gray-600 mt-1">You can submit a new quote for this RFQ</p>
                    </div>
                  )}

                  {vendorQuote.status === 'pending' && rfq?.status === 'open' && (
                    <div className="mt-3 pt-3 border-t flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to withdraw this quote? You will be able to submit a new quote after withdrawal.')) {
                            withdrawQuoteMutation.mutate(vendorQuote.id);
                          }
                        }}
                        disabled={withdrawQuoteMutation.isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {withdrawQuoteMutation.isLoading ? 'Withdrawing...' : 'Withdraw Quote'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments (Optional)
                    </label>
                    <FileUpload
                      onFilesChange={(files: File[]) => setQuoteForm({ ...quoteForm, attachments: files })}
                      maxFiles={5}
                      maxSize={10}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Upload supporting documents, images, or proposals (PDF, Word, or Image files, max 10MB each)
                    </p>
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
                      {submitQuoteMutation.isLoading 
                        ? (quoteForm.attachments && quoteForm.attachments.length > 0 
                          ? 'Uploading Files...' 
                          : 'Submitting...') 
                        : 'Submit Quote'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quotes Section - Only visible to buyer */}
        {rfq.buyer_id === user?.id && quotes && quotes.length > 0 && (
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quotes Received ({quotes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className={`border rounded-lg p-4 ${
                      quote.status === 'accepted' ? 'bg-green-50 border-green-200' :
                      quote.status === 'withdrawn' ? 'bg-orange-50 border-orange-200' :
                      'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {quote.vendor?.first_name} {quote.vendor?.last_name}
                          </h4>
                          {quote.vendor?.company_name && (
                            <p className="text-sm text-gray-600">{quote.vendor.company_name}</p>
                          )}
                          <Badge className={
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800 mt-1' :
                            quote.status === 'rejected' ? 'bg-red-100 text-red-800 mt-1' :
                            quote.status === 'expired' ? 'bg-gray-100 text-gray-800 mt-1' :
                            quote.status === 'withdrawn' ? 'bg-orange-100 text-orange-800 mt-1' :
                            'bg-blue-100 text-blue-800 mt-1'
                          }>
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(quote.price, quote.currency)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Delivery: {quote.delivery_time}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{quote.message}</p>
                      
                      {quote.attachments && quote.attachments.length > 0 && (
                        <div className="mb-3 pb-3 border-b">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h5>
                          <div className="space-y-2">
                            {quote.attachments.map((attachment, index) => {
                              const fileName = attachment.split('/').pop() || 'file';
                              const isPdf = attachment.toLowerCase().endsWith('.pdf');
                              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment);
                              
                              return (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                  {isPdf ? (
                                    <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                                  ) : isImage ? (
                                    <Image className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  )}
                                  <span className="text-sm text-blue-600 hover:underline truncate">
                                    {decodeURIComponent(fileName)}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          <span>Valid for {quote.validity_period} days</span>
                          <span className="mx-2">•</span>
                          <span>Submitted {formatDate(quote.created_at)}</span>
                        </div>
                        <div className="flex space-x-2">
                          {quote.status === 'withdrawn' ? (
                            <p className="text-orange-600 font-medium">⊘ Quote Withdrawn</p>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQuote(quote);
                                  setShowMessageThread(true);
                                }}
                                className="flex items-center space-x-1"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Message Vendor</span>
                              </Button>
                              {quote.status === 'pending' && (
                                <Button size="sm">
                                  Accept Quote
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

      {/* Message Thread Modal */}
      {showMessageThread && rfq && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              setShowMessageThread(false);
              setSelectedQuote(null);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <ConversationThread
              rfqId={rfq.id}
              otherUserId={selectedQuote ? selectedQuote.vendor_id : rfq.buyer_id}
              otherUserName={
                selectedQuote 
                  ? `${selectedQuote.vendor?.first_name} ${selectedQuote.vendor?.last_name}`
                  : `${rfq.buyer?.first_name} ${rfq.buyer?.last_name}`
              }
              quoteId={selectedQuote?.id}
              quoteStatus={selectedQuote?.status}
              onClose={() => {
                setShowMessageThread(false);
                setSelectedQuote(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQDetails;
