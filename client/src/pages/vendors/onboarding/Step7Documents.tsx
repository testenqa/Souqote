import React from 'react';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import FileUpload from '../../../components/ui/file-upload';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { VendorOnboardingStep7 } from '../../../types';

interface Step7DocumentsProps {
  data: VendorOnboardingStep7;
  updateData: (data: Partial<VendorOnboardingStep7>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const Step7Documents: React.FC<Step7DocumentsProps> = ({
  data,
  updateData,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}) => {
  const handleFilesChange = (files: File[]) => {
    updateData({ documents: files });
  };

  const handleNext = () => {
    onNext();
  };

  const requiredDocuments = [
    { type: 'trade_license', name: 'Trade License', required: true },
    { type: 'vat_certificate', name: 'VAT Certificate', required: true },
    { type: 'insurance', name: 'Insurance Certificate', required: false },
    { type: 'iso_certificate', name: 'ISO Certificate', required: false },
    { type: 'company_stamp', name: 'Company Stamp', required: false }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-green-900">Document Upload</h3>
            <p className="text-sm text-green-700 mt-1">
              Upload your business documents for verification. Required documents are marked with *.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label className="flex items-center space-x-2 mb-4">
          <FileText className="w-4 h-4" />
          <span>Required Documents</span>
        </Label>
        
        <div className="space-y-3">
          {requiredDocuments.map((doc) => (
            <div key={doc.type} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="font-medium">{doc.name}</span>
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {doc.required ? 'Required' : 'Optional'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="flex items-center space-x-2 mb-4">
          <Upload className="w-4 h-4" />
          <span>Upload Documents</span>
        </Label>
        
        <FileUpload
          onFilesChange={handleFilesChange}
          maxFiles={10}
          maxSize={10}
          acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']}
        />
        
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, JPG, PNG. Maximum file size: 10MB per file.
        </p>
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous: Banking Info
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next: Compliance & Final
        </Button>
      </div>
    </div>
  );
};

export default Step7Documents;
