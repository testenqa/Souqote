import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { RFQFormData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FileUpload from '../../components/ui/file-upload';
import RFQItems from '../../components/ui/rfq-items';
import toast from 'react-hot-toast';

const PostRFQ: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<RFQFormData>({
    title: '',
    description: '',
    category_id: '',
    location: '',
    budget_min: undefined,
    budget_max: undefined,
    deadline: '',
    urgency: 'medium',
    specifications: '',
    requirements: [''],
    images: undefined,
    // New enhanced fields
    rfq_reference: '',
    items: [],
    payment_terms: '',
    delivery_terms: '',
    delivery_date: '',
    delivery_location: '',
    vat_applicable: false,
    vat_rate: 5,
    quotation_validity_days: 30,
    warranty_requirements: '',
    installation_required: false,
    installation_specifications: '',
    currency: 'AED',
    terms_conditions: '',
    contact_person_name: '',
    contact_person_role: '',
    contact_person_phone: '',
    project_reference: '',
    service_type: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name_en');
      
      if (error) throw error;
      return data;
    }
  );

  const postRFQMutation = useMutation(
    async (rfqData: RFQFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      setUploadingFiles(true);
      let attachmentUrls: string[] = [];

      try {
        // Upload files if any
        if (attachments.length > 0) {
          const uploadPromises = attachments.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('rfq-attachments')
              .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from('rfq-attachments')
              .getPublicUrl(fileName);

            return urlData.publicUrl;
          });

          attachmentUrls = await Promise.all(uploadPromises);
        }

        // Create RFQ with attachment URLs and all enhanced fields
        const { data, error } = await supabase
          .from('rfqs')
          .insert({
            buyer_id: user.id,
            title: rfqData.title,
            description: rfqData.description,
            category: rfqData.category_id,
            location: rfqData.location,
            budget_min: rfqData.budget_min,
            budget_max: rfqData.budget_max,
            deadline: rfqData.deadline,
            urgency: rfqData.urgency,
            specifications: rfqData.specifications,
            requirements: rfqData.requirements?.filter(req => req.trim() !== '') || [],
            images: attachmentUrls, // Store attachment URLs in images field
            // New enhanced fields
            rfq_reference: rfqData.rfq_reference,
            items: rfqData.items,
            payment_terms: rfqData.payment_terms,
            delivery_terms: rfqData.delivery_terms,
            delivery_date: rfqData.delivery_date,
            delivery_location: rfqData.delivery_location,
            vat_applicable: rfqData.vat_applicable,
            vat_rate: rfqData.vat_rate,
            quotation_validity_days: rfqData.quotation_validity_days,
            warranty_requirements: rfqData.warranty_requirements,
            installation_required: rfqData.installation_required,
            installation_specifications: rfqData.installation_specifications,
            currency: rfqData.currency,
            terms_conditions: rfqData.terms_conditions,
            contact_person_name: rfqData.contact_person_name,
            contact_person_role: rfqData.contact_person_role,
            contact_person_phone: rfqData.contact_person_phone,
            project_reference: rfqData.project_reference,
            service_type: rfqData.service_type,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setUploadingFiles(false);
      }
    },
    {
      onSuccess: (data) => {
        toast.success('RFQ posted successfully!');
        navigate(`/rfqs/${data.id}`);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to post RFQ');
      },
    }
  );

  const handleInputChange = (field: keyof RFQFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const removeRequirement = (index: number) => {
    if ((formData.requirements || []).length > 1) {
      const newRequirements = (formData.requirements || []).filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requirements: newRequirements }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postRFQMutation.mutate(formData);
  };

  if (categoriesLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Request for Quote</h1>
          <p className="text-gray-600">Create a detailed RFQ on Souqote to get competitive quotes from vendors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>RFQ Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFQ Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Steel Reinforcement Bars for Construction Project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.name_en}>
                        {category.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dubai, UAE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    required
                    value={formData.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quote Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (AED)
                  </label>
                  <input
                    type="number"
                    value={formData.budget_min || ''}
                    onChange={(e) => handleInputChange('budget_min', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (AED)
                  </label>
                  <input
                    type="number"
                    value={formData.budget_max || ''}
                    onChange={(e) => handleInputChange('budget_max', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide a detailed description of what you need. Include quantity, quality requirements, delivery expectations, etc."
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Specifications
                </label>
                <textarea
                  rows={4}
                  value={formData.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Technical specifications, standards compliance, certifications required, etc."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Requirements
                </label>
                <div className="space-y-2">
                  {(formData.requirements || []).map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Minimum 5 years experience, ISO certification"
                      />
                      {(formData.requirements || []).length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                    className="mt-2"
                  >
                    + Add Requirement
                  </Button>
                </div>
              </div>

              {/* Itemized Request Structure */}
              <div className="pt-6 border-t">
                <RFQItems
                  items={formData.items || []}
                  onItemsChange={(items) => handleInputChange('items', items)}
                />
              </div>

              {/* Enhanced RFQ Fields */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                
                {/* RFQ Reference & Project Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RFQ Reference Number
                    </label>
                    <input
                      type="text"
                      value={formData.rfq_reference || ''}
                      onChange={(e) => handleInputChange('rfq_reference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., RFQ-2024-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Reference
                    </label>
                    <input
                      type="text"
                      value={formData.project_reference || ''}
                      onChange={(e) => handleInputChange('project_reference', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Project ABC-2024"
                    />
                  </div>
                </div>

                {/* Service Type & Currency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <input
                      type="text"
                      value={formData.service_type || ''}
                      onChange={(e) => handleInputChange('service_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Supply of sanitary ware, Training & Certification"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency || 'AED'}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AED">AED (UAE Dirham)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="SAR">SAR (Saudi Riyal)</option>
                    </select>
                  </div>
                </div>

                {/* Contact Person Details */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Contact Person Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        value={formData.contact_person_name || ''}
                        onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Eng Mohamad Ameen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role/Title
                      </label>
                      <input
                        type="text"
                        value={formData.contact_person_role || ''}
                        onChange={(e) => handleInputChange('contact_person_role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Project Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.contact_person_phone || ''}
                        onChange={(e) => handleInputChange('contact_person_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., +971 50 123 4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment & Delivery Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Terms
                    </label>
                    <input
                      type="text"
                      value={formData.payment_terms || ''}
                      onChange={(e) => handleInputChange('payment_terms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 30 days, Payment on delivery"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quotation Validity (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quotation_validity_days || 30}
                      onChange={(e) => handleInputChange('quotation_validity_days', parseInt(e.target.value) || 30)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Delivery Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Delivery Date
                      </label>
                      <input
                        type="date"
                        value={formData.delivery_date || ''}
                        onChange={(e) => handleInputChange('delivery_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Terms
                      </label>
                      <input
                        type="text"
                        value={formData.delivery_terms || ''}
                        onChange={(e) => handleInputChange('delivery_terms', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., FOB, CIF, Ex-works"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location (Detailed Address)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.delivery_location || ''}
                      onChange={(e) => handleInputChange('delivery_location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Complete delivery address with landmarks"
                    />
                  </div>
                </div>

                {/* VAT Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Tax Information</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="vat-applicable"
                        checked={formData.vat_applicable || false}
                        onChange={(e) => handleInputChange('vat_applicable', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="vat-applicable" className="ml-2 text-sm text-gray-700">
                        VAT Applicable
                      </label>
                    </div>
                    {formData.vat_applicable && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">VAT Rate:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={formData.vat_rate || 5}
                          onChange={(e) => handleInputChange('vat_rate', parseFloat(e.target.value) || 5)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Installation Requirements */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Installation Requirements</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="installation-required"
                        checked={formData.installation_required || false}
                        onChange={(e) => handleInputChange('installation_required', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="installation-required" className="ml-2 text-sm text-gray-700">
                        Installation Required
                      </label>
                    </div>
                  </div>
                  {formData.installation_required && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Installation Specifications
                      </label>
                      <textarea
                        rows={3}
                        value={formData.installation_specifications || ''}
                        onChange={(e) => handleInputChange('installation_specifications', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Detailed installation requirements, site preparation, etc."
                      />
                    </div>
                  )}
                </div>

                {/* Warranty Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={formData.warranty_requirements || ''}
                    onChange={(e) => handleInputChange('warranty_requirements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2 years warranty, 6 months certificate validity"
                  />
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.terms_conditions || ''}
                    onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any specific terms and conditions for this RFQ"
                  />
                </div>
              </div>

              {/* File Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Upload supporting documents, images, or specifications (PDF, Word, or image files)
                </p>
                <FileUpload
                  onFilesChange={setAttachments}
                  maxFiles={5}
                  maxSize={10}
                  className="mb-4"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/rfqs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={postRFQMutation.isLoading || uploadingFiles}
                >
                  {uploadingFiles ? 'Uploading Files...' : postRFQMutation.isLoading ? 'Posting RFQ...' : 'Post RFQ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostRFQ;
