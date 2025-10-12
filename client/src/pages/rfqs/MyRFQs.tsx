import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { RFQ } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConversationThread from '../../components/messages/ConversationThread';
import toast from 'react-hot-toast';
import { NotificationService } from '../../services/notificationService';

const MyRFQs: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<{
    rfqId: string;
    vendorId: string;
    vendorName: string;
  } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  // Fetch all RFQs for counting
  const { data: allRfqs, isLoading, error } = useQuery(
    ['my-rfqs-all', user?.id],
    async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          quotes (
            id,
            status,
            vendor_id
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RFQ[];
    },
    { enabled: !!user }
  );

  // Filter the RFQs based on selected status
  const rfqs = React.useMemo(() => {
    if (!allRfqs) return [];
    
    if (statusFilter === 'all') {
      return allRfqs;
    }
    
    return allRfqs.filter(rfq => rfq.status === statusFilter);
  }, [allRfqs, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
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

  const getQuoteCount = (rfq: RFQ) => {
    return rfq.quotes?.length || 0;
  };

  const getAcceptedQuoteCount = (rfq: RFQ) => {
    return rfq.quotes?.filter(quote => quote.status === 'accepted').length || 0;
  };

  const handleOpenMessages = async (rfq: RFQ) => {
    // Get the first vendor who has quoted on this RFQ
    const firstQuote = rfq.quotes?.[0];
    if (firstQuote?.vendor_id) {
      try {
        // Fetch vendor information
        const { data: vendor, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, company_name')
          .eq('id', firstQuote.vendor_id)
          .single();
        
        if (vendor && !error) {
          const vendorName = `${vendor.first_name || ''} ${vendor.last_name || ''}`.trim() || vendor.company_name || 'Vendor';
          
          setSelectedConversation({
            rfqId: rfq.id,
            vendorId: firstQuote.vendor_id,
            vendorName: vendorName
          });
        }
      } catch (error) {
        console.error('Error fetching vendor info:', error);
        // Fallback with just the vendor ID
        setSelectedConversation({
          rfqId: rfq.id,
          vendorId: firstQuote.vendor_id,
          vendorName: 'Vendor'
        });
      }
    }
  };

  const canCancelRFQ = (rfq: RFQ) => {
    const hasAcceptedQuotes = rfq.quotes?.some(q => q.status === 'accepted');
    return !hasAcceptedQuotes; // Can cancel if no quotes are accepted
  };

  const handleCancelRFQ = (rfq: RFQ) => {
    if (!canCancelRFQ(rfq)) {
      toast.error('Cannot cancel RFQ with accepted quotes');
      return;
    }

    setSelectedRFQ(rfq);
    setShowCancelModal(true);
    setCancelReason('');
  };

  const confirmCancelRFQ = async () => {
    if (!selectedRFQ || !cancelReason.trim()) {
      toast.error('Please provide a reason for cancelling the RFQ');
      return;
    }

    try {
      // Update RFQ status to cancelled with reason
      const { error: updateError } = await supabase
        .from('rfqs')
        .update({ 
          status: 'cancelled', 
          cancel_reason: cancelReason.trim(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedRFQ.id);

      if (updateError) throw updateError;

      // Update all pending quotes to cancelled status and notify vendors
      if (selectedRFQ.quotes && selectedRFQ.quotes.length > 0) {
        for (const quote of selectedRFQ.quotes) {
          // Only update pending quotes to cancelled status
          if (quote.status === 'pending') {
            const { error: quoteUpdateError } = await supabase
              .from('quotes')
              .update({ 
                status: 'cancelled',
                updated_at: new Date().toISOString() 
              })
              .eq('id', quote.id);

            if (quoteUpdateError) {
              console.error('Error updating quote status:', quoteUpdateError);
            }
          }

          // Notify all vendors (except those who already withdrew)
          if (quote.status !== 'withdrawn') {
            await NotificationService.createNotification(
              quote.vendor_id,
              'quote_status_changed',
              {
                rfq_id: selectedRFQ.id,
                rfq_title: selectedRFQ.title,
                change_type: 'rfq_cancelled',
                cancel_reason: cancelReason.trim()
              },
              'RFQ Cancelled',
              `The RFQ "${selectedRFQ.title}" has been cancelled by the buyer. Reason: ${cancelReason.trim()}`
            );
          }
        }
      }

      toast.success('RFQ cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedRFQ(null);
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling RFQ:', error);
      toast.error('Failed to cancel RFQ. Please try again.');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading your RFQs</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My RFQs</h1>
            <p className="text-gray-600">Manage your posted requests for quotes</p>
          </div>
          <Link to="/post-rfq">
            <Button>Post New RFQ</Button>
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
            All ({allRfqs?.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'open'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Open ({allRfqs?.filter(rfq => rfq.status === 'open').length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            In Progress ({allRfqs?.filter(rfq => rfq.status === 'in_progress').length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('awarded')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'awarded'
                ? 'bg-purple-100 text-purple-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Awarded ({allRfqs?.filter(rfq => rfq.status === 'awarded').length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cancelled ({allRfqs?.filter(rfq => rfq.status === 'cancelled').length || 0})
          </button>
        </div>
      </div>

      {/* RFQs List */}
      <div className="space-y-4">
        {rfqs?.map((rfq) => (
          <Card key={rfq.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {rfq.title}
                    </h3>
                    <Badge className={getStatusColor(rfq.status)}>
                      {rfq.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getUrgencyColor(rfq.urgency)}>
                      {rfq.urgency}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {rfq.description}
                  </p>
                </div>
                <Link to={`/rfqs/${rfq.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{rfq.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{rfq.location}</p>
                </div>
                {rfq.budget_min && rfq.budget_max && (
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <p className="font-medium">
                      {formatCurrency(rfq.budget_min)} - {formatCurrency(rfq.budget_max)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Deadline:</span>
                  <p className="font-medium text-red-600">
                    {formatDate(rfq.deadline)}
                  </p>
                </div>
              </div>

              {/* Cancellation Reason */}
              {rfq.status === 'cancelled' && rfq.cancel_reason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Cancellation Reason:</span> {rfq.cancel_reason}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>Posted {formatDate(rfq.created_at)}</span>
                  <span>{getQuoteCount(rfq)} quotes received</span>
                  {getAcceptedQuoteCount(rfq) > 0 && (
                    <span className="text-green-600 font-medium">
                      {getAcceptedQuoteCount(rfq)} accepted
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {canCancelRFQ(rfq) && rfq.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelRFQ(rfq)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Cancel RFQ
                    </Button>
                  )}
                  {rfq.status === 'cancelled' && (
                    <Link to={`/rfqs/${rfq.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        View Details
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenMessages(rfq)}
                    disabled={!rfq.quotes || rfq.quotes.length === 0}
                  >
                    Messages
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rfqs?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No RFQs found</div>
          <p className="text-gray-500 mb-4">
            {statusFilter === 'all'
              ? "You haven't posted any RFQs yet"
              : `No RFQs with status "${statusFilter}"`}
          </p>
          <Link to="/post-rfq">
            <Button>Post Your First RFQ</Button>
          </Link>
        </div>
      )}

      {/* Messages Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Messages with {selectedConversation.vendorName}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedConversation(null)}
              >
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationThread
                otherUserId={selectedConversation.vendorId}
                otherUserName={selectedConversation.vendorName}
                rfqId={selectedConversation.rfqId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cancel RFQ Modal */}
      {showCancelModal && selectedRFQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel RFQ
              </h3>
              <p className="text-gray-600 mb-4">
                You are about to cancel the RFQ "{selectedRFQ.title}". 
                All vendors with submitted quotes will be notified with your reason.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this RFQ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This reason will be shared with all vendors who submitted quotes.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedRFQ(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmCancelRFQ}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel RFQ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRFQs;
